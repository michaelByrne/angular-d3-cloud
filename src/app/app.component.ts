import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { D3CloudComponent } from './directives/d3-cloud/d3-cloud.component';
import { CloudConfig, WordFreq } from './cloud.config';


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
	padding: number = 1;
	cloudConfig = new CloudConfig(null, 18, 56, 'rectangular', null, -90, 90, 3, 1);

	words: any;

	wForm: FormGroup
	wordListString: string;

	wordList = ["Crystal Geyser", "Arrowhead", "Evian", "Coors Light", "Bud", "Grapefruit Sculpin", "Iced Coffee", "Tap Water", "Lemonade", "Pinot Noir", "Bohemian", "Rye", "La Croix", "10 Barrel Joe", "Breakside", "Kombucha", "Pickle Juice", "Sherry", "Olive Brine", "Sea Water", "Polar Seltzer", "Soda", "Yeungling", "IPA", "XXX", "Dog Bowl Water", "Wet", "Pond", "Hopped Cider", "Pear Cider", "Foam", "Wine", "Rum", "Whiskey", "Bourbon", "Tea", "Mysteries", "OJ", "Malk", "Goat Stuff", "Ooze", "Sea", "Sludge", "Slugs", "Brew", "Lager", "APA", "Cider"];

	constructor(private formBuilder: FormBuilder) {
		this.rForm = formBuilder.group({
			'numAngles': [3, Validators.required],
			'minFont': [15, Validators.required],
			'maxFont': [60, Validators.required],
			'padding': [1, Validators.required]
		});
		this.wForm = formBuilder.group({
			'wordListString': [null, Validators.required]
		})
		this.buildWordList(15, 80, this.wordList);
	}

	ngOnInit() {
		this.numAngles = 3;
	}

	updateCloud(post) {
		this.numAngles = post.numAngles;
		this.minFont = post.minFont;
		this.maxFont = post.maxFont;
		this.padding = post.padding;
		this.cloudConfig.rotationNum = this.numAngles;
		this.cloudConfig.padding = this.padding;
		this.buildWordList(this.minFont, this.maxFont, this.wordList);
	}

	processWords(wordString) {
		let freq = this.wordFreq(wordString.wordListString);
		this.words = freq;
		//console.log(freq);
		// let wordList = wordString.wordListString.split(' ');
		// this.wordList = wordList;
		// this.buildWordList(this.minFont, this.maxFont, this.wordList);
	}

	buildWordList(minFont, maxFont, words) {
		this.words = words.map((d) =>
		{ return { text: d, size: minFont + Math.random() * maxFont } }
		);
		console.log(this.words);
	}

	wordFreq(string): any {
		let yourFormat = [];
		let words = string.replace(/[.]/g, '').split(/\s/);
		let freqMap = new Map();
		words.forEach(function(w) {
			if (!freqMap[w]) {
				freqMap[w] = 0;
			}
			freqMap[w] += 1;
		});
		console.log(freqMap);
		for (var w in freqMap) {
			console.log(freqMap[w]); console.log(w);
			let newWord = { "text": w, "size": freqMap[w] * 30 }
			yourFormat.push(newWord)
		};
		return yourFormat;
	}


}
