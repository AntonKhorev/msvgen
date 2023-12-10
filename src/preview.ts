import Marker from './marker'
import { makeDiv } from './html'

export default class Preview {
	$widget=makeDiv('preview')()

	render(marker: Marker): void {
		this.$widget.innerHTML=marker.svg
	}
}
