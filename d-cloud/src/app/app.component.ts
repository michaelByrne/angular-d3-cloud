import { Component, Output, EventEmitter } from '@angular/core';

import { D3CloudComponent } from './directives/d3-cloud/d3-cloud.component';
import { CloudConfig } from './cloud.config';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {

	//@Output() change: EventEmitter<CloudConfig> = new EventEmitter<CloudConfig>();

	// public fontFace: string,
	// public minFontSize: number,
	// public maxFontSize: number,
	// public spiral: string,
	// public fontWeight: string,
	// public rotationLow: number,
	// public rotationHigh: number,
	// public rotationNum: number,

	cloudConfig = new CloudConfig(null, 18, 56, null, null, -60, 60, 4);

	words = ["Crystal Geyser", "Arrowhead", "Evian", "Coors Light", "Bud", "Ballast Point Grapefruit Sculpin", "Iced Coffee", "Tap Water", "Homeade Lemonade", "Pinot Noir", "National Bohemian", "Pikesville Rye", "La Croix", "10 Barrel Joe", "Breakside Pilser", "A Friend's Sketchy Kombucha", "Pickle Juice", "Cooking Sherry", "Olive Brine", "Sea Water", "Polar Seltzer", "Generic Club Soda", "Yeungling", "Hop Nosh IPA", "XXX", "Dog Bowl Water", "Apocalypse Bathtub Water", "Walden Pond", "Hopped Cider", "Pear Cider"]
		.map(function(d) {
			return { text: d, size: 15 + Math.random() * 90 };
		});

	update(newVal) {
		this.cloudConfig.rotationNum = newVal;
	}







}
