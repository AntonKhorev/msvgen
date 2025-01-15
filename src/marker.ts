export default class Marker {
	private viewBox: string
	private content: string

	constructor(
		private imageSizeX: number, private imageSizeY: number,
		markerSizeX: number, markerSizeY: number,
		strokeWidth: number, innerStrokeWidth: number,
		hole: string,
		markerFill: string, holeFill: string
	) {
		if (hole=='none') holeFill='none'

		const viewBoxMinX=-imageSizeX/2
		const viewBoxMinY=-(imageSizeY-markerSizeY)-markerSizeX/2
		this.viewBox=`${viewBoxMinX} ${viewBoxMinY} ${imageSizeX} ${imageSizeY}`

		this.content=``
		if (innerStrokeWidth==0) {
			if (markerFill=='none' || markerFill=='canvas') {
				this.content+=generateCombinedPathElement(
					markerSizeY,markerSizeX/2,strokeWidth/2,
					holeFill=='canvas'?'none':hole,
					markerFill,1,
					strokeWidth,1
				)
				if (holeFill=='canvas') {
					this.content+=generateHolePathElement(
						strokeWidth/2,
						markerFill=='canvas'?'none':holeFill,
						strokeWidth
					)
				}
			} else {
				this.content+=generateCombinedPathElement(
					markerSizeY,markerSizeX/2,0,
					holeFill=='canvas'?'none':hole,
					'canvas',1,
					0,1
				)
				this.content+=generateCombinedPathElement(
					markerSizeY,markerSizeX/2,strokeWidth/2,
					hole,
					markerFill,.75,
					strokeWidth,1
				)
			}
		} else {
			if (markerFill=='none' || markerFill=='canvas') {
				if (markerFill=='none' && holeFill=='canvas') {
					this.content+=generateHolePathElement(
						0,
						holeFill,
						0
					)
				}
				if (markerFill=='canvas' && holeFill=='canvas') {
					this.content+=generateCombinedPathElement(
						markerSizeY,markerSizeX/2,strokeWidth/2,
						'none',
						markerFill,1,
						strokeWidth,1
					)
					this.content+=generateHolePathElement(
						strokeWidth/2,
						'none',
						strokeWidth
					)
				} else {
					this.content+=generateCombinedPathElement(
						markerSizeY,markerSizeX/2,strokeWidth/2,
						hole,
						markerFill,1,
						strokeWidth,1
					)
				}
				this.content+=generateCombinedPathElement(
					markerSizeY,markerSizeX/2,strokeWidth+innerStrokeWidth/2,
					hole,
					'none',1,
					innerStrokeWidth,.5
				)
			} else {
				this.content+=generateCombinedPathElement(
					markerSizeY,markerSizeX/2,strokeWidth/2,
					holeFill=='canvas'?'none':hole,
					'canvas',1,
					strokeWidth,1
				)
				if (holeFill=='canvas') {
					this.content+=generateHolePathElement(
						strokeWidth/2,
						'none',
						strokeWidth
					)
				}
				this.content+=generateCombinedPathElement(
					markerSizeY,markerSizeX/2,strokeWidth+innerStrokeWidth/2,
					hole,
					'none',1,
					innerStrokeWidth,.5
				)
				this.content+=generateCombinedPathElement(
					markerSizeY,markerSizeX/2,strokeWidth+innerStrokeWidth,
					hole,
					markerFill,.75,
					0,1
				)
			}
		}
	}

	getSvg(scale=1): string {
		return (
			`<svg width="${this.imageSizeX*scale}" height="${this.imageSizeY*scale}" viewBox="${this.viewBox}">\n`+
			this.content+
			`</svg>`
		)
	}
}

function generateCombinedPathElement(
	h: number, r: number, s: number,
	hole: string,
	fill: string, fillOpacity: number,
	strokeWidth: number, strokeOpacity: number
): string {
	const holeRadius=4

	let path=computeOutlinePathCommands(h,r,s)
	if (hole=='round') {
		path+=` `+computeHolePathCommands(holeRadius,s)
	}

	let content=`<path d="${path}" fill="${fill}"`
	if (fill!='none' && fillOpacity!=1) {
		content+=` fill-opacity="${fillOpacity}"`
	}
	if (strokeWidth>0) {
		content+=` stroke="currentColor"`
		if (strokeWidth!=1) {
			content+=` stroke-width="${strokeWidth}"`
		}
		if (strokeOpacity!=1) {
			content+=` stroke-opacity="${strokeOpacity}"`
		}
	}
	content+=`/>\n`

	return content
}

function generateHolePathElement(
	s: number,
	fill: string,
	strokeWidth: number
): string {
	const holeRadius=4

	let content=`<path d="${computeHolePathCommands(holeRadius,s)}" fill="${fill}" stroke="currentColor"`
	if (strokeWidth!=1) {
		content+=` stroke-width="${strokeWidth}"`
	}
	content+=`/>\n`

	return content
}

function computeOutlinePathCommands(h: number, r: number, s=0): string {
	const p=h-r
	const y=r**2/p
	const x=Math.sqrt(r**2-y**2)

	const rs=r-s
	const ps=p*(1-s/r)
	const xs=x*(1-s/r)
	const ys=y*(1-s/r)

	return `M0,${f(ps)} L${f(xs)},${f(ys)} A${f(rs)},${f(rs)} 0 1 0 -${f(xs)},${f(ys)} Z`
}

function computeHolePathCommands(r: number, s=0): string {
	const rs=r+s

	return `M-${f(rs)},0 A${f(rs)},${f(rs)} 0 0 1 ${f(rs)},0 A${f(rs)},${f(rs)} 0 0 1 -${f(rs)},0`
}

function f(x: number): string {
	return x.toFixed(2).replace(/(\.\d*?)0+$/,(_,fr)=>fr=='.'?'':fr)
}
