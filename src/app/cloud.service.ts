import { Injectable, ElementRef } from '@angular/core';

import { Word, WordFreq, CloudConfig } from './cloud.config';

@Injectable()
export class CloudService {

	cloudRadians = Math.PI / 180;
	cw = 1 << 11 >> 5;
	ch = 1 << 11;



	placeWords(wordList: WordFreq[]): Word[] {
		let placedWords: Word[];
		wordList.forEach(rawWord => {
			let word = new Word();
			word.text = rawWord.text;
			word.font = 'Impact';
			word.rotate = 0;
			word.size = rawWord.size;
			word.x = (256 * (Math.random() + .5)) >> 1;
			word.y = (256 * (Math.random() + .5)) >> 1;
			word.padding = 1;
			//console.log(word);
			this.cloudCanvas();
			let canvas = this.cloudCanvas();
			//this.getContext(canvas);
		})

		return [];
	}

	getContext(canvas) {
		canvas.width = canvas.height = 1;
		let ratio = Math.sqrt(canvas.getContext("2d").getImageData(0, 0, 1, 1).data.length >> 2);
		canvas.width = (this.cw << 5) / ratio;
		canvas.height = this.ch / ratio;

		let context = canvas.getContext("2d");
		context.fillStyle = context.strokeStyle = "red";
		context.textAlign = "center";

		return { context: context, ratio: ratio };
	}

	cloudCanvas() {
		let canvas = document.createElement("canvas");

	}

	functor(d) {
		return typeof d === "function" ? d : function() { return d; };
	}

}
