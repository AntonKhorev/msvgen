import Preview from './preview'
import { makeElement, makeDiv, makeLabel } from './html'

main()

function main() {
	const preview=new Preview
	const $panel=makeDiv('panel')(makeControls(preview),preview.$widget)
	document.body.append($panel)
}

function makeControls(preview: Preview): HTMLElement {
	const $imageSizeXInput=makeNumberInput(32)
	const $imageSizeYInput=makeNumberInput(32)
	const $markerSizeXInput=makeNumberInput(21)
	const $markerSizeYInput=makeNumberInput(31)
	const $inputs=[
			$imageSizeXInput,$imageSizeYInput,
			$markerSizeXInput,$markerSizeYInput
	]
	const n=$input=>Number($input.value)
	const renderPreview=()=>{
		preview.render(
			n($imageSizeXInput),n($imageSizeYInput),
			n($markerSizeXInput),n($markerSizeYInput)
		)
	}
	for (const $input of $inputs) {
		$input.oninput=renderPreview
	}
	renderPreview()
	return makeDiv('controls')(
		makeDiv('input-group')(
			makeLabel()(
				`Image width `,$imageSizeXInput
			),
		),
		makeDiv('input-group')(
			makeLabel()(
				`Image height `,$imageSizeYInput
			)
		),
		makeDiv('input-group')(
			makeLabel()(
				`Marker width `,$markerSizeXInput
			),
		),
		makeDiv('input-group')(
			makeLabel()(
				`Marker height `,$markerSizeYInput
			)
		)
	)
}

function makeNumberInput(value: number): HTMLInputElement {
	const $input=makeElement('input')()()
	$input.type='number'
	$input.min='1'
	$input.value=String(value)
	return $input
}
