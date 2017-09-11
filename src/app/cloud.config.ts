
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

export class Word {
	constructor(
		public text?: string,
		public font?: string,
		public hasText?: boolean,
		public rotate?: number,
		public size?: number,
		public width?: number,
		public x?: number,
		public x0?: number,
		public x1?: number,
		public xoff?: number,
		public y?: number,
		public y0?: number,
		public y1?: number,
		public yoff?: number,
		public padding?: number,
		public cloud?: any,
		public canvas?: any
	) { }
}

export class WordFreq {
	constructor(
		public text: string,
		public size: number
	) { }
}
