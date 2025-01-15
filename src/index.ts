import Marker from './marker'
import Preview from './preview'
import Output from './output'
import { makeElement, makeDiv, makeLabel, makeLink } from './html'

main()

function main() {
	const preview=new Preview
	const output=new Output
	const $panel=makeDiv('panel')(
		makeControls(preview,output),preview.$widget
	)
	document.body.append(
		$panel,output.$widget
	)
}

function makeControls(preview: Preview, output: Output): HTMLElement {
	const $imageSizeXInput=makeNumberInput(32)
	const $imageSizeYInput=makeNumberInput(32)
	const $markerSizeXInput=makeNumberInput(21)
	const $markerSizeYInput=makeNumberInput(31)
	const $holeSelect=makeElement('select')()(
		new Option('none'),
		new Option('round')
	)
	const $strokeWidthInput=makeNumberInput(1)
	const $fillSelect=makeElement('select')()(
		new Option('none'),
		new Option('inside'),
		new Option('semi-inside')
	)

	const $inputs=[
			$imageSizeXInput,$imageSizeYInput,
			$markerSizeXInput,$markerSizeYInput,
			$strokeWidthInput,
			$holeSelect,$fillSelect
	]
	const n=$input=>Number($input.value)
	const render=()=>{
		const marker=new Marker(
			n($imageSizeXInput),n($imageSizeYInput),
			n($markerSizeXInput),n($markerSizeYInput),
			n($strokeWidthInput),
			$holeSelect.value,$fillSelect.value
		)
		preview.render(marker)
		output.render(marker)
	}
	for (const $input of $inputs) {
		$input.oninput=render
	}

	const $osmPresetLink=makeLink("OpenStreetMap preset", "https://github.com/openstreetmap/openstreetmap-website")
	$osmPresetLink.onclick=(ev)=>{
		ev.preventDefault()
		$imageSizeXInput.value='25'; $markerSizeXInput.value='23'
		$imageSizeYInput.value='40'; $markerSizeYInput.value='38'
		$strokeWidthInput.value='2'
		$fillSelect.value='semi-inside'
		render()
	}

	render()

	return makeDiv('controls')(
		makeDiv('input-group','double')(
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
		),
		makeDiv('input-group','double')(
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
		),
		makeDiv('input-group')(
			makeLabel()(
				`Stroke width `,$strokeWidthInput
			)
		),
		makeDiv('input-group','double')(
			makeDiv('input-group')(
				makeLabel()(
					`Hole `,$holeSelect
				)
			),
			makeDiv('input-group')(
				makeLabel()(
					`Fill `,$fillSelect
				)
			)
		),
		makeDiv('input-group')(
			$osmPresetLink
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
