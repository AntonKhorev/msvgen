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
		const sy=350

		const pad0=28.5
		const pad1=4.5

		const h=sy
		const r=sx/2
		const p=h-r
		const y=r**2/p
		const x=Math.sqrt(r**2-y**2)

		this.$figure.innerHTML=`<svg width="${f(sx+pad0+pad1)}" height="${f(sy+pad0+pad1)}" viewBox="${f(-sx/2-pad0)} ${f(-sx/2-pad0)} ${f(sx+pad0+pad1)} ${f(sy+pad0+pad1)}">
			<defs>
				<marker id="arrow-head" markerWidth="16" markerHeight="8" viewBox="-16 -4 16 8" orient="auto-start-reverse">
					<path d="M-12,0 L-16,3 L0,0 L-16,-3 Z" fill="currentColor" stroke="none" />
				</marker>
			</defs>
			<g fill="none" stroke="currentColor">
				<path d="M${f(0)},${f(p)} L${f(x)},${f(y)} A${f(r)},${f(r)} 0 1 0 ${f(-x)},${f(y)} Z" stroke-width="2" />
				<line x1="-8" x2="8" />
				<line y1="-8" y2="8" />
				<g stroke-dasharray="2">
					<circle r="${f(r)}" />
					<line x1="${f(-r)}" x2="${f(-r)}" y1="${f(-r-16)}" />
					<line x1="${f(r)}" x2="${f(r)}" y1="${f(-r-16)}" />
					<line x1="${f(-r-16)}" y1="${f(-r)}" y2="${f(-r)}" />
					<line x1="${f(-r-16)}" y1="${f(p)}" y2="${f(p)}" />
				</g>
				<g marker-start="url(#arrow-head)" marker-end="url(#arrow-head)">
					<line x1="${f(-r)}" x2="${f(r)}" y1="${f(-r-8)}" y2="${f(-r-8)}" />
					<line x1="${f(-r-8)}" x2="${f(-r-8)}" y1="${f(-r)}" y2="${f(p)}" />
					<line y1="${f(-r)}" />
					<line y2="${f(p)}" />
					<line x2="${f(x)}" y2="${f(y)}" />
					<line x2="${f(x)}" />
					<line x1="${f(x)}" x2="${f(x)}" y2="${f(y)}" />
				</g>
			</g>
			<g fill="currentColor">
				<text y="${f(-r-12)}" text-anchor="middle">w</text>
				<text x="${f(-r-12)}" y="${f((p-r)/2)}" text-anchor="end" dominant-baseline="middle">h</text>
				<text x="-4" y="${f(-r/2)}" text-anchor="end" dominant-baseline="middle">r</text>
				<text x="-4" y="${f(p/2)}" text-anchor="end" dominant-baseline="middle">p</text>
				<text x="${f(x/2)}" y="${f(y/2)}" text-anchor="middle"dominant-baseline="text-before-edge">r</text>
				<text x="${f(x/2)}" y="-4" text-anchor="middle">x</text>
				<text x="${f(x+4)}" y="${f(y/2)}" dominant-baseline="middle">y</text>
			</g>
		</svg>`

		this.$math.replaceChildren(`TBD`)
	}
}

function f(x: number): string {
	return x.toFixed(2).replace(/(\.\d*?)0+$/,(_,fr)=>fr=='.'?'':fr)
}
