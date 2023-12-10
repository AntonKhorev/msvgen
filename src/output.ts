import Marker from './marker'
import { makeElement } from './html'

export default class Output {
	private $code=makeElement('code')()()
	$widget=makeElement('details')()(
		makeElement('summary')()(`SVG`),
		makeElement('pre')()(this.$code)
	)

	render(marker: Marker): void {
		this.$code.textContent=marker.svg
	}
}
