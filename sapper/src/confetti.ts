export default class Confetti {
	//value = 5
	c
	n
	p
	sx
	sy
	a
	d
	canvas
	i
	f
	constructor(id=undefined) {
		let c = this.canvas = document.createElement('canvas'),
			m = document.getElementById(id);
		this.c = c.getContext('2d');
		this.n = 75;//count
		this.p = 25;//power
		this.sx = 2;//size
		this.sy = 8;//size
		this.a = [];
		this.d = Date.now();//prev
		c.width = innerWidth;
		c.height = innerHeight;
		Object.assign(c.style, { position:'fixed', margin: 0, padding: 0, top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9e9, pointerEvents: 'none' });
		document.body.appendChild(c);
		m?.addEventListener('click', e => (this?.f?.(m), this.startAt(e.clientX, e.clientY)));
		window.addEventListener('resize', _ => (c.width = innerWidth, c.height = innerHeight));
		this.r();
	}
	startAt(x = innerWidth / 2, y = innerHeight / 2) {
		console.log(x, y)
		for (let i = 0; i < this.n; i++) {
			let r = Math.random(),
				w = (this.sx * r + this.sx),
				h = (this.sy * (this.i ? r : Math.random()) + this.sy),
				vx = Math.random() / 2 - .25,
				vy = Math.random() - .7,
				vl = Math.hypot(vx, vy);
			this.a.push({
				p: { x: x - w / 2, y: y - h / 2 },//position
				v: { x: (vx / vl) * (Math.random() * this.p), y: (vy / vl) * (Math.random() * this.p) },//velocity
				s: { x: w, y: h },//size
				r: 360 * Math.random(),//rotation
				t: 10 * (Math.random() - .5),//rotation speed
				h: 360 * Math.random(),//hue
				o: 1,//opacity
				l: (Math.random() * 20 + 20) / 100,//dead speed
			});
		}
	}
	r(t=undefined) {//render
		requestAnimationFrame(this.r.bind(this));
		if (!t)
			return;
		let d = (t - this.d) / 1e3;
		this.d = t;
		for (let i = this.a.length; --i >= 0;) {
			let m = this.a[i];
			m.p.x += (m.v.x *= .96);
			m.p.y += (m.v.y = (m.v.y + 5 * d) * .95);
			m.r += m.t;
			m.o -= d * m.l;
		}
		this.c.clearRect(0, 0, innerWidth, innerHeight);
		(this.a = this.a.filter(m => m.o > 0)).forEach(m =>
			(this.c.save(),
			this.c.beginPath(),
			this.c.translate(m.p.x + m.s.x / 2, m.p.y + m.s.y / 2),
			this.c.rotate((m.r * Math.PI) / 180),
			this.c.globalAlpha = m.o,
			this.c.fillStyle = `hsl(${m.h}deg,90%,65%)`,
			this.i ?
			this.c.drawImage(this.i, -m.s.x / 2, -m.s.y / 2, m.s.x, m.s.y)
			: this.c.fillRect(-m.s.x / 2, -m.s.y / 2, m.s.x, m.s.y),
			this.c.restore()));
	}
	setImage(i, w = i?.width, h = i?.height) {
		this.i = i;
		this.sx = w;
		this.sy = h
	}
	set count(v) {
		this.n = v;
	}
	set power(v) {
		this.p = v;
	}
	set size(v) {
		!this.i && (this.sx = v * 2, this.sy = v * 8)
	}
	set removeFunc(f) {
		this.f = f;
	}
}