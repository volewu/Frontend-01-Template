# 每周总结可以写在这里(5.4 - 5.10)

### HTTP 协议 + 语法与词法分析

* 一个 URL 变成一个屏幕上显示的网页的过程

1. 浏览器首先使用 HTTP 协议或者 HTTPS 协议，向服务端请求页面；
2. 把请求回来的 HTML 代码经过解析，构建成 DOM 树；
3. 计算 DOM 树上的 CSS 属性；
4. 最后根据 CSS 属性对元素逐个进行渲染，得到内存中的位图；
5. 一个可选的步骤是对位图进行合成，这会极大地增加后续绘制的速度；
6. 合成之后，再绘制到界面上。



| TCP            | IP             |
| -------------- | -------------- |
| 流             | 包             |
| 端口           | IP             |
| require('net') | libnet/libpcap |

