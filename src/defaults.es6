/**
 * @desc Настройки по умолчанию
 */

module.exports = {
	zIndex: 10000,

	layer: {}, // css

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

	baseHtml: true,

	// Callback's
	oninit: noop,
	onopen: noop,
	onclose: noop,
	ondestroy: noop,
	onaction: noop
};
