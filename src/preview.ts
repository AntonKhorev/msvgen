import { makeDiv } from './html'

export default class Preview {
	$widget=makeDiv('preview')()

	render(
		imageSizeX: number, imageSizeY: number,
		markerSizeX: number, markerSizeY: number,
		hole: string,
		strokeWidth: number,
		fill: boolean
	): void {
		const viewBoxMinX=-imageSizeX/2
		const viewBoxMinY=-(imageSizeY-markerSizeY-strokeWidth/2)-markerSizeX/2
		let path=computeOutlinePath(markerSizeY,markerSizeX/2)
		if (hole=='round') path+=` `+computeHolePath(4)
		let content=`<path d="${path}"`
		content+=` fill="${fill?'canvas':'none'}"`
		content+=` stroke="currentColor"`
		if (strokeWidth!=1) content+=` stroke-width="${strokeWidth}"`
		content+=`/>`
		this.$widget.innerHTML=`<svg width="${imageSizeX}" height="${imageSizeY}" viewBox="${viewBoxMinX} ${viewBoxMinY} ${imageSizeX} ${imageSizeY}">${content}</svg>`
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
