export function makeElement<K extends keyof HTMLElementTagNameMap>(tag: K): ((...classes: string[])=>(...items: Array<string|HTMLElement>)=>HTMLElementTagNameMap[K]) {
	return (...classes)=>(...items)=>{
			const $element=document.createElement(tag)
			if (classes.length>0) $element.classList.add(...classes)
			$element.append(...items)
			return $element
	}
}

export const makeDiv=makeElement('div')
export const makeLabel=makeElement('label')

export function makeLink(text: string, href: string): HTMLAnchorElement {
	const $link=document.createElement('a')
	$link.textContent=text
	$link.href=href
	return $link
}
