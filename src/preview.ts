import Marker from './marker'
import { makeElement, makeDiv, makeLabel } from './html'

export default class Preview {
	#marker?: Marker

	private $box=makeDiv('box')()
	private $zoomInput=makeRangeInput('zoom-data-list',10)
	$widget=makeDiv('preview')()

	constructor() {
		this.$zoomInput.oninput=()=>this.render()

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
					`Zoom `,this.$zoomInput
				),
				makeRangeDataList('zoom-data-list',10)
			),
			this.$box,
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

	set marker(marker: Marker) {
		this.#marker=marker
		this.render()
	}

	private render(): void {
		if (!this.#marker) return
		const scale=Number(this.$zoomInput.value)||1
		this.$box.innerHTML=this.#marker.getSvg(scale)
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

function makeRangeInput(dataListId: string, maxValue: number): HTMLInputElement {
	const $input=makeElement('input')()()
	$input.type='range'
	$input.value=$input.min='1'
	$input.max=String(maxValue)
	$input.step='1'
	$input.setAttribute('list',dataListId)
	return $input
}

function makeRangeDataList(id: string, maxValue: number): HTMLDataListElement {
	const $dataList=makeElement('datalist')()()
	$dataList.id=id
	for (let value=1;value<=maxValue;value++) {
		$dataList.append(new Option('×'+String(value),String(value)))
	}
	return $dataList
}
