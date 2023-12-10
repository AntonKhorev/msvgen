import Marker from './marker'
import { makeElement } from './html'

export default class Output {
	private $code=makeElement('code')()()
	$widget=makeElement('details')()(
		makeElement('summary')()(`SVG`),
		this.$code
	)

	render(marker: Marker): void {
		this.$code.textContent=marker.svg
	}
}
