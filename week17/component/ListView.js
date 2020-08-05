
import {
  createElement,
  Text,
  Wrapper
} from './createElement'

export class ListView {
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
  getAttribute(name) {
    return this[name]
  }
   
  appendChild(child) {
    this.children.push(child)
  }

  render() {
    
    let data = this.getAttribute('data')
    return <div class="list-view" style="width:300px;">
        {
          data.map(this.children[0])
        }
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