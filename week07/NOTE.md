# 每周总结可以写在这里(5.18 - 5.24)

### CSS 基本语法

#### 1. CSS 总体结构

* @charset

* @import

* rules

  * @media
  * @page
  * rule

  ```
  <style>
  <!--
  addd
  -->
  <style>
  <!-- addd  --> 这不是注释， 里面内容有效，让不支持 CSS 的浏览器不显示
  CSS 只有一种注释 /* */
  ```



* 爬取 CSS 标准(<https://www.w3.org/TR/?tag=css>)

```
var lis = document.getElementById("container").children
 
 
var result = [];
 
 
for(let li of lis) {
    if(li.getAttribute('data-tag').match(/css/))
        result.push({
            name:li.children[1].innerText,
            url:li.children[1].children[0].href
        })
}
console.log(result)
console.log(JSON.stringify(result,null,"    "))

```

