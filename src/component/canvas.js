import React from 'react'

/**!
 ** @author: zhangxinxu(.com) 2017-12-09
 ** @description: http://www.zhangxinxu.com/wordpress/?p=6594
 ** @licence: MIT licence
 */

class Ball {
    constructor(width, height) {
        this.x = width
        this.y = height
        this.interval = 17
        this.distanceX = 0
        this.distanceY = 0
        const r = Math.round(Math.random() * 10)
        this.r = r

        //到达最大次数的时候，会一直原地抖动
        this.has_interval = 0

        this.shake = []
        this.isNextShake = true
    }

    setDes = (x, y) => {
        this.desX = x
        this.desY = y

        this.distanceX = this.desX - this.x
        this.distanceY = this.desY - this.y
    }

    shaking = () => {
        if (this.isNextShake) {
            const shakeFator =
                Math.random() * 7 * ((Math.random() * 10) % 2 === 0 ? 1 : -1)

            for (let i = 0; i < 68; i++) {
                this.shake.push(shakeFator / 34)
            }
            this.isNextShake = false
            this.y = this.desY
        } else {
            const _delt = this.shake.shift()

            if (this.shake.length < 34) {
                this.y = this.y - _delt
            } else {
                this.y = this.y + _delt
            }

            if (this.shake.length === 0) this.isNextShake = true
        }
    }

    next = () => {
        if (this.has_interval < 18) {
            this.x = this.distanceX / 17 + this.x
            this.y = this.distanceY / 17 + this.y
        } else {
            if (this.has_interval % 4 === 0) {
                this.shaking()
            }
        }

        this.has_interval = this.has_interval + 1
    }

    draw = context => {
        context.beginPath()
        context.fillStyle = `#${this.r}6${this.r}`
        context.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        context.closePath()
        context.fill()
    }
}

export class Canvas extends React.Component {
    componentDidMount() {
        this.zi = ['s', 'c', 'd', 'x', 'y']
        this.drawCanvas()
    }

    drawCanvas = () => {
        const context = this.canvas.getContext('2d')
        const width = 400
        const height = 400

        context.clearRect(0, 0, width, height)
        context.fillStyle = 'black'
        context.textBaseline = 'middle'
        context.textAlign = 'center'
        context.font = 'bold 250px arial'
        context.fillText(this.zi.shift(), width / 2, height / 2)
        const imgData = context.getImageData(0, 0, width, height).data

        var gap = 13
        var pos = []
        var x = 0,
            y = 0,
            index = 0
        for (var i = 0; i < imgData.length; i += 4 * gap) {
            if (imgData[i + 3] == 255) {
                // 塞入此时的坐标
                pos.push({
                    x: x,
                    y: y
                })
            }
            index = Math.floor(i / 4)
            x = index % width
            y = Math.floor(index / width)
            if (x >= width - gap) {
                i += gap * 4 * width
            }
        }

        //清除
        context.clearRect(0, 0, width, height)

        let store = []

        pos.forEach(({ x, y }) => {
            const b = new Ball(width / 2, height / 2)
            b.setDes(x, y)
            store.push(b)
        })

        const draw = () => {
            store.forEach(ball => {
                ball.next()
                ball.draw(context)
            })
        }

        const render = () => {
            context.clearRect(0, 0, width, height)

            draw()

            requestAnimationFrame(render)
        }

        render()
    }

    handleChange = () => {
        this.drawCanvas()
    }

    render() {
        return (
            <canvas
                onClick={this.handleChange}
                id="plexus"
                ref={node => (this.canvas = node)}
                width={400}
                height={400}
                style={{ zIndex: 10 }}
            />
        )
    }
}