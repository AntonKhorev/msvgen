export default class Marker {
	private viewBox: string
	private content: string

	constructor(
		private imageSizeX: number, private imageSizeY: number,
		markerSizeX: number, markerSizeY: number,
		strokeWidth: number, innerStrokeWidth: number,
		hole: string, fill: string
	) {
		const viewBoxMinX=-imageSizeX/2
		const viewBoxMinY=-(imageSizeY-markerSizeY)-markerSizeX/2
		this.viewBox=`${viewBoxMinX} ${viewBoxMinY} ${imageSizeX} ${imageSizeY}`

		this.content=``
		this.content+=generateCombinedPathElement(
			markerSizeY,markerSizeX/2,strokeWidth/2,
			hole,fill,
			strokeWidth,1
		)
		if (innerStrokeWidth>0) this.content+=generateCombinedPathElement(
			markerSizeY,markerSizeX/2,strokeWidth+innerStrokeWidth/2,
			hole,'none',
			innerStrokeWidth,.5
		)
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
	hole: string, fill: string,
	strokeWidth: number, strokeOpacity: number
): string {
	const holeRadius=4

	let path=computeOutlinePathCommands(h,r,s)
	if (hole=='round') {
		path+=` `+computeHolePathCommands(holeRadius,s)
	}

	let content=`<path d="${path}" fill="${fill}" stroke="currentColor"`
	if (strokeWidth!=1) {
		content+=` stroke-width="${strokeWidth}"`
	}
	if (strokeOpacity!=1) {
		content+=` stroke-opacity="${strokeOpacity}"`
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

	const rf=rs.toFixed(2)
	const pf=ps.toFixed(2)
	const xf=xs.toFixed(2)
	const yf=ys.toFixed(2)

	return `M0,${pf} L${xf},${yf} A${rf},${rf} 0 1 0 -${xf},${yf} Z`
}

function computeHolePathCommands(r: number, s=0): string {
	const rs=r+s

	const rf=rs.toFixed(2)

	return `M-${rf},0 A${rf},${rf} 0 0 1 ${rf},0 A${rf},${rf} 0 0 1 -${rf},0`
}
