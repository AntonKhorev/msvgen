export default class Marker {
	private viewBox: string
	private content: string

	constructor(
		private imageSizeX: number, private imageSizeY: number,
		markerSizeX: number, markerSizeY: number,
		hole: string,
		strokeWidth: number,
		fill: string
	) {
		const viewBoxMinX=-imageSizeX/2
		const viewBoxMinY=-(imageSizeY-markerSizeY-strokeWidth/2)-markerSizeX/2
		this.viewBox=`${viewBoxMinX} ${viewBoxMinY} ${imageSizeX} ${imageSizeY}`

		let path=computeOutlinePath(markerSizeY,markerSizeX/2)
		if (hole=='round') path+=` `+computeHolePath(4)

		this.content=``
		if (fill=='semi-inside') {
			this.content+=`<path d="${path}" fill="canvas"/>\n`
		}
		this.content+=`<path d="${path}"`
		this.content+=` fill="${fill=='none'?'none':'canvas'}"`
		if (fill=='semi-inside') {
			this.content+=` fill-opacity=".5" paint-order="stroke"`
		}
		this.content+=` stroke="currentColor"`
		if (strokeWidth!=1) {
			this.content+=` stroke-width="${strokeWidth}"`
		}
		this.content+=`/>\n`
	}

	get svg(): string {
		return (
			`<svg width="${this.imageSizeX}" height="${this.imageSizeY}" viewBox="${this.viewBox}">\n`+
			this.content+
			`</svg>`
		)
	}
}

function computeOutlinePath(h: number, r: number): string {
	const rp=h-r
	const y=r**2/rp
	const x=Math.sqrt(r**2-y**2)
	const xf=x.toFixed(2)
	const yf=y.toFixed(2)
	return `M0,${rp} L${xf},${yf} A${r},${r} 0 1 0 -${xf},${yf} Z`
}

function computeHolePath(r: number): string {
	return `M-${r},0 A${r},${r} 0 0 1 ${r},0 A${r},${r} 0 0 1 -${r},0`
}
