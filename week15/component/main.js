import {createElement, Text, Wrapper} from "./createElement"
import {Timeline,Animation} from "./animation"
import {cubicBezier} from "./cubicBezier.js"

const ease = cubicBezier(.25,.1,.25,1)
let tl = new Timeline;
// import {Carousel} from "./carousel.view"


class Carousel{
    constructor(config){
        this.children = [];
        this.attributes = new Map();
        this.properties = new Map()
    }

    setAttribute(name, value) {
        this[name] = value;
    }

    appendChild(child){
        this.children.push(child)
    }

    render(){
        let children = this.data.map(url => {
            let element = <img src={url} />;
            element.addEventListener("dragstart", event => event.preventDefault())
            return element;
        })

        let root = <div class="carousel">
            { children }
        </div>

        let position = 0;

        let nextPic = () => {
            let nextPosition = (position + 1) % this.data.length
            let current = children[position];
            let next = children[nextPosition]

            current.style.transition = "ease 0s";
            next.style.transition = "ease 0s";

            current.style.transform = `translateX(${- 100 * position}%)`
            next.style.transform = `translateX(${100 - 100 * nextPosition}%)`

            setTimeout(function(){
                tl.add(new Animation(current.style, "transform", position, (-100 - 100 * position), 2000, 0, ease,v => `translateX(${v}%)`))
                tl.add(new Animation(next.style, "transform", nextPosition, (-100 * nextPosition), 2000, 0, ease,v => `translateX(${v}%)`))
                tl.start()

                // current.style.transition = "ease 0.5s";
                // next.style.transition = "ease 0.5s";

                // current.style.transform = `translateX(${-100 - 100 * position}%)`
                // next.style.transform = `translateX(${-100 * nextPosition}%)`
                
                position = nextPosition;
            }, 16)

            setTimeout(nextPic, 3000)
        }
        setTimeout(nextPic, 3000)

        root.addEventListener('mousedown',() => {
            let startX = event.clientX, startY = event.clientY

            let lastPosition = (position - 1 + this.data.length) % this.data.length
            let nextPosition = (position + 1) % this.data.length
            
            
            let current = children[position];
            let last = children[lastPosition];
            let next = children[nextPosition];

            current.style.transition = "ease 0s";
            last.style.transition = "ease 0s";
            next.style.transition = "ease 0s";

            current.style.transform = `translateX(${- 500 * position}px)`
            last.style.transform = `translateX(${-500 -500 * lastPosition}px)`
            next.style.transform = `translateX(${500 - 500 * nextPosition}px)`

            let move = (event) => {
                // tl.add(new Animation(current.style, "transform", position, (event.clientX - startX - 500 * position), 500, 0, ease,v => `translateX(${v}px)`))
                // tl.add(new Animation(last.style, "transform", lastPosition, (event.clientX - startX - 500 - 500 * lastPosition), 500, 0, ease,v => `translateX(${v}px)`))
                // tl.add(new Animation(next.style, "transform", nextPosition, (event.clientX - startX + 500 - 500 * nextPosition), 500, 0, ease,v => `translateX(${v}px)`))
                // tl.start()
                current.style.transform = `translateX(${event.clientX - startX - 500 * position}px)`
                last.style.transform = `translateX(${event.clientX - startX - 500 - 500 * lastPosition}px)`
                next.style.transform = `translateX(${event.clientX - startX + 500 - 500 * nextPosition}px)`
            };

            let up = (event) => {
                let offset = 0;

                if(event.clientX - startX > 250){
                    offset = 1;
                } else if(event.clientX - startX < -250) {
                    offset = -1;
                }

                // tl.add(new Animation(current.style, "transform", position, (offset * 500 - 500 * position), 2000, 0, ease,v => `translateX(${v}px)`))
                // tl.add(new Animation(last.style, "transform", lastPosition, (offset * 500 - 500 -500 * lastPosition), 2000, 0, ease,v => `translateX(${v}px)`))
                // tl.add(new Animation(next.style, "transform", nextPosition, (offset * 500 + 500 - 500 * nextPosition), 2000, 0, ease,v => `translateX(${v}px)`))
                // tl.start()

                current.style.transition = "";
                last.style.transition = "";
                next.style.transition = "";

                current.style.transform = `translateX(${offset * 500 - 500 * position}px)`
                last.style.transform = `translateX(${offset * 500 - 500 -500 * lastPosition}px)`
                next.style.transform = `translateX(${offset * 500 + 500 - 500 * nextPosition}px)`

                position = (position - offset + this.data.length) % this.data.length;

                document.removeEventListener('mousemove',move)
                document.removeEventListener('mouseup',up)
            };

            document.addEventListener('mousemove',move)
            document.addEventListener('mouseup',up)
        })

        return root;
    }

    mountTo(parent) {
        this.render().mountTo(parent)
    }
}

let componet = <Carousel data={[
    "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
    "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
    "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
    "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
]} /> 

componet.mountTo(document.body)


/*
class MyComponent{
    constructor(config){
        this.children = [];
        this.attributes = new Map();
        this.properties = new Map()
        
    }

    setAttribute(name, value) {
        this.attributes.set(name, value);
    }

    appendChild(child){
        this.children.push(child)
    }

    set title(value) {
        this.properties.set('title', value)
    }

    render(){
        return <article>
            <h1></h1>
            <header>I'm a header</header>
            {this.slot}
            <footer>I'm a footer</footer>
        </article>
    }

    mountTo(parent) {
        this.slot = <div></div>
        for(let child of this.children) {
            this.slot.appendChild(child)
        }
        this.render().mountTo(parent)
    }
}

let componet = <MyComponent>
    <span>text text text</span>
</MyComponent>

componet.mountTo(document.body)
*/