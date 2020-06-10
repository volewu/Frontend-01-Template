# 每周总结可以写在这里(6.1 - 6.7)

### 1. 重学CSS | CSS动画

##### Animation

- animation-name 时间曲线
- animation-duration 动画的时长
- animation-timing-function 动画的时间曲线
- animation-delay 动画开始前的延迟
- animation-iteration-count 动画播放次数
- animation-direction 动画方向

##### Transition

- transition-property 要变换的属性
- transition-duration 变换的时长
- transition-timing-function 时间曲线
- transition-delay 延迟

### 2. 重学 HTML

#####  HTML 标签 - 语义

* header : 通常出现在前部，表示导航或者介绍性的内容
* nav : 导航链接的部分
* aside : 表示跟文章主体不那么相关的部分，它可能包含导航、广告等工具性质的内容
* article : 它表示具有一定独立性质的文章
* main : 整个页面只出现一个，表示页面的主要内容，可以理解成特殊的 div
* section : 一个文档或应用程序的通用部分
* time : 时间
* address : 表示“文章（作者）的联系方式”，address 明确地只关联到 article 和 body
* footer : 通常出现在尾部，包含一些作者信息、相关链接、版权信息等

###  3. 重学 DOM

##### Node

* Element：元素型节点，跟标签对应。namespace 划分
  - HTMLElement
  - SVGElement
  - ...
* Document：文档根节点
* CharacterDate：字数数据
  - Text：文本节点
  - Comment：注释
  - ProcessingInstruction：处理信息
* DocumentFragment：文档片段 ---- 批量添加处理元素
* DocumentType：文档类型

##### 导航类操作

| Node (推荐)       | Element                |
| --------------- | ---------------------- |
| parentNode      | ParentElement          |
| childNodes      | children               |
| firstChild      | firstElementChild      |
| lastChild       | lastElementChild       |
| nextSibling     | nextElementSibling     |
| previousSibling | previousElementSibling |

##### 修改操作

- appendChild
- insertBefore
- removeChild
- replaceChild

**所有的 DOM 元素默认只有一个父元素，不能两次被插入到 DOM trees 中，同一个节点先插入到 DOM trees 中 A 位置，再插入到 B 位置，会默认从 A 位置 remove 掉。**

**childNodes 是一个 living Collection，执行 removeChild 或者其他修改操作后，childNodes 会实时改变。**

