# 每周总结可以写在这里(4.27 - 5.3)
### 结构化程序设计

#### 事件循环

> 事件循环属于 Node 或浏览器里的内容，不是 JavaScript 语言的一部分，但是 JavaScript 有一个基于**事件循环**的并发模型，事件循环负责执行代码、收集和处理事件以及执行队列中的子任务

- 事件循环是浏览器执行任务的机制，它会不断循环判断消息队列中是否有任务，队列中的任务都是指宏任务，而宏任务中包含微任务队列，在宏任务结束前后执行微任务队列，知道微任务队列中为空才结束这个宏任务

#### 宏任务和微任务

- 列表里的所有微任务执行完才会执行下一个宏任务；
- 一个宏任务只存在一个微任务队列，根据入队时间决定微任务的顺序，当前宏任务执行完成后才会执行下一个宏任务；
- setTimeout 会产生宏任务；
- JS 代码都是微任务；



#### 代码示例

```
async function afoo(){
    console.log("-2");
    await new Promise(resolve => resolve());
    console.log("-1");
}

new Promise(resolve => (console.log("0"), resolve()))
    .then(()=>(
        console.log("1"), 
        new Promise(resolve => resolve())
            .then(() => console.log("1.5")) ));

setTimeout(function(){
    console.log("2");
    new Promise(resolve => resolve()) .then(console.log("3"));
}, 0);
console.log("4");
console.log("5");
afoo();

// 0                          
// 4
// 5
// -2
// 1
// -1
// 1.5
Promise {<resolved>: undefined}
// 2
// 3
```

- 宏任务
  - 0 ，4，5，-2 
    - 入队 1，-1
  - 1
    - 入队 1.5
  - -1
  - -1.5
- 宏任务
  - 2
  - 3



> *,(逗号)* ：JS 代码中显示逗号后面的值，前面的值也会执行
>
> ```
> var x = (1, 2 3)
> console.log(x) ==> 3
> ```

