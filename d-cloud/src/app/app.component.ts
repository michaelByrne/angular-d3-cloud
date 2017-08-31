import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { D3CloudComponent } from './directives/d3-cloud/d3-cloud.component';
import { CloudConfig } from './cloud.config';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	rForm: FormGroup;
	numAngles: number;
	minFont: number = 10;
	maxFont: number = 60;
	cloudConfig = new CloudConfig(null, 18, 56, 'rectangular', null, -90, 90, 3, 0);
	words: any;

	constructor(private formBuilder: FormBuilder) {
		this.rForm = formBuilder.group({
			'numAngles': [3, Validators.required],
			'minFont': [15, Validators.required],
			'maxFont': [60, Validators.required]
		});
		this.buildWordList(15, 80);
	}

	ngOnInit() {
		this.numAngles = 3;
	}

	updateCloud(post) {
		this.numAngles = post.numAngles;
		this.cloudConfig.rotationNum = this.numAngles;
		this.minFont = post.minFont;
		this.maxFont = post.maxFont;
		this.buildWordList(this.minFont, this.maxFont);
		console.log(this.cloudConfig);
	}

	buildWordList(minFont, maxFont) {
		console.log(minFont);
		console.log(maxFont);
		this.words = ["Crystal Geyser", "Arrowhead", "Evian", "Coors Light", "Bud", "Grapefruit Sculpin", "Iced Coffee", "Tap Water", "Lemonade", "Pinot Noir", "Bohemian", "Rye", "La Croix", "10 Barrel Joe", "Breakside", "Kombucha", "Pickle Juice", "Sherry", "Olive Brine", "Sea Water", "Polar Seltzer", "Soda", "Yeungling", "IPA", "XXX", "Dog Bowl Water", "Wet", "Pond", "Hopped Cider", "Pear Cider", "Foam", "Wine", "Rum", "Whiskey", "Bourbon", "Tea", "Mysteries", "OJ", "Malk", "Goat Stuff", "Ooze", "Sea", "Sludge", "Slugs", "Brew", "Lager", "APA", "Cider"]
			.map((d) =>
			{ return { text: d, size: minFont + Math.random() * maxFont } }
			);
	}

	//cloudConfig = new CloudConfig(null, 18, 56, 'rectangular', null, -90, 90, 15);





	update(newVal) {
		this.cloudConfig.rotationNum = newVal;
	}







}
