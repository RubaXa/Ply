//
//       Вспомогательные методы
//

var Promise = Deferred || window.Promise;




/**
 * Функция?
 * @param   {*}  fn
 * @returns {Boolean}
 */
function isFn(fn) {
	return typeof fn === 'function';
}


/**
 * Создать «Обещание»
 * @param   {Function}  executor
 * @returns {Promise}
 * @private
 */
function _promise(executor) {
	/* istanbul ignore if */
	if (Promise) {
		return new Promise(executor);
	} else {
		var dfd = $.Deferred();
		executor(dfd.resolve, dfd.reject);
		return dfd;
	}
}


/**
 * Дождаться разрешения всех «Обещаний»
 * @param   {Promise[]}  iterable
 * @returns {Promise}
 * @private
 */
function _promiseAll(iterable) {
	return Promise
		? /* istanbul ignore next */ Promise.all(iterable)
		: $.when.apply($, iterable);
}


/**
 * Вернуть разрешенное «Обещание»
 * @param   {*} [value]
 * @returns {Promise}
 * @private
 */
function _resolvePromise(value) {
	return _promise((resolve) => resolve(value));
}


/**
 * Привести значение к «Обещанию»
 * @param   {*} value
 * @returns {Promise}
 * @private
 */
function _cast(value) {
	return value && value.then ? value : _resolvePromise(value);
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
