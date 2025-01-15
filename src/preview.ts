import Marker from './marker'
import { makeElement, makeDiv, makeLabel } from './html'

export default class Preview {
	private $box=makeDiv('box')()
	$widget=makeDiv('preview')(this.$box)

	constructor() {
		const $colorInput=makeColorInput()
		$colorInput.oninput=()=>{
			this.$box.style.color=$colorInput.value
		}
		this.$widget.append(
			makeDiv('input-group')(
				makeLabel()(
					`currentColor `,$colorInput
				)
			)
		)
	}

	render(marker: Marker): void {
		this.$box.innerHTML=marker.svg
	}
}

function makeColorInput(): HTMLInputElement {
	const $input=makeElement('input')()()
	$input.type='color'
	return $input
}
