export default class Confetti {
	count
	size
	power
	duration
	constructor() {
		this.count = 75
		this.size = { x: 10, y: 25 }
		this.power = 300
		this.duration = .7
	}
	
	at(x, y) {
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')

		; (document.onresize = () => {
			canvas.width = document.body.clientWidth
			canvas.height = document.body.clientHeight
		})()

		Object.assign(canvas.style, {
			position:'fixed',
			margin: 0,
			padding: 0,
			top: 0,
			left: 0,
			width: '100vw',
			height: '100vh',
			zIndex: 9e9,
			pointerEvents: 'none'
		})

		let confettis = new Array(this.count).fill(0).map(() => {
			let vx = (Math.random() - .5) * .6
			let vy = Math.random() * .8 - .7
			let fac = 1 / Math.hypot(vx, vy) * (Math.random() * .5 + 7)
			return {
				pos: { x, y },
				vel: {
					x: vx * fac,
					y: vy * fac
				},
				slowDown: {
					x: Math.random() * .3 + .6,
					y: Math.random() * .3 + .65
				},
				size: Math.random() * .5 + .5,
				hue: Math.random() * 360,
				lifetime: (Math.random() * .3 + .7) * this.duration,
				rotation: Math.random() * Math.PI,
				rps: Math.random() * .5 + .5,
				opacity: 1
			}
		})
		document.body.appendChild(canvas)

		let prev
		const render = (t) => {
			let dt = (t - (prev ?? t)) / 1000
			prev = t
			for (let c of confettis) {
				c.pos.x += c.vel.x * dt * this.power
				c.pos.y += c.vel.y * dt * this.power
				c.vel.y += dt * 3
				c.vel.x *= c.slowDown.x
				c.vel.y *= c.slowDown.y
				c.size *= .98
				c.rotation += dt * c.rps
				c.opacity -= dt / c.lifetime
			}
			confettis = confettis.filter(({ opacity }) => opacity > 0)
			if (confettis.length)
				requestAnimationFrame(render)
			else
				canvas.remove()
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			for (const c of confettis) {
				const width = this.size.x * c.size
				const height = this.size.y * c.size
				ctx.save()
				ctx.beginPath()
				ctx.translate(
					c.pos.x,
					c.pos.y
				)
				ctx.rotate(c.rotation)
				ctx.fillStyle = `hsl(${c.hue}deg,90%,65%,${c.opacity})`
				ctx.fillRect(
					-width / 2,
					-height / 2,
					width,
					height
				)
				ctx.restore()
			}
		}
		requestAnimationFrame(render)
	}
	setCount(count) {
		this.count = count
		return this
	}
	setSize(x, y = x) {
		this.size = { x, y }
		return this
	}
	setPower(power) {
		this.power = power
		return this
	}
	setDuration(duration) {
		this.duration = duration
		return this
	}
}