
import {
  createElement,
  Text,
  Wrapper
} from './createElement'

export class TabPanel {
  constructor() {
    this.children = []
    this.attributes = new Map
    this.properties = new Map

    this.data = []
    this.state = Object.create(null)
  }
  setAttribute(name, value) {
    this[name] = value
  }
   
  appendChild(child) {
    this.children.push(child)
  }

  select(i) {
    for(let view of this.childrenViews) {
      view.style.display = 'none'
    }
    this.childrenViews[i].style.display = ''

    for(let view of this.titleViews) {
      view.classList.remove('selected')
    }
    this.titleViews[i].classList.add('selected')
  }
  render() {
    // 怎么做tabpanel

    this.childrenViews = this.children.map(child => <div style = "height: 100px;background:#fff;">{child}</div>)
    this.titleViews = this.children.map((child,i) => <span onClick={() => this.select(i)}
      style = "width: 300px;min-height:300px;">{child.getAttribute('title') || ' '}</span>)

    setTimeout(() => this.select(0), 16)
    return <div class="panel" style="border: 1px solid lightgreen;width:300px;">
        <h1 style="background-color:lightgreen;height: 80px;padding:0;margin:0;">{this.titleViews}</h1>
        {this.childrenViews}
      </div>
    
  }
  mountTo(parent) {
    // 这里会多出一层div，是因为这里会调用Wrap
    // this.slot = <div></div>
    // for(let child of this.children){
    //   this.slot.appendChild(child)
    // }
    this.render().mountTo(parent)
  }
}