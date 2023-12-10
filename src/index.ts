import { makeDiv } from './html'

main()

function main() {
	const $controls=makeDiv()(`TODO controls`)
	const $preview=makeDiv()(`TODO preview`)
	const $panel=makeDiv()($controls,$preview)
	document.body.append($panel)
}
