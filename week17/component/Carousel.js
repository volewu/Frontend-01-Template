import {
  createElement,
  Text,
  Wrapper
} from './createElement'

import {
  Timeline,
  Animation
} from "./animation";
import {
  ease
} from "./cubicBezier";


import css from './carousel.css'




export class Carousel {
  constructor() {
    this.children = []
    this.attributes = new Map
    this.properties = new Map

    this.data = []
  }
  setAttribute(name, value) {
    this[name] = value
  }
  appendChild(child) {
    this.children.push(child)
  }
  render() {

    let timeline = new Timeline
    // window.xtimeline = timeline
    timeline.start()

    let position = 0

    let nextPicStopHandler = null



    let children = this.data.map((url, currentPosition) => {
      let lastPosition = (currentPosition - 1 + this.data.length) % this.data.length
      let nextPosition = (currentPosition + 1) % this.data.length



      let offset = 0

      let onStart = () => {
        timeline.pause()
        clearTimeout(nextPicStopHandler)

        let currentElement = children[currentPosition]

        let currentTransformValue = Number(currentElement.style.transform.match(/translateX\(([\s\S]+)px\)/)[1])
        offset = currentTransformValue + 500 * currentPosition
      }

      let onPan = event => {
        let lastElement = children[lastPosition]
        let currentElement = children[currentPosition]
        let nextElement = children[nextPosition]

        let dx = event.clientX - event.startX

        let lastTransformValue = -500 - 500 * lastPosition + offset + dx
        let currentTransformValue = -500 * currentPosition + offset + dx
        let nextTransformValue = 500 - 500 * nextPosition + offset + dx


        lastElement.style.transform = `translateX(${lastTransformValue}px)`
        currentElement.style.transform = `translateX(${currentTransformValue}px)`
        nextElement.style.transform = `translateX(${nextTransformValue}px)`


      }

      let onPanend = event => {
        let direction = 0
        let dx = event.clientX - event.startX

        console.log('flick', event.isFlick)


        if (dx + offset > 250 || dx > 0 && event.isFlick) {
          direction = 1;
        } else if (dx + offset < -250 || dx < 0 && event.isFlick) {
          direction = -1;
        }

        timeline.reset();
        timeline.start();

        let lastElement = children[lastPosition];
        let currentElement = children[currentPosition];
        let nextElement = children[nextPosition];

        let lastAnimation = new Animation(lastElement.style, 'transform', -500 - 500 * lastPosition + offset + dx, -500 - 500 * lastPosition + direction * 500, 500, 0, ease, v => `translateX(${v}px)`);
        let currentAnimation = new Animation(currentElement.style, 'transform', -500 * currentPosition + offset + dx, -500 * currentPosition + direction * 500, 500, 0, ease, v => `translateX(${v}px)`);
        let nextAnimation = new Animation(nextElement.style, 'transform', 500 - 500 * nextPosition + offset + dx, 500 - 500 * nextPosition + direction * 500, 500, 0, ease, v => `translateX(${v}px)`);

        timeline.add(lastAnimation);
        timeline.add(currentAnimation);
        timeline.add(nextAnimation);

        console.log(timeline);

        position = (position - direction + this.data.length) % this.data.length;
        nextPicStopHandler = setTimeout(nextPic, 3000);
      }


      let element = < img src = {
        url
      }
      onStart = {
        onStart
      }
      onPan = {
        onPan
      }
      onPanend = {
        onPanend
      }
      enableGesture = {
        true
      }
      />
      // 这里返回的是一个对象，，需要去root才能获得元素
      element.style.transform = "translateX(0px)"
      element.addEventListener('dragstart', event => event.preventDefault())
      return element
    })
    let root = < div class = "carousel" > {
        children
      } <
      /div>



    let nextPic = () => {
      // 获得一定范围内的数字循环，取余算法 
      let nextPosition = (position + 1) % this.data.length

      let current = children[position];
      let next = children[nextPosition]

      let currentAnimation = new Animation(current.style, 'transform',
        -100 * position, -100 - 100 * position, 500, 0, ease, v => `translateX(${5*v}px)`)
      let nextAnimation = new Animation(next.style, 'transform',
        100 - 100 * nextPosition, -100 * nextPosition, 500, 0, ease, v => `translateX(${5*v}px)`)

      timeline.add(currentAnimation)
      timeline.add(nextAnimation)



      position = nextPosition

      // window.xstopHandler = setTimeout(nextPic, 3000)
      nextPicStopHandler = setTimeout(nextPic, 3000)
    }
    // 保持第一个停留3s
    nextPicStopHandler = setTimeout(nextPic, 3000)

    // 第一步
    return root
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