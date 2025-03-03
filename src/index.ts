import Marker from './marker'
import Preview from './preview'
import Output from './output'
import Explanation from './explanation'
import { makeElement, makeDiv, makeLabel, makeLink } from './html'

main()

function main() {
	const preview=new Preview
	const output=new Output
	const explanation=new Explanation
	const $panel=makeDiv('panel')(
		makeControls(preview,output),preview.$widget
	)
	document.body.append(
		$panel,
		output.$widget,
		explanation.$widget
	)
	explanation.render()
}

function makeControls(preview: Preview, output: Output): HTMLElement {
	const $imageSizeXInput=makeNumberInput(32)
	const $imageSizeYInput=makeNumberInput(32)
	const $markerSizeXInput=makeNumberInput(22)
	const $markerSizeYInput=makeNumberInput(32)
	const $strokeWidthInput=makeNumberInput(1)
	const $innerStrokeWidthInput=makeNumberInput(0,0)
	const $strokeColorSelect=makeColorSelect()
	$strokeColorSelect.value='currentColor'
	const $innerStrokeColorSelect=makeColorSelect()
	$innerStrokeColorSelect.value='currentColor'
	const $holeSelect=makeElement('select')()(
		new Option('none'),
		new Option('round')
	)
	const $markerFillSelect=makeColorSelect()
	const $holeFillSelect=makeColorSelect()
	const $markerTintSelect=makeColorSelect()
	const $holeTintSelect=makeColorSelect()
	const $coordinatesCenterSelect=makeElement('select')()(
		new Option('hole'),
		new Option('image')
	)

	const $inputs=[
			$imageSizeXInput,$imageSizeYInput,
			$markerSizeXInput,$markerSizeYInput,
			$strokeWidthInput,$innerStrokeWidthInput,
			$strokeColorSelect,$innerStrokeColorSelect,
			$holeSelect,
			$markerFillSelect,$holeFillSelect,
			$markerTintSelect,$holeTintSelect,
			$coordinatesCenterSelect
	]
	const n=($input:HTMLInputElement)=>Number($input.value)
	const update=()=>{
		$holeFillSelect.disabled=$holeTintSelect.disabled=$holeSelect.value=='none'

		const marker=new Marker(
			$coordinatesCenterSelect.value,
			n($imageSizeXInput),n($imageSizeYInput),
			n($markerSizeXInput),n($markerSizeYInput),
			n($strokeWidthInput),n($innerStrokeWidthInput),
			$strokeColorSelect.value,$innerStrokeColorSelect.value,
			$holeSelect.value,
			$markerFillSelect.value,$holeFillSelect.value,
			$markerTintSelect.value,$holeTintSelect.value
		)
		preview.marker=marker
		output.render(marker)
	}
	for (const $input of $inputs) {
		$input.oninput=update
	}

	const $osmPresetLink=makeLink("OpenStreetMap preset", "https://github.com/openstreetmap/openstreetmap-website")
	$osmPresetLink.onclick=(ev)=>{
		ev.preventDefault()
		$imageSizeXInput.value='25'; $markerSizeXInput.value='25'
		$imageSizeYInput.value='40'; $markerSizeYInput.value='40'
		$strokeWidthInput.value='1'
		$innerStrokeWidthInput.value='1'
		$strokeColorSelect.value='currentColor'
		$innerStrokeColorSelect.value='white'
		$holeSelect.value='round'
		$markerFillSelect.value='white'
		$markerTintSelect.value='currentColor'
		$holeFillSelect.value='white'
		$holeTintSelect.value='none'
		update()
	}

	update()

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
		makeDiv('input-group','double')(
			makeDiv('input-group')(
				makeLabel()(
					`Stroke width `,$strokeWidthInput
				)
			),
			makeDiv('input-group')(
				makeLabel()(
					`Inner stroke width `,$innerStrokeWidthInput
				)
			)
		),
		makeDiv('input-group','double')(
			makeDiv('input-group')(
				makeLabel()(
					`Stroke `,$strokeColorSelect
				)
			),
			makeDiv('input-group')(
				makeLabel()(
					`Inner stroke `,$innerStrokeColorSelect
				)
			)
		),
		makeDiv('input-group','double')(
			makeDiv('input-group')(),
			makeDiv('input-group')(
				makeLabel()(
					`Hole `,$holeSelect
				)
			)
		),
		makeDiv('input-group','double')(
			makeDiv('input-group')(
				makeLabel()(
					`Marker fill `,$markerFillSelect
				)
			),
			makeDiv('input-group')(
				makeLabel()(
					`Hole fill `,$holeFillSelect
				)
			)
		),
		makeDiv('input-group','double')(
			makeDiv('input-group')(
				makeLabel()(
					`Marker tint `,$markerTintSelect
				)
			),
			makeDiv('input-group')(
				makeLabel()(
					`Hole tint `,$holeTintSelect
				)
			)
		),
		makeDiv('input-group')(
			makeLabel()(
				`Coordinates centered at `,$coordinatesCenterSelect
			)
		),
		makeDiv('input-group')(
			$osmPresetLink
		)
	)
}

function makeNumberInput(value: number, minValue=1): HTMLInputElement {
	const $input=makeElement('input')()()
	$input.type='number'
	$input.min=String(minValue)
	$input.value=String(value)
	return $input
}

function makeColorSelect(): HTMLSelectElement {
	return makeElement('select')()(
		new Option('none'),
		new Option('canvas'),
		new Option('currentColor'),
		new Option('white'),
		new Option('black'),
		new Option('red')
	)
}