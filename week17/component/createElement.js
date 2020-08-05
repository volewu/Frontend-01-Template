import {
  enableGesture
} from "./gesture";

export function createElement(Cls, attributes, ...children){
  
  let o 
  if (typeof Cls === 'string'){
    // 解决当，元素是小写的时候，传过来的cls是字符串的行为 'div'
    o = new Wrap(Cls)
  } else {
    o = new Cls
  }

  for(let name in attributes){
    // 设置property
    // o[name] = attributes[name]
    // 设置attribute
    o.setAttribute(name, attributes[name])
  }

  // 处理child
  let visit = (children) => {
    for(let child of children){
      if(typeof child === 'object' && child instanceof Array){
        visit(child)
        continue
      }
      if(typeof child === 'string')
        child = new Text(child)
      o.appendChild(child)
    }
  }

  visit(children)

  return o
}

// 处理文本节点
export class Text {
  constructor(text){
    this.children = []
    this.root = document.createTextNode(text)
  }
  mountTo(parent){
    parent.appendChild(this.root)
  }
  getAttribute(name) {
    return 
  }
}

export class Wrap{
  constructor(type) {
    this.children = []
    this.root = document.createElement(type)
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value)

    if(name.match(/^on([\s\S]+)$/)){
      let eventName = RegExp.$1.replace(/^[\s\S]/, c => c.toLocaleLowerCase())
      this.addEventListener(eventName, value)
    }
    if (name === 'enableGesture') {
      enableGesture(this.root)
    }
  }

  getAttribute(name) {
    return this.root.getAttribute(name)
  }

  appendChild(child){
    this.children.push(child)
  }
  get style(){
    return this.root.style
  }

  get classList() {
    return this.root.classList
  }
  set innerText(text){
    return this.root.innerText = text
  }
  addEventListener(type, fn){
    this.root.addEventListener(type, fn)
  }
  mountTo(parent){
    parent.appendChild(this.root)
    for(let child of this.children){
      child.mountTo(this.root)
    }
  }
}