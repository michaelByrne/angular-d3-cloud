import { Injectable, ElementRef } from '@angular/core';

import { Word, WordFreq, CloudConfig } from './cloud.config';

@Injectable()
export class CloudService {

	cloudRadians = Math.PI / 180;
	cw = 1 << 11 >> 5;
	ch = 1 << 11;
	size = [256, 256];
	contextAndRatio: any = this.getContext();
	board: Array<number> = this.zeroArray((this.size[0] >> 5) * this.size[1]);
	tags = [];
	words: any;
	n: number;
	i: number;
	data: any;
	timer: any;
	timeInterval: number = Infinity;
	bounds = null;


	start(words, config): void {
		let c = this.contextAndRatio.context,
			ratio = this.contextAndRatio.ratio;
		this.words = words;
		this.i = -1;
		this.n = this.words.length;
		this.timer = null;

		c.clearRect(0, 0, (this.cw << 5) / ratio, this.ch / ratio);

		this.data = this.words.map(function(d, i) {
			d.text = d.text;
			d.font = "Impact";
			d.style = "normal";
			d.weight = "normal";
			d.rotate = (~~(Math.random() * 6) - 3) * 30;
			d.size = d.size;
			d.padding = 1;
			return d;
		}).sort((a, b) => b.size - a.size);

		if (this.timer)
			clearInterval(this.timer);
		this.timer = setInterval(this.step, 2);
		this.step();
	}

	step(): void {
		let start = Date.now(),
			xStart = this.size[0] / 2,
			yStart = this.size[1] / 2;

		while (Date.now() - start < this.timeInterval && ++this.i < this.n && this.timer) {
			let d = this.words[this.i];
			d.x = xStart;
			d.y = yStart;
			this.cloudSprite(this.contextAndRatio, d, this.words, this.i);
			if (d.hasText && this.place(this.board, d, this.bounds)) {
				this.tags.push(d);
				if (this.bounds) {
					this.cloudBounds(this.bounds, d);
				}
				else this.bounds = [{ x: d.x + d.x0, y: d.y + d.y0 }, { x: d.x + d.x1, y: d.y + d.y1 }];
				// Temporary hack
				d.x -= this.size[0] >> 1;
				d.y -= this.size[1] >> 1;
			}
		}
		if (this.i >= this.n) {
			this.stop();
		}
	}

