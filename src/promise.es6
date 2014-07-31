/**
 * @desc «Обещания»
 */


var Promise = window.Deferred || window.Promise;


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



//
// Проверяем поддержку метода always
//
if (!_resolvePromise().always) {
	Promise.prototype.always = function (callback) {
		this.then(callback, callback);
		return this;
	};
}
