/**
 * @desc Функция для работы с style
 */

/*global support, document*/


/**
 * Хуки для css
 * @type {Object}
 */
var _cssHooks = {
	opacity: !support.opacity && function (style, value) {
		style.zoom = 1;
		style.filter = 'alpha(opacity=' + (value * 100) + ')';
	}
};



/**
 * Установка или получение css свойства
 * @param   {HTMLElement}    el
 * @param   {Object|String}  prop
 * @param   {String}         [val]
 * @returns {*}
 * @private
 */
function _css(el, prop, val) {
	if (el && el.style && prop) {
		if (prop instanceof Object) {
			for (var name in prop) {
				_css(el, name, prop[name]);
			}
		}
		else if (val === void 0) {
			/* istanbul ignore else */
			if (document.defaultView && document.defaultView.getComputedStyle) {
				val = document.defaultView.getComputedStyle(el, '');
			}
			else if (el.currentStyle) {
				val = el.currentStyle;
			}

			return prop === void 0 ? val : val[prop];
		} else if (_cssHooks[prop]) {
			_cssHooks[prop](el.style, val);
		} else {
			el.style[support[prop] || prop] = val;
		}
	}
}
