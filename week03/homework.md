* 根据这节课上讲师已写好的部分，补充写完函数 convertStringToNumber

```
function convertStringToNumber(string, x) {
  if(arguments.length < 2)
    x = 10;
  var chars = string.split('');
  var number = 0;
  var i =0;
  while(i < chars.length && chars[i] != '.' && chars[i] != 'e' && chars[i] != 'E') {
    number = number * x;
    number += chars[i].codePointAt(0) - '0'.codePointAt(0);
    i++;
  }
  if(chars[i] === '.')
    i++;
  var fraction = 1;
  while(i < chars.length && chars[i] != 'e' && chars[i] != 'E') {
    fraction = fraction / x;
    number += (chars[i].codePointAt(0) - '0'.codePointAt(0)) * fraction;
    i++;
  }
  if(chars[i] === 'e' || chars[i] === 'E')
    i++;
  var exponent = '';
  while(i < chars.length) {
    exponent += chars[i];
    i++
  }
  number = number * x ** exponent;
  return number;
}

```



* 以及函数 convertNumberToString 

```
function convertNumberToString(number, x = 10) {
    var integer = Math.floor(number);
    var fraction = null;
    if (x === 10)
        fraction = ('' + number).match(/.\d*/)[0];
    var string = ''
    while(integer > 0) {
      string = integer % x + string;
      integer = Math.floor(integer / x);
    }
    return fraction ? string + fraction : string;
}
```

* 根据课上老师的示范，找出 JavaScript 标准里所有的对象，分析有哪些对象是我们无法实现出来的，这些对象都有哪些特性？ 

  * Bound Function Exotic Objects 

    * `[[Call]]` `[[Construct]]` 

  * Array Exotic Objects 

    *  `[[DefineOwnProperty]]` `ArrayCreate(length[,proto])` `ArraySpeciesCreate(originalArray,length)` `ArraySetLength(A,Desc)` 

  * String Exotic Objects 

    * `[[GetOwnProperty]]` `[[DefineOwnProperty]]` `[[OwnPropertyKeys]]` `StringCreate(value,prototype)` `StringGetOwnProperty(S,P)` 

  * Arguments Exotic Objects 

    * `[[GetOwnProperty]]` `[[DefineOwnProperty]]` `[[Get]]` `[[Set]]` `[[Delete]]` `CreateUnmappedArgumentsObject(argumentsList)` `CreateMappedArgumentsObject(func,formals,argumentsList,env)` 

  * Integer-Indexed Exotic Objects 

    * `[[GetOwnProperty]]` `[[HasProperty]]` `[[DefineOwnProperty]]` `[[Get]]` `[[Set]]` `[[OwnPropertyKeys]]` `IntegerIndexedObjectCreate(prototype,internalSlotsList)` `IntegerIndexedElementGet(O,index)` `IntegerIndexedElementSet(O,index,value)` 

  * Module Namespace Exotic Objects 

    * `[[SetPrototypeOf]]` `[[IsExtensible]]` `[[PreventExtensions]]` `[[GetOwnProperty]]` `[[DefineOwnProperty]]` `[[HasProperty]]` `[[Get]]` `[[Set]]` `[[Delete]]` `[[OwnPropertyKeys]]` `ModuleNamespaceCreate(module,exports)` 

  * Immutable Prototype Exotic Objects 

    *  `[[SetPrototypeOf]]` `SetImmutablePrototype` 

