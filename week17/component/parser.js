// 去掉处理css部分
const EOF = Symbol('EOF');

// export default parserHtml
let currentToken = null;
let currentAttribute = null;

let stack = [{type: 'document', children: []}]
let currentTextNode = null


// 
// 把css规则暂存到一个数组里
let rules = []

function match(element, selector) {
  if (!selector || !element.attributes)
    return false;

  if (selector.charAt(0) == '#') {
    var attr = element.attributes.filter(attr => attr.name === 'id')[0]
    if(attr && attr.value === selector.replace('#',''))
      return true;
  } else if (selector.charAt(0) == '.') {
    // 1. 实现复合选择器
    // 2. 补全空格的class 逻辑 class = 'item active'
    var attr = element.attributes.filter(attr => attr.name === 'class')[0]
    if(attr && attr.value === selector.replace('.', ''))
      return true;
  } else {
    if (element.tagName === selector)
      return true;
  }
}

// 解决优先级
function specificity(selector) {
  var p = [0,0,0,0]
  var selectorParts = selector.split(' ')
  for(var part of selectorParts) {
    if (part.charAt(0) == '#') {
      p[1] += 1;
    } else if (part.charAt(0) == '.') {
      p[2] += 1;
    } else {
      p[3] += 1;
    }
  }
  return p;
}

function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0]
  }
  if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1]
  }
  if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2]
  }

  return sp1[3] - sp2[3]
}


function emit(token){
  let top = stack[stack.length -1]

  if (token.type == 'startTag') {
    let element = {
      type: 'element',
      children: [],
      attributes: []
    }

    element.tagName = token.tagName

    for(let p in token) {
      if (p != 'type' && p != 'tagName')
        element.attributes.push({
          name: p,
          value: token[p]
        });
    }


    top.children.push(element)
    element.parent = top

    if (!token.isSelfClosing)
      stack.push(element);
    
    currentTextNode = null
  } else if(token.type == 'endTag'){
    if (top.tagName != token.tagName) {
      throw new Error('Tag start end doesn\'t match!')
    } else {
      // 遇到style标签时，执行添加css规则的操作
      if (top.tagName === 'style') {
        // addCSSRules(top.children[0].content)
      }
      stack.pop()
    }
    currentTextNode = null
  } else if (token.type == "text") {
    if(currentTextNode == null) {
      currentTextNode = {
        type: 'text',
        content: ''
      }
      top.children.push(currentTextNode)
    }
    currentTextNode.content += token.content
  }
}


function data(c){
 if (c == '<') {
   return tagOpen;
 } else if (c == EOF) {
   emit({
     type: "EOF"
   })
   return ;
 } else {
   emit({
     type: 'text',
     content: c
   })
   return data
 }
}
function tagOpen(c) {
  if (c == '/') {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)){
    currentToken = {
      type: 'startTag',
      tagName: ''
    };
    // Reconsume
    return tagName(c);
  } else {
    emit({
      type: 'text',
      content: c
    })
    // return ;
    return tagOpen;
  }
}

function tagName(c) {
  if (c.match(/^[\t\n\f ]$/)){
    return beforeAttributeName;
  } else if (c == '/') {
    return selfClosingStartTag;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c//.toLowerCase
    return tagName;
  } else if(c == '>') {
    emit(currentToken);
    return data;
  } else {
    currentToken.tagName += c//.toLowerCase
    return tagName;
  }
}

function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if(c == '/' || c == '>'||c==EOF) {
    return afterAttributeName(c);
  } else if(c == '='){
    // return beforeAttributeName
  }
  else {
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(c);
  }
}

function attributeName(c){
  if(c.match(/^[\t\n\f ]$/)||c == '/' || c == '>'||c==EOF) {
    return afterAttributeName(c);
  } else if(c == '='){
    return beforeAttributeValue
  } else if(c == '\u0000'){

  } else if(c == '\"'||c == '\'' || c == '<'){

  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)||c == '/' || c == '>'||c==EOF){
    return beforeAttributeValue
  } else if(c == '\"'){
    return doubleQuotedAttributeValue;
  } else if(c == '\''){
    return singleQuetedAttributeValue;
  } else if(c == '>'){
    return data;
  } else {
    return UnquotedAttributeValue(c)
  }
}

