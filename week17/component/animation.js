// 添加了；restart；add方法改善
export class Timeline {
  constructor(){
    this.animations = new Set
    this.finishedAnimations = new Set
    this.addTimes = new Map
    this.requsetID = null;
    this.state = 'inited';
    this.tick = () => {
      let t = Date.now() - this.startTime
      // let animations = this.animations.filter(animation => !animation.finished)
      for(let animation of this.animations){
        
        let {object, property, timingFunction,delay,template,duration} = animation

        let addTime = this.addTimes.get(animation)
        // timingFunction 参考网址  cubic-bezier.com

        // if (t < delay + addTime)
        //   continue;

        if (t > delay + addTime) {
          let progression = timingFunction((t-delay-addTime)/duration) // 0-1之间的数
          // if (progression > 0 && progression < 1){
          if(t > duration + delay + addTime){
            progression = 1
            // animation.finished = true
            this.animations.delete(animation)
            this.finishedAnimations.add(animation)
          }
  
          // let value = start + progression * (end -start)  // value就是根据progression计算的当前值
          let value = animation.valueFromProgression(progression)  // value就是根据progression计算的当前值
  
          object[property] = template(value)
          // }
        }
        
      }
      if (this.animations.size)
        this.requsetID = requestAnimationFrame(this.tick)
      else 
        this.requsetID = null
      

      

     
    }
  }

  pause(){
    if(this.state != 'playing')
      return;
    this.state = 'paused'

    this.pauseTime = Date.now()
    if(this.requsetID !== null){
      cancelAnimationFrame(this.requsetID)
      this.requsetID = null
    }
  }

  resume(){
    if(this.state != 'paused')
      return;
    this.state = 'playing'

    // 相当于去掉暂停的时间
    this.startTime += Date.now() - this.pauseTime 
    this.tick()
  }

  start(){
    if(this.state != 'inited')
      return;

    this.state = 'playing'
    this.startTime = Date.now()
    this.tick()
  }

  reset(){
    if(this.state === 'playing')
      this.pause()
    // this.animations = []
    this.animations = new Set
    this.finishedAnimations = new Set
    this.addTimes = new Map
    // this.animations.forEach(animation => animation.finished = false)
    this.requsetID = null
    this.startTime = Date.now()
    this.pauseTime = null
    this.state = 'inited'
  }

  restart(){
    if (this.state === 'playing')
      this.pause()
    for (let animation of this.finishedAnimations)
      this.animations.add(animation)

    this.finishedAnimations = new Set
    this.requsetID = null
    this.state = 'playing'
    this.startTime = Date.now()
    this.pauseTime = null
    this.tick()
  }
  // addTime 用来处理后开始问题
  add(animation, addTime){
    this.animations.add(animation)
    // animation.finished = false
    if(this.state === 'playing' && this.requsetID === null)
      this.tick()
    if(this.state === 'playing')
      this.addTimes.set(animation, addTime !== void 0 ? addTime : Date.now() - this.startTime)
    else
      this.addTimes.set(animation, addTime !== void 0 ? addTime : 0)
  }
  
}
let i = 0
export class Animation {
  constructor(object, property, start, end, duration, delay, timingFunction, template){
    this.object = object
    this.property = property
    this.template = template
    this.start = start
    this.end = end
    this.duration = duration
    this.delay = delay||0

    
    this.timingFunction = timingFunction
    // this.timingFunction = timingFunction || ((start, end) => {
    //   return t => start + (t / duration)* (end-start)
    // })
  }
  valueFromProgression(progression){
    return this.start + progression * (this.end -this.start)
  }
}

export class ColorAnimation {
  constructor(object, property, start, end, duration, delay, timingFunction, template){
    this.object = object
    this.property = property
    this.template = template || ((v) => `rgba(${v.r},${v.g},${v.b},${v.a})`)
    this.start = start
    this.end = end
    this.duration = duration
    this.delay = delay||0

    
    this.timingFunction = timingFunction
    // this.timingFunction = timingFunction || ((start, end) => {
    //   return t => start + (t / duration)* (end-start)
    // })
  }
  valueFromProgression(progression){
    return {
      r: this.start.r + progression * (this.end.r -this.start.r),
      g: this.start.g + progression * (this.end.g -this.start.g),
      b: this.start.b + progression * (this.end.b -this.start.b),
      a: this.start.a + progression * (this.end.a -this.start.a)
    }
  }
}


/*

let animation = new Animation(object, property, start, end, duration, dalay, timingFunction)
let animation2 = new Animation(object, property, start, end, duration, dalay, timingFunction)

// 时间线 同时控制多个动画
let timeline = new Timeline

timeline.add(animation)
timeline.add(animation2)

timeline.start()
timeline.pause()
timeline.resume()
timeline.stop()


setTimeout
setInterval
requestAnimationFrame

*/