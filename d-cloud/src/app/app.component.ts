import { Component, Input, ElementRef, DoCheck, KeyValueDiffers } from '@angular/core';
//import { WordCloudConfig } from '../../../models/charts/word-cloud-config';


import * as D3 from 'd3';

declare let d3: any;

var config = {
	dataset: [{ "text": "study", "size": 40 }, { "text": "motion", "size": 15 }],
	settings: {
		fontFace: null,
		minFontSize: 18,
		maxFontSize: 56,
		spiral: null,
		fontWeight: null,

	}

}


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck {

	words = ["Crystal Geyser", "Arrowhead", "Evian", "Coors Light", "Bud", "Ballast Point Grapefruit Sculpin", "Iced Coffee", "Tap Water", "Homeade Lemonade", "Pinot Noir", "National Bohemian", "Pikesville Rye", "La Croix", "10 Barrel Joe", "Breakside Pilser", "A Friend's Sketchy Kombucha", "Pickle Juice", "Cooking Sherry", "Olive Brine", "Sea Water", "Polar Seltzer", "Generic Club Soda", "Yeungling", "Hop Nosh IPA", "XXX", "Dog Bowl Water", "Apocalypse Bathtub Water", "Walden Pond", "Hopped Cider", "Pear Cider"]
		.map(function(d) {
			return { text: d, size: 15 + Math.random() * 90 };
		});

	config = {
		dataset: this.words,
		settings: {
			fontFace: null,
			minFontSize: 18,
			maxFontSize: 56,
			spiral: null,
			fontWeight: null,
			rotation: { low: -60, high: 60, num: 8 }

		}

	}

	private _host;              // D3 object referencing host DOM object
	private _svg;               // SVG in which we will print our chart
	private _margin: {          // Space between the svg borders and the actual chart graphic
		top: number,
		right: number,
		bottom: number,
		left: number
	};
	private _width: number;      // Component width
	private _height: number;     // Component height
	private _htmlElement: HTMLElement; // Host HTMLElement
	private _minCount: number;   // Minimum word count
	private _maxCount: number;   // Maximum word count
	private _fontScale;          // D3 scale for font size
	private _fillScale;          // D3 scale for text color
	private _objDiffer;
	private _rotations: number[];

	constructor(private _element: ElementRef, private _keyValueDiffers: KeyValueDiffers) {
		this._htmlElement = this._element.nativeElement;
		this._host = D3.select(this._element.nativeElement);
		//console.log(this._host);
		this._objDiffer = this._keyValueDiffers.find([]).create(null);
		// this._setup();
		// this._buildSVG();
		// this._populate();

	}

	ngDoCheck() {
		let changes = this._objDiffer.diff(this.config);
		if (changes) {
			if (!this.config) {
				return;
			}
			//console.log("changes");
			this._setup();
			this._buildSVG();
			this._populate();
		}
	}

	private _setup() {
		this._margin = {
			top: 10,
			right: 10,
			bottom: 10,
			left: 10
		};

		this._width = ((this._htmlElement.parentElement.clientWidth == 0)
			? 300
			: this._htmlElement.parentElement.clientWidth) - this._margin.left - this._margin.right;
		if (this._width < 100) {
			this._width = 100;
		}
		this._height = this._width * 0.75 - this._margin.top - this._margin.bottom;


		this._minCount = D3.min(this.config.dataset, d => d.count);
		this._maxCount = D3.max(this.config.dataset, d => d.count);

		let minFontSize: number = (this.config.settings.minFontSize == null) ? 18 : this.config.settings.minFontSize;
		let maxFontSize: number = (this.config.settings.maxFontSize == null) ? 96 : this.config.settings.maxFontSize;

		this._fontScale = D3.scaleLinear()
			.domain([this._minCount, this._maxCount])
			.range([minFontSize, maxFontSize]);
		this._fillScale = D3.scaleOrdinal(D3.schemeCategory20);
		this._rotations = this._calculateRotationAngles(this.config.settings.rotation.low, this.config.settings.rotation.high, this.config.settings.rotation.num);
		var angle = this._pickRandomFromArray(this._rotations);
		console.log(angle);

	}

	private _buildSVG() {
		this._host.html('');
		this._svg = this._host
			.append('svg')
			.attr('width', this._width + this._margin.left + this._margin.right)
			.attr('height', this._height + this._margin.top + this._margin.bottom)
			.append('g')
			.attr('transform', 'translate(' + ~~(this._width / 2) + ',' + ~~(this._height / 2) + ')')

	}

	private _populate() {
		let fontFace: string = (this.config.settings.fontFace == null) ? 'Roboto' : this.config.settings.fontFace;
		let fontWeight: string = (this.config.settings.fontWeight == null) ? 'normal' : this.config.settings.fontWeight;
		let spiralType: string = (this.config.settings.spiral == null) ? 'rectangular' : this.config.settings.spiral;

		d3.layout.cloud()
			.size([this._width, this._height])
			.words(this.config.dataset)
			.rotate(() => this._rotations[Math.floor(Math.random() * this._rotations.length)])
			.font(fontFace)
			.fontWeight(fontWeight)
			.fontSize(function(d) { return d.size; })
			.spiral("archimedean")
			.on('end', () => {
				this._drawWordCloud(this.config.dataset);
			})
			.start();
	}

	private _drawWordCloud(words) {
		console.log(words);
		this._svg
			.selectAll('text')
			.data(words)
			.enter()
			.append('text')
			.style('font-size', d => d.size + 'px')
			.style('fill', (d, i) => {
				return this._fillScale(i);
			})
			.attr('text-anchor', 'middle')
			.attr('transform', d => 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')')
			.attr('class', 'word-cloud')
			.text(d => {
				//console.log(d);
				return d.text;
			});
	}

	private _calculateRotationAngles(low, high, num) {
		var diff = (high - low) / (num - 1);
		var rotations = [];

		var counter = 0;
		var current = low;
		while (counter < num) {
			rotations.push(current);
			current += diff;
			counter++;
		}
		return rotations;
	}

	private _pickRandomFromArray(array) {
		let value = array[Math.floor(Math.random() * array.length)];
		console.log(value);
		return value;
	}




}
