type n2s = (z:number)=>string

type shapePendingState = null | {
	outline: true
	fill?: string
	tint?: string
}

export default class Marker {
	private viewBox: string
	private content: string

	constructor(
		coordinatesCenter: string,
		private imageSizeX: number, private imageSizeY: number,
		markerSizeX: number, markerSizeY: number,
		strokeWidth: number, innerStrokeWidth: number,
		stroke: string, innerStroke: string,
		hole: string,
		markerFill: string, holeFill: string,
		markerTint: string, holeTint: string
	) {
		const hasHole=hole!='none'

		// set up pending states
		let markerPendingState: shapePendingState = {outline: true}
		{
			if (markerFill!='none') markerPendingState.fill=markerFill
			if (markerTint!='none') markerPendingState.tint=markerTint
		}
		
		let holePendingState: shapePendingState = null
		if (hasHole) {
			holePendingState={outline: true}
			if (holeFill!='none') holePendingState.fill=holeFill
			if (holeTint!='none') holePendingState.tint=holeTint
		}

		// set up coordinates
		const viewBoxMinX=-imageSizeX/2
		const fx=f
		let viewBoxMinY: number
		let fy: n2s
		{
			const viewBoxMinYHole=-(imageSizeY-markerSizeY)-markerSizeX/2
			const viewBoxMinYImage=-markerSizeY/2
			if (coordinatesCenter=='hole') {
				viewBoxMinY=viewBoxMinYHole
				fy=f
			} else {
				viewBoxMinY=viewBoxMinYImage
				fy=(y)=>f(y+viewBoxMinYImage-viewBoxMinYHole)
			}
		}

		this.viewBox=`${viewBoxMinX} ${viewBoxMinY} ${imageSizeX} ${imageSizeY}`

		// render
		this.content=``

		// marker+hole fill
		if (
			markerPendingState && markerPendingState.fill && markerPendingState.tint && (
				!hasHole ||
				holePendingState && holePendingState.fill
			)
		) {
			this.content+=generateCombinedPathElement(fx,fy,
				markerSizeY,markerSizeX/2,strokeWidth/2,
				'none',
				markerPendingState.fill,1,
				stroke,0,1
			)
			if (holePendingState && markerPendingState.fill==holePendingState.fill) {
				delete holePendingState.fill
			}
			delete markerPendingState.fill
		}

		// marker fill
		if (
			markerPendingState && markerPendingState.fill &&
			holePendingState && markerPendingState.fill!=holePendingState.fill
		) {
			this.content+=generateCombinedPathElement(fx,fy,
				markerSizeY,markerSizeX/2,strokeWidth/2,
				hole,
				markerPendingState.fill,1,
				stroke,0,1
			)
			delete markerPendingState.fill
		}

		// marker+hole fill, marker outline
		if (
			markerPendingState && markerPendingState.fill && !markerPendingState.tint && (
				!hasHole ||
				holePendingState && holePendingState.fill
			)
		) {
			this.content+=generateCombinedPathElement(fx,fy,
				markerSizeY,markerSizeX/2,strokeWidth/2,
				'none',
				markerPendingState.fill,1,
				stroke,strokeWidth,1
			)
			if (holePendingState && markerPendingState.fill==holePendingState.fill) {
				delete holePendingState.fill
			}
			markerPendingState=null
		}

		// marker fill, marker+hole outline
		if (
			markerPendingState && markerPendingState.fill && !markerPendingState.tint &&
			holePendingState && !holePendingState.fill && !holePendingState.tint
		) {
			this.content+=generateCombinedPathElement(fx,fy,
				markerSizeY,markerSizeX/2,strokeWidth/2,
				hole,
				markerPendingState.fill,1,
				stroke,strokeWidth,1
			)
			holePendingState=null
			markerPendingState=null
		}

		// hole fill
		if (
			holePendingState && holePendingState.fill && holePendingState.tint
		) {
			this.content+=generateHolePathElement(fx,fy,
				strokeWidth/2,
				holePendingState.fill,1,
				stroke,0,1
			)
			delete holePendingState.fill
		}

		// hole fill+outline
		if (
			holePendingState && holePendingState.fill && !holePendingState.tint
		) {
			this.content+=generateHolePathElement(fx,fy,
				strokeWidth/2,
				holePendingState.fill,1,
				stroke,strokeWidth,1
			)
			holePendingState=null
		}

		// should have cleared fills

		// marker tint, marker+hole outline
		if (
			markerPendingState && markerPendingState.tint && (
				!holePendingState || !holePendingState.tint
			)
		) {
			this.content+=generateCombinedPathElement(fx,fy,
				markerSizeY,markerSizeX/2,strokeWidth/2,
				hole,
				markerPendingState.tint,.75,
				stroke,strokeWidth,1
			)
			holePendingState=null
			markerPendingState=null
		}

		// marker+hole tint, marker outline
		if (
			markerPendingState && markerPendingState.tint && 
			holePendingState && holePendingState.tint && markerPendingState.tint==holePendingState.tint
		) {
			this.content+=generateCombinedPathElement(fx,fy,
				markerSizeY,markerSizeX/2,strokeWidth/2,
				'none',
				markerPendingState.tint,.75,
				stroke,strokeWidth,1
			)
			delete holePendingState.tint
			markerPendingState=null
		}

		// marker tint
		// TODO: don't need this case if can run hole fill after it
		if (
			markerPendingState && markerPendingState.tint &&
			holePendingState && holePendingState.tint
		) {
			this.content+=generateCombinedPathElement(fx,fy,
				markerSizeY,markerSizeX/2,strokeWidth/2,
				hole,
				markerPendingState.tint,.75,
				stroke,0,1
			)
			delete markerPendingState.tint
		}

		// hole tint+outline
		if (
			holePendingState && holePendingState.tint
		) {
			this.content+=generateHolePathElement(fx,fy,
				strokeWidth/2,
				holePendingState.tint,.75,
				stroke,strokeWidth,1
			)
			holePendingState=null
		}

		// should have cleared tints

		if (markerPendingState && holePendingState) {
			this.content+=generateCombinedPathElement(fx,fy,
				markerSizeY,markerSizeX/2,strokeWidth/2,
				hole,
				'none',1,
				stroke,strokeWidth,1
			)
			holePendingState=null
			markerPendingState=null
		}

		if (markerPendingState) {
			this.content+=generateCombinedPathElement(fx,fy,
				markerSizeY,markerSizeX/2,strokeWidth/2,
				'none',
				'none',1,
				stroke,strokeWidth,1
			)
			markerPendingState=null
		}

		if (holePendingState) {
			this.content+=generateHolePathElement(fx,fy,
				strokeWidth/2,
				'none',1,
				stroke,strokeWidth,1
			)
			holePendingState=null
		}

		// should have cleared outlines

		if (innerStrokeWidth>0) {
			this.content+=generateCombinedPathElement(fx,fy,
				markerSizeY,markerSizeX/2,strokeWidth+innerStrokeWidth/2,
				hole,
				'none',1,
				innerStroke,innerStrokeWidth,.5
			)
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
	fx: n2s, fy: n2s,
	h: number, r: number, s: number,
	hole: string,
	fill: string, fillOpacity: number,
	stroke: string, strokeWidth: number, strokeOpacity: number
): string {
	const holeRadius=4

	let path=computeOutlinePathCommands(fx,fy,h,r,s)
	if (hole=='round') {
		path+=` `+computeHolePathCommands(fx,fy,holeRadius,s)
	}

	let content=`<path d="${path}"`
	content+=addFillAttributes(fill,fillOpacity)
	content+=addStrokeAttributes(stroke,strokeWidth,strokeOpacity)
	content+=`/>\n`

	return content
}

function generateHolePathElement(
	fx: n2s, fy: n2s,
	s: number,
	fill: string, fillOpacity: number,
	stroke: string, strokeWidth: number, strokeOpacity: number
): string {
	const holeRadius=4

	let content=`<path d="${computeHolePathCommands(fx,fy,holeRadius,s)}"`
	content+=addFillAttributes(fill,fillOpacity)
	content+=addStrokeAttributes(stroke,strokeWidth,strokeOpacity)
	content+=`/>\n`

	return content
}

function addFillAttributes(fill: string, fillOpacity=1): string {
	let content=` fill="${fill}"`
	if (fill!='none' && fillOpacity!=1) {
		content+=` fill-opacity="${fillOpacity}"`
	}
	return content
}

function addStrokeAttributes(stroke: string, strokeWidth: number, strokeOpacity=1): string {
	let content=``
	if (strokeWidth>0) {
		content+=` stroke="${stroke}"`
		if (strokeWidth!=1) {
			content+=` stroke-width="${strokeWidth}"`
		}
		if (strokeOpacity!=1) {
			content+=` stroke-opacity="${strokeOpacity}"`
		}
	}
	return content
}

function computeOutlinePathCommands(fx: n2s, fy: n2s, h: number, r: number, s=0): string {
	const p=h-r
	const y=r**2/p
	const x=Math.sqrt(r**2-y**2)

	const rs=r-s
	const ps=p*(1-s/r)
	const xs=x*(1-s/r)
	const ys=y*(1-s/r)

	return `M${fx(0)},${fy(ps)} L${fx(xs)},${fy(ys)} A${f(rs)},${f(rs)} 0 1 0 ${fx(-xs)},${fy(ys)} Z`
}

function computeHolePathCommands(fx: n2s, fy: n2s, r: number, s=0): string {
	const rs=r+s

	return `M${fx(-rs)},${fy(0)} A${f(rs)},${f(rs)} 0 0 1 ${fx(rs)},${fy(0)} A${f(rs)},${f(rs)} 0 0 1 ${fx(-rs)},${fy(0)}`
}

function f(x: number): string {
	return x.toFixed(2).replace(/(\.\d*?)0+$/,(_,fr)=>fr=='.'?'':fr)
}
