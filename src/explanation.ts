import { makeElement, makeDiv } from './html'

export default class Explanation {
	private readonly $figure=makeElement('figure')()()
	private readonly $math=makeDiv('math')()

	$widget=makeElement('details')()(
		makeElement('summary')()(`Marker shape math explanation`),
		makeDiv('explanation')(
			this.$figure,this.$math
		)
	)

	render(): void {
		const sx=250
		const sy=400
		const padding=4.5
		const leftPadding=24.5
		const h=sy
		const r=sx/2
		const p=h-r
		this.$figure.innerHTML=`<svg width="${f(sx+padding+leftPadding)}" height="${f(sy+2*padding)}" viewBox="${f(-sx/2-leftPadding)} ${f(-sx/2-padding)} ${f(sx+padding+leftPadding)} ${f(sy+2*padding)}">
			<defs>
				<marker id="arrow-head" markerWidth="16" markerHeight="8" viewBox="-16 -4 16 8" orient="auto-start-reverse">
					<path d="M-12,0 L-16,4 L0,0 L-16,-4 Z" fill="currentColor" stroke="none" />
				</marker>
			</defs>
			<g fill="none" stroke="currentColor">
				<path d="${computeOutlinePathCommands(f,f,sy,r)}" stroke-width="2" />
				<line x1="-8" x2="8" />
				<line y1="-8" y2="8" />
				<line x1="${f(-r-8)}" x2="${f(-r-8)}" y1="${f(-r)}" marker-start="url(#arrow-head)" marker-end="url(#arrow-head)" />
				<line x1="${f(-r-8)}" x2="${f(-r-8)}" y2="${f(p)}" marker-start="url(#arrow-head)" marker-end="url(#arrow-head)" />
				<g stroke-dasharray="2">
					<circle r="${f(r)}" />
					<line x1="${f(-r-16)}" y1="${f(-r)}" y2="${f(-r)}" />
					<line x1="${f(-r-16)}" />
					<line x1="${f(-r-16)}" y1="${f(p)}" y2="${f(p)}" />
				</g>
			</g>
			<g fill="currentColor">
				<text x="${f(-r-12)}" y="${f(-r/2)}" text-anchor="end" dominant-baseline="middle">r</text>
				<text x="${f(-r-12)}" y="${f(p/2)}" text-anchor="end" dominant-baseline="middle">p</text>
			</g>
		</svg>`

		this.$math.replaceChildren(`TBD`)
	}
}

// TODO remove copypaste
type n2s = (z:number)=>string

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

function f(x: number): string {
	return x.toFixed(2).replace(/(\.\d*?)0+$/,(_,fr)=>fr=='.'?'':fr)
}