function doubleQuotedAttributeValue(c) {
  if (c == '\"'){
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if(c == '\u0000'){

  } else if(c == EOF) {

  } else {
    currentAttribute.value +=c
    return doubleQuotedAttributeValue
  }
}

function singleQuetedAttributeValue(c) {
  if (c == '\''){
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue
  } else if(c == '\u0000'){

  } else if(c == EOF){

  } else {
    currentAttribute.value += c
    return singleQuetedAttributeValue
  }
}

function afterQuotedAttributeValue(c) {
  if(c.match(/^[\t\n\f ]$/)){
    return beforeAttributeName
  } else if(c == '/') {
    return selfClosingStartTag;
  } else if(c == '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if(c == EOF) {

  } else {
    currentAttribute.value += c
    return doubleQuotedAttributeValue
  }
}

function UnquotedAttributeValue(c) {
  if(c.match(/^[\t\n\f ]$/)){
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if(c == '/') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if(c == '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if(c == '\u0000') {

  } else if(c == '\"' || c == '\"' || c == '<' || c =='=' || c == '`'){

  } else {
    currentAttribute.value +=c
    return UnquotedAttributeValue
  }
}

function selfClosingStartTag(c) {
  if (c == '>') {
    currentToken.isSelfClosing = true;
    emit(currentToken)
    return data;
  } else if(c == 'EOF') {

  } else {

  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "endTag",
      tagName: ''
    }
    return tagName(c)
  } else if(c == '>') {

  } else if(c == EOF) {

  } else {

  }
}

// in script
function scriptData(c){
  if(c == "<") {
    return scriptDataLessThanSign
  } else {
    emit({
      type: "text",
      content: c
    })
    return scriptData
  }
}

// in script received <
function scriptDataLessThanSign(c){
  if(c == "/") {
    return scriptDataEndTagOpen
  } else {
    emit({
      type: "text",
      content: '<'
    })
    emit({
      type: "text",
      content: c
    })
    return scriptData
  }
}

// in script received </
function scriptDataEndTagOpen(c){
  if(c == "s") {
    return scriptDataEndTagNameS
  } else {
    emit({
      type: "text",
      content: '<'
    })
    emit({
      type: "text",
      content: '/'
    })
    emit({
      type: "text",
      content: c
    })
    return scriptData
  }
}

// in script received </s
function scriptDataEndTagNameS(c){
  if(c == "c") {
    return scriptDataEndTagNameC
  } else {
    emit({
      type: "text",
      content: '</s'
    })
    emit({
      type: "text",
      content: c
    })
    return scriptData
  }
}

// in script received </sc
function scriptDataEndTagNameC(c){
  if(c == "r") {
    return scriptDataEndTagNameR
  } else {
    emit({
      type: "text",
      content: '</sc'
    })
    emit({
      type: "text",
      content: c
    })
    return scriptData
  }
}

// in script received </scr
function scriptDataEndTagNameR(c){
  if(c == "i") {
    return scriptDataEndTagNameI
  } else {
    emit({
      type: "text",
      content: '</scr'
    })
    emit({
      type: "text",
      content: c
    })
    return scriptData
  }
}

// in script received </scri
function scriptDataEndTagNameI(c){
  if(c == "p") {
    return scriptDataEndTagNameP
  } else {
    emit({
      type: "text",
      content: '</scri'
    })
    emit({
      type: "text",
      content: c
    })
    return scriptData
  }
}
// in script received </scrip
function scriptDataEndTagNameP(c){
  if(c == "t") {
    return scriptDataEndTag
  } else {
    emit({
      type: "text",
      content: '</scrip'
    })
    emit({
      type: "text",
      content: c
    })
    return scriptData
  }
}
// in script received </scrit
function scriptDataEndTag(c){
  if(c == " ") {
    return scriptDataEndTag
  } else if(c == ">"){
    emit({
        type: "endTag",
        tagName: 'script'
    })
    return data
  }else {
    emit({
      type: "text",
      content: '</script'
    })
    emit({
      type: "text",
      content: c
    })
    return scriptData
  }
}
  

function afterAttributeName(c){
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if(c == '/') {
    return selfClosingStartTag;
  } else if(c == '='){
    return beforeAttributeValue
  } else if(c == '>'){
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken)
    return data
  } else if(c == EOF){
    // return beforeAttributeName
  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(c);
  }
}





module.exports.parserHtml = function parserHtml(html) {
  let state = data;
  for (let c of html) {
    state = state(c)
    // 当前是script，就进入script状态
    if(stack[stack.length -1].tagName === 'script'&&state == data) {
      state = scriptData
    }
  }
  state = state(EOF)
  return stack[0]
}