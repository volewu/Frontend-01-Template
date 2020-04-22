# 每周总结可以写在这里
# 第二周（4.13-4.19）学习心得

### 语言按语法分类

* 非形式语言
  * 中文，英文
* 形式语言（乔姆斯基谱系）
  * 0 型 无限制文法
  * 1 型 上下文相关文法
  * 2 型 上下文无关文法
  * 3 型 正则文法（能用正则表达式解析的文法）
  
  ```
  <Program>::=<Program> "a"+| <Program>"b"+
<Number> ::= "0" | "1" |...|"9"
<DecimalNumer> ::="0" |(("1"|..|"3") <Number>*)   /0|[1-9][0-9]*/

Number("123")     // 123
Number("12.3")    // 12.3
Number("")        // 0
Number("0x11")    // 17
Number("0b11")    // 3
Number("0o11")    // 9
Number("itbilu.com")     // NaN
Number("100a")    // NaN
// 整数
let integer = /^-?[0-9]+$/;  
// 浮点数
let floatPointNumber = /^[+-]?[0-9]*\.[0-9]*$/; 
// 二进制 0b
let binaryNumber = /^0b[01]+$/;
// 八进制 0o
let  octalNumber = /^0o[0-7]+$/;
// 十六进制 0x
let hexadecimalNumber = /^0x[0-9][a-f][A-F]+$/;

// Unicode特殊字符 [\u0021-\u007E]{6,16}
// ASCII特殊字符 [\x21-\x7E]{6,16}
// 基本汉字+基本汉字补充 [\u4E00-\u9FEF]
let result = /[\u0021-\u007E]{6,16}|[\x21-\x7E]{6,16}|[A-z]|[\u4E00-\u9FEF]/;
  ```
  https://github.com/LiSY0418/Frontend-01-Template/blob/master/week02/2UTF-8%20Encoding.html
  https://github.com/TomatoDroid/Frontend-01-Template/blob/master/week02/NOTE.md
  
  有隐式转化的叫弱类型
