



export function enableGesture(element){
  let contexts = Object.create(null)

  let MOUSE_SYMBOL = Symbol('mouse')

  if(document.ontouchstart !== null){
    element.addEventListener('mousedown', event => {
      // console.log('mouse')
      contexts[MOUSE_SYMBOL] = Object.create(null)
      start(event, contexts[MOUSE_SYMBOL])
      let mousemove = event => {

        move(event, contexts[MOUSE_SYMBOL])
      }
      let mouseend = event => {
        end(event, contexts[MOUSE_SYMBOL])
        document.removeEventListener('mousemove', mousemove)
        document.removeEventListener('mouseup', mouseend)
      }
      // 这里不是element
      document.addEventListener('mousemove', mousemove)
    
      document.addEventListener('mouseup', mouseend)
    })
    
  }
  // 移动端touch事件不需要在个别元素上，监听的；
  // 它在哪个元素上起始，就会在这个元素上触发
  element.addEventListener('touchstart', event => {
    for(let touch of event.changedTouches){
      // console.log(touch)
      contexts[touch.identifier] = Object.create(null)
      start(touch, contexts[touch.identifier])
    }
  })

  element.addEventListener('touchmove', event => {
    for(let touch of event.changedTouches){
      move(touch, contexts[touch.identifier])
    }
  })

  element.addEventListener('touchend', event => {
    for(let touch of event.changedTouches){
      end(touch, contexts[touch.identifier])
      delete contexts[touch.identifier]
    }
  })

  // touchcancel事件，触发机制：当touch的时候，突然出现弹框或者触发了系统事件时，触发；
  element.addEventListener('touchcancel', event => {
    for(let touch of event.changedTouches){
      cancel(touch, contexts[touch.identifier])
      delete contexts[touch.identifier]
    }
  })


  // 四种手势
  // tap
  // pan - panstart panmove panend
  // flick
  // press - pressstart pressend
  // 手势的基本架构：监听-》识别-》分发

  let start = (point, context) => {
    element.dispatchEvent(Object.assign(new CustomEvent('start'), {
      startX: point.clientX,
      startY: point.clientY,
      clientX: point.clientX,
      clientY: point.clientY
    }))
    context.startX = point.clientX, context.startY = point.clientY
    // 判断flick 300ms
    context.moves = []
    context.isTap = true
    context.isPan = false
    context.isPress = false
    context.timeoutHandler = setTimeout(() => {
      if(context.isPan)
        return
      context.isTap = false
      context.isPan = false
      context.isPress = true
      element.dispatchEvent(new CustomEvent('pressstart'))
    }, 500)
  }

  let move = (point, context) => {
    let dx = point.clientX - context.startX, dy = point.clientY - context.startY
    if(dx ** 2 + dy ** 2 > 100 && !context.isPan){
      if(context.isPress)
        element.dispatchEvent(new CustomEvent('presscancel'))
      context.isTap = false
      context.isPan = true
      context.isPress = false

      element.dispatchEvent(Object.assign(new CustomEvent('panstart'), {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY
      }))
    }

    


    if(context.isPan){
      context.moves.push({
        dx, dy,
        t: Date.now()
      })
      context.moves = context.moves.filter(record => Date.now() - record.t < 300)
      element.dispatchEvent(Object.assign(new CustomEvent('pan'), {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY
      }))
    }
    // console.log('move', dx, dy)
  }

  let end = (point, context) => {
    if(context.isPan){
      let dx = point.clientX - context.startX, dy = point.clientY - context.startY
      let record = context.moves[0]
      let speed = Math.sqrt((record.dx - dx)**2 +(record.dy-dy)**2)/(Date.now()-record.t)

      let isFlick = speed > 2.5
      if(isFlick) {
        element.dispatchEvent(Object.assign(new CustomEvent('flick'), {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          speed: speed
        }))
      }
      element.dispatchEvent(Object.assign(new CustomEvent('panend'), {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        speed: speed,
        isFlick: isFlick
      }))
    }
    if(context.isTap){
      element.dispatchEvent(new CustomEvent('tap'))
    }
    if(context.isPress)
      element.dispatchEvent(new CustomEvent('pressend'))

    clearTimeout(context.timeoutHandler)
  }

  let cancel = (point, context) => {
    element.dispatchEvent(new CustomEvent('canceled'))
    clearTimeout(context.timeoutHandler)
  }

  // 还有pointerEvent；但是兼容性不好，我们就用mouseEvent和touchEvent
}