	stop(): void {
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}
	};

	cloudSprite(contextAndRatio, d, data, di): any {
		if (d.sprite) return;
		let c = contextAndRatio.context,
			ratio = contextAndRatio.ratio;

		c.clearRect(0, 0, (this.cw << 5) / ratio, this.ch / ratio);

		let x = 0,
			y = 0,
			maxh = 0,
			n = data.length;
		--di;
		while (++di < n) {
			d = data[di];
			c.save();
			c.font = d.style + " " + d.weight + " " + ~~((d.size + 1) / ratio) + "px " + d.font;

			var w = c.measureText(d.text + "m").width * ratio,
				h = d.size << 1;

			if (d.rotate) {
				let sr = Math.sin(d.rotate * this.cloudRadians),
					cr = Math.cos(d.rotate * this.cloudRadians),
					wcr = w * cr,
					wsr = w * sr,
					hcr = h * cr,
					hsr = h * sr;
				w = (Math.max(Math.abs(wcr + hsr), Math.abs(wcr - hsr)) + 0x1f) >> 5 << 5;
				h = ~~Math.max(Math.abs(wsr + hcr), Math.abs(wsr - hcr));
			} else {
				w = (w + 0x1f) >> 5 << 5;
			}

			if (h > maxh) maxh = h;

			if (x + w >= (this.cw << 5)) {
				x = 0;
				y += maxh;
				maxh = 0;
			}

			if (y + h >= this.ch) break;
			c.translate((x + (w >> 1)) / ratio, (y + (h >> 1)) / ratio);
			if (d.rotate)
				c.rotate(d.rotate * this.cloudRadians);
			c.fillText(d.text, 0, 0);
			c.restore();
			d.width = w;
			d.height = h;
			d.xoff = x;
			d.yoff = y;
			d.x1 = w >> 1;
			d.y1 = h >> 1;
			d.x0 = -d.x1;
			d.y0 = -d.y1;
			d.hasText = true;
			x += w;
		}
		var pixels = c.getImageData(0, 0, (this.cw << 5) / ratio, this.ch / ratio).data,
			sprite = [];
		while (--di >= 0) {
			d = data[di];
			if (!d.hasText) continue;
			let w = d.width;
			let w32 = w >> 5;
			let h = d.y1 - d.y0;
			// Zero the buffer
			for (var i = 0; i < h * w32; i++) sprite[i] = 0;
			x = d.xoff;
			if (x == null) return;
			y = d.yoff;
			var seen = 0,
				seenRow = -1;
			for (var j = 0; j < h; j++) {
				for (var i = 0; i < w; i++) {
					var k = w32 * j + (i >> 5),
						m = pixels[((y + j) * (this.cw << 5) + (x + i)) << 2] ? 1 << (31 - (i % 32)) : 0;
					sprite[k] |= m;
					seen |= m;
				}
				if (seen) seenRow = j;
				else {
					d.y0++;
					h--;
					j--;
					y++;
				}
			}
			d.y1 = d.y0 + seenRow;
			d.sprite = sprite.slice(0, (d.y1 - d.y0) * w32);
		}
	}

	getContext(): any {
		let canvas = document.createElement('canvas');
		canvas.width = canvas.height = 1;
		let ratio = Math.sqrt(canvas.getContext("2d").getImageData(0, 0, 1, 1).data.length >> 2);
		canvas.width = (this.cw << 5) / ratio;
		canvas.height = this.ch / ratio;
		let ctx = canvas.getContext('2d');
		ctx.fillStyle = ctx.strokeStyle = "red";
		ctx.textAlign = "center";
		return { context: ctx, ratio: ratio };
	}

	archimedeanSpiral(size): (number) => Array<number> {
		let e = size[0] / size[1];
		return (t) => [
			e * (t *= .1) * Math.cos(t),
			t * Math.sin(t)
		];
	}


	rectangularSpiral(size): (number) => Array<number> {
		let dy = 4,
			dx = dy * size[0] / size[1],
			x = 0,
			y = 0;
		return (t) => {
			var sign = t < 0 ? -1 : 1;
			// See triangular numbers: T_n = n * (n + 1) / 2.
			switch ((Math.sqrt(1 + 4 * sign * t) - sign) & 3) {
				case 0:
					x += dx;
					break;
				case 1:
					y += dy;
					break;
				case 2:
					x -= dx;
					break;
				default:
					y -= dy;
					break;
			}
			return [x, y];
		};
	}

	cloudCollide(tag, board, sw): boolean {
		sw >>= 5;
		let sprite = tag.sprite,
			w = tag.width >> 5,
			lx = tag.x - (w << 4),
			sx = lx & 0x7f,
			msx = 32 - sx,
			h = tag.y1 - tag.y0,
			x = (tag.y + tag.y0) * sw + (lx >> 5),
			last;
		for (let j = 0; j < h; j++) {
			last = 0;
			for (let i = 0; i <= w; i++) {
				if (((last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0))
					& board[x + i]) {

					return true;
				}
			}
			x += sw;
		}
		return false;
	}

	collideRects(a, b): boolean {
		let coll = a.x + a.x1 > b[0].x && a.x + a.x0 < b[1].x && a.y + a.y1 > b[0].y && a.y + a.y0 < b[1].y;
		return coll;
	}

	place(board, tag, bounds): boolean {
		let perimeter = [{ x: 0, y: 0 }, { x: this.size[0], y: this.size[1] }],
			startX = tag.x,
			startY = tag.y,
			maxDelta = Math.sqrt(this.size[0] * this.size[0] + this.size[1] * this.size[1]),
			s = this.archimedeanSpiral(this.size),
			// dt = Math.random() < .5 ? 1 : -1,
			dt = 1,
			t = -dt,
			dxdy,
			dx,
			dy;

		while (dxdy = s(t += dt)) {
			dx = ~~dxdy[0];
			dy = ~~dxdy[1];

			if (Math.min(Math.abs(dx), Math.abs(dy)) >= maxDelta) break;

			tag.x = startX + dx;
			tag.y = startY + dy;

			if (tag.x + tag.x0 < 0 || tag.y + tag.y0 < 0 ||
				tag.x + tag.x1 > this.size[0] || tag.y + tag.y1 > this.size[1]) continue;
			// TODO only check for collisions within current bounds.

			if (!bounds || !this.cloudCollide(tag, board, this.size[0])) {
				if (!bounds || this.collideRects(tag, bounds)) {
					let sprite = tag.sprite,
						w = tag.width >> 5,
						sw = this.size[0] >> 5,
						lx = tag.x - (w << 4),
						sx = lx & 0x7f,
						msx = 32 - sx,
						h = tag.y1 - tag.y0,
						x = (tag.y + tag.y0) * sw + (lx >> 5),
						last;
					for (let j = 0; j < h; j++) {
						last = 0;
						for (let i = 0; i <= w; i++) {
							board[x + i] |= (last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0);
						}
						x += sw;
					}
					delete tag.sprite;
					return true;
				}
			}
		}
		return false;
	}

	cloudBounds(bounds, d): any {
		let b0 = bounds[0],
			b1 = bounds[1];
		if (d.x + d.x0 < b0.x) b0.x = d.x + d.x0;
		if (d.y + d.y0 < b0.y) b0.y = d.y + d.y0;
		if (d.x + d.x1 > b1.x) b1.x = d.x + d.x1;
		if (d.y + d.y1 > b1.y) b1.y = d.y + d.y1;
	}


	zeroArray(n): Array<0> {
		let a = [],
			i = -1;
		while (++i < n) a[i] = 0;
		return a;
	}


}
