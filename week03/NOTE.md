# 每周总结可以写在这里(4.20-4.26)



#### 1. 表达式（Expressions）

##### 1.1 Grammar

> 优先级

- Member

  - a.b
  - a[b]
  - foo\`string\`

  ```
  var name = 'vole';
  function foo(){
      console.log(arguments);
  }
  foo`Hello ${name}!`;
  ```

  - super.b   (super 调用父类的方法)
  - super['b']
  - new.target (只能在函数里面用，判断被哪一个 new 调用的)
  - new Foo() (带 *()* 的优先级更高)

  > 返回 [Reference](https://www.zhihu.com/question/31911373) 类型，

- New

  - new Foo()

- Call 

  - foo()
  - super()
  - foo()['b']
  - foo().b
  - foo()\`abc`

  ```
  class foo {
      constructor(){
          this.b=1;
      }
  }
  new foo()['b'];
  ```

- Left Handside & Right Handside

  > a.b = c
  >
  > a+b = c

- Update

  - a ++
  - a --
  - -- a
  - ++ a

- Unary 

  - delete a.b
  - void foo()  (把后面所有变成 undefined)

  ```
  for(var i = 0; i< 10; i++){
      var button = document.createElement("button");
      document.body.appendChild(button);
      button.innerHTML = i;
      void function(i){
          button.onclick = function(){
              console.log(i)
          }
      }(i);
  }
  ```

  - typeof a 
  - \+ a
  - \-  a
  - ~ a
  - \! a 
  - await a  

- Exponental

  - **   

    > 3 ** 2 ** 3
    >
    > 3 ** ( 2 ** 2)

- Multiplicative
  - \* / % 
- Additive
  - \+  -
- Shift
  - <<    >>   >>>
- Relationship
  - <   >   <=   >=   instanceof   in  
- Equality
  - ==
  - !=
  - ===
  - !==
- Bitwise
  - &  ^  |
- Logical
  - &&  (短路)
  - ||
- Conditional
  - ?  :   [三元运算](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Conditional_Operator>) 

##### 1.2 Type Convertion

![Type Convertion](https://github.com/volewu/Frontend-01-Template/blob/master/week03/static/Type%20Convertion.PNG)

- Boxing & UnBoxing

#### 2. 语句

##### 2.1 Grammar

- 简单语句

  - ExpressionStatement      `a = 1 +2 `
  - EmptyStatement              `;`
  - DebuggerStatement        `debugger;`
  - ThrowStatement               `throw`
  - ContinueStatement         `continue lable1`
  - BreakStatement               `break lable2`
  - ReturnStatement             `return 1 + 2`

- 组合语句

  - BlockStatement        (执行到非 normal, 后面将不会执行)
  - IfStatement
  - SwitchStatement
  - IterationStatement 

  - WithStatement
  - LablelledStatement
  - TryStatement

  ##### 2.2 声明

  * FunctionDeclaration
  * GeneratorDeclaration
  * AsyncFunctionDeclaration
  * AsyncGeneratorDeclaration
  * VariableStatement
  * ClassDeclaration
  * LexicalDeclaration

##### 2.3 Runtime

- Completion Record (语句完成的记录)
  - [[type]]: normal, break, continue, return, or thorw
  - [[value]]: Types
  - [[target]]: lable   （跟循环相关，语句完成状态的描述）
- Lexical Enviorment



#### 3. Object





