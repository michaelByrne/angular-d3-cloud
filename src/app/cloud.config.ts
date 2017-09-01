
export class CloudConfig {
	constructor(
		public fontFace: string,
		public minFontSize: number,
		public maxFontSize: number,
		public spiral: string,
		public fontWeight: string,
		public rotationLow: number,
		public rotationHigh: number,
		public rotationNum: number,
		public padding: number
	) { }

}

export class WordFreq {
	constructor(
		public text: string,
		public count: number
	) { }
}
