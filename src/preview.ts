import Marker from './marker'
import { makeElement, makeDiv, makeLabel } from './html'

export default class Preview {
	private $box=makeDiv('box')()
	$widget=makeDiv('preview')(this.$box)

	constructor() {
		const $defineColorCheckbox=makeCheckbox()
		const $colorInput=makeColorInput()
		$defineColorCheckbox.oninput=$colorInput.oninput=()=>{
			$colorInput.disabled=!$defineColorCheckbox.checked
			if ($defineColorCheckbox.checked) {
				this.$box.style.color=$colorInput.value
			} else {
				this.$box.style.removeProperty('color')
			}
		}
		this.$widget.append(
			makeDiv('input-group')(
				makeLabel()(
					$defineColorCheckbox,` Define colors`
				)
			),
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

function makeCheckbox(): HTMLInputElement {
	const $checkbox=makeElement('input')()()
	$checkbox.type='checkbox'
	return $checkbox
}

function makeColorInput(): HTMLInputElement {
	const $input=makeElement('input')()()
	$input.type='color'
	$input.disabled=true
	return $input
}
