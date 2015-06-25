/**
 * @desc Настройки по умолчанию
 */

module.exports = {
	clone: true,
	zIndex: 10000,
	rootTag: 'form',
	baseHtml: true,

	layer: {}, // css
	wrapper: {}, // css

	overlay: {
		opacity: .6,
		backgroundColor: 'rgb(0, 0, 0)'
	},

	flags: {
		closeBtn: true,
		bodyScroll: false,
		closeByEsc: true,
		closeByOverlay: true,
		hideLayerInStack: true,
		visibleOverlayInStack: false
	},

	// Callbacks
	oninit: noop,
	onopen: noop,
	onclose: noop,
	ondestroy: noop,
	onaction: noop
};
