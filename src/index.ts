import Preview from './preview'
import { makeElement, makeDiv, makeLabel } from './html'

main()

function main() {
	const preview=new Preview
	const $panel=makeDiv('panel')(makeControls(preview),preview.$widget)
	document.body.append($panel)
}

function makeControls(preview: Preview): HTMLElement {
	const $imageSizeXInput=makeElement('input')()()
	$imageSizeXInput.type='number'
	$imageSizeXInput.min='1'
	$imageSizeXInput.value='32'
	const $imageSizeYInput=makeElement('input')()()
	$imageSizeYInput.type='number'
	$imageSizeYInput.min='1'
	$imageSizeYInput.value='32'
	;($imageSizeXInput.oninput=$imageSizeYInput.oninput=()=>{
		preview.render(Number($imageSizeXInput.value),Number($imageSizeYInput.value))
	})()
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
		)
	)
}
