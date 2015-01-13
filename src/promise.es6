/**
 * @desc «Обещания»
 */

var NativePromise = window.Promise,
	Promise = window.Deferred || NativePromise
;


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
	return _promise(resolve => resolve(value));
}


/**
 * Привести значение к «Обещанию»
 * @param   {*} value
 * @returns {Promise}
 * @private
 */
function _cast(value) {
	/* istanbul ignore next */
	return value && value.then ? value : _resolvePromise(value);
}



//
// Проверяем поддержку методы: done, fail, always
//
var __promise__ = _resolvePromise();

/* istanbul ignore next */
if (NativePromise && !__promise__.always) {
	Promise = function (executor) {
		var promise = new NativePromise(executor);
		promise.__proto__ = this.__proto__;
		return promise;
	};

	Promise.prototype = Object.create(NativePromise.prototype);
	Promise.prototype.constructor = Promise;

	Promise.prototype.then = function (doneFn, failFn) {
		var promise = NativePromise.prototype.then.call(this, doneFn, failFn);
		promise.__proto__ = this.__proto__; // for FireFox
		return promise;
	};

	Promise.prototype.done = function (callback) {
		this.then(callback);
		return this;
	};

	Promise.prototype.fail = function (callback) {
		this['catch'](callback);
		return this;
	};

	Promise.prototype.always = function (callback) {
		this.then(callback, callback);
		return this;
	};

	['all', 'cast', 'reject', 'resolve'].forEach(name => {
		Promise[name] = NativePromise[name];
	});
}
