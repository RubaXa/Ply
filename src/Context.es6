/**
 * @desc Ply-контекст
 */


/**
 * @class  Ply.Context
 * @param  {HTMLElement}  el
 */
function Context(el) {
	/**
	 * Корневой элемент
	 * @type {HTMLElement}
	 */
	this.el = el;
}

Context.fn = Context.prototype = /** @lends Ply.Context */{
	constructor: Context,


	/**
	 * Получить элемент по имени
	 * @param   {String}  name
	 * @returns {HTMLElement|undefined}
	 */
	getEl: function (name) {
		if (this.el) {
			return _querySelector('[' + _plyAttr + '-name="' + name + '"]', this.el);
		}
	},


	/**
	 * Получить или установить значение по имени
	 * @param   {String}  name
	 * @param   {String}  [value]
	 * @returns {String}
	 */
	val: function (name, value) {
		var el = typeof name === 'string' ? this.getEl(name) : name;

		if (el && (el.value == null)) {
			el = _getElementsByTagName(el, 'input')[0]
			  || _getElementsByTagName(el, 'textarea')[0]
			  || _getElementsByTagName(el, 'select')[0]
			;
		}

		if (el && value != null) {
			el.value = value;
		}

		return el && el.value || "";
	},


	/**
	 * Получить JSON
	 * @returns {Object}
	 */
	toJSON: function () {
		var items = this.el.querySelectorAll('[' + _plyAttr + '-name]'),
			json = {},
			el,
			i = items.length
		;
		while (i--) {
			el = items[i];
			json[el.getAttribute(_plyAttr + '-name')] = this.val(el);
		}
		return json;
	}
};
