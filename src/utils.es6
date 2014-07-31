/**
 * @desc Вспомогательные методы
 */


/**
 * Функция?
 * @param   {*}  fn
 * @returns {Boolean}
 */
function isFn(fn) {
	return typeof fn === 'function';
}


/**
 * Object iterator
 * @param  {Object|Array}  obj
 * @param  {Function}      iterator
 * @private
 */
function _each(obj, iterator) {
	if (obj) {
		for (var key in obj) {
			/* istanbul ignore else */
			if (obj.hasOwnProperty(key)) {
				iterator(obj[key], key, obj);
			}
		}
	}
}


/**
 * Глубокое клонирование
 * @param   {*} obj
 * @returns {*}
 * @private
 */
function _deepClone(obj) {
	var result = {};

	_each(obj, (val, key) => {
		if (isFn(val)) {
			result[key] = val;
		}
		else if (val instanceof Object) {
			result[key] = _deepClone(val);
		}
		else {
			result[key] = val;
		}
	});

	return result;
}


/**
 * Перенос свойств одного объект к другому
 * @param   {Object}     dst
 * @param   {...Object}  src
 * @returns {Object}
 * @private
 */
function _extend(dst, ...src) {
	var i = 0, n = src.length;
	for (; i < n; i++) {
		_each(src[i], (val, key) => {
			dst[key] = val;
		});
	}

	return dst;
}
