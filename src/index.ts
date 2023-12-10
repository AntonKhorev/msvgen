import { makeDiv } from './html'

main()

function main() {
	const $controls=makeDiv()(`TODO controls`)
	const $panel=makeDiv('panel')($controls,makePreview())
	document.body.append($panel)
}

function makePreview(): HTMLElement {
	const $preview=makeDiv()()
	const imageSizeX=32
	const imageSizeY=32
	const markerSizeX=20
	const markerSizeY=30
	const strokeWidth=1
	const viewBoxMinX=-imageSizeX/2
	const viewBoxMinY=-(imageSizeY-markerSizeY-strokeWidth/2)-markerSizeX/2
	let content=`<path d="${computeMarkerOutlinePath(markerSizeY,markerSizeX/2)}" fill="none" stroke="currentColor"`
	if (strokeWidth!=1) content+=` stroke-width="${strokeWidth}"`
	content+=`/>`
	$preview.innerHTML=`<svg width="${imageSizeX}" height="${imageSizeY}" viewBox="${viewBoxMinX} ${viewBoxMinY} ${imageSizeX} ${imageSizeY}">${content}</svg>`
	return $preview
}

function computeMarkerOutlinePath(h: number, r: number): string {
	const rp=h-r
	const y=r**2/rp
	const x=Math.sqrt(r**2-y**2)
	const xf=x.toFixed(2)
	const yf=y.toFixed(2)
	return `M0,${rp} L-${xf},${yf} A${r},${r} 0 1 1 ${xf},${yf} Z`
}
