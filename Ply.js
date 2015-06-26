/**
 * @author   RubaXa  <trash@rubaxa.org>
 * @licence  MIT
 * Обязательно нужен JSON и Promise
 */

/*global require, define, window*/
(function(factory ) {
	'use strict';

	/* istanbul ignore next */
	if (typeof define === 'function' && define.amd) {
		define(factory);
	}
	else {
		window['Ply'] = factory();
	}
})(function()  {
	'use strict';


	var gid = 1,
		noop = function()  {},

		env = window,
		document = env.document,
		setTimeout = env.setTimeout,

		lang = /**
 * @desc Языковые константы
 */

{
	ok: 'OK',
	cancel: 'Cancel',
	cross: '✖'
},
		support = /**
 * @desc Что поддерживает браузер
 */


/*global _buildDOM*/
(function()  {
	var props = {},
		style = document.createElement('div').style,
		names = 'opacity transition transform perspective transformStyle transformOrigin backfaceVisibility'.split(' '),
		prefix = ['Webkit', 'Moz', 'O', 'MS']
	;

	_each(names, function(name, i)  {
		props[name] = (name in style) && /* istanbul ignore next */ name;

		/* istanbul ignore else */
		if (!props[name]) {
			for (i = 0; i < 4; i++) {
				var pname = prefix[i] + name.charAt(0).toUpperCase() + name.substr(1);
				/* istanbul ignore else */
				if (props[name] = (pname in style) && pname) {
					break;
				}
			}
		}
	});

	return props;
})(),

		/**
		 * Коды кнопок
		 * @type {Object}
		 */
		keys = /**
 * Коды кнопок
 * @type {Object}
 */
{
	esc: 27
},


		_plyAttr = 'data-ply'
	;


	//
	// $-like object
	//
	var $ = /**
 * @desc $-like adapter
 */
window.jQuery
	|| /* istanbul ignore next */ window.Zepto
	|| /* istanbul ignore next */ window.ender
	|| /* istanbul ignore next */ window.$



	//
	//       Настройки по умолчанию
	//
	var _defaults = /**
 * @desc Настройки по умолчанию
 */

{
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
}


	//
	//       Обещания, Утилиты, CSS, DOM
	//
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
	return _promise(function(resolve ) {return resolve(value)});
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

	['all', 'cast', 'reject', 'resolve'].forEach(function(name ) {
		Promise[name] = NativePromise[name];
	});
}
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

	_each(obj, function(val, key)  {
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
function _extend(dst) {var SLICE$0 = Array.prototype.slice;var src = SLICE$0.call(arguments, 1);
	var i = 0, n = src.length;
	for (; i < n; i++) {
		_each(src[i], function(val, key)  {
			dst[key] = val;
		});
	}

	return dst;
}
	/**
 * @desc Работа с DOM
 */


/**
 * Разбор строки "tag#id.foo.bar"
 * @const {RegExp}
 */
var R_SELECTOR = /^(\w+)?(#\w+)?((?:\.[\w_-]+)*)/i;



/**
 * Выбрать элементы по заданному селектору
 * @param   {String}       selector
 * @param   {HTMLElement}  [ctx]
 * @returns {HTMLElement}
 */
function _querySelector(selector, ctx) {
	try {
		return (ctx || document).querySelector(selector);
	} catch (err) {
		/* istanbul ignore next */
		return $(selector, ctx)[0];
	}
}


/**
 * Найти элементы по имени
 * @param   {HTMLElement}  el
 * @param   {String}       name
 * @returns {NodeList}
 */
function _getElementsByTagName(el, name) {
	return el.getElementsByTagName(name);
}


/**
 * Присоединить элемент
 * @param  {HTMLElement}  parent
 * @param  {HTMLElement}  el
 * @private
 */
function _appendChild(parent, el) {
	try {
		parent && el && parent.appendChild(el);
	} catch (e) {}
}


/**
 * Удалить элемент
 * @param  {HTMLElement}  el
 * @private
 */
function _removeElement(el) {
	/* istanbul ignore else */
	if (el && el.parentNode) {
		el.parentNode.removeChild(el);
	}
}


/**
 * Добавить слуашетеля
 * @param    {HTMLElement}  el
 * @param    {String}   name
 * @param    {Function} fn
 * @private
 */
function _addEvent(el, name, fn) {
	var handle = fn.handle = fn.handle || (function(evt)  {
		/* istanbul ignore if */
		if (!evt.target) {
			evt.target = evt.srcElement || document;
		}

		/* istanbul ignore if */
		if (evt.target.nodeType === 3) {
			evt.target = evt.target.parentNode;
		}

		/* istanbul ignore if */
		if (!evt.preventDefault) {
			evt.preventDefault = function()  {
				evt.returnValue = false;
			};
		}

		/* istanbul ignore if */
		if (!evt.stopPropagation) {
			evt.stopPropagation = function()  {
				evt.cancelBubble = true;
			};
		}

		fn.call(el, evt);
	});

	/* istanbul ignore else */
	if (el.addEventListener) {
		el.addEventListener(name, handle, false);
	} else {
		el.attachEvent('on' + name, handle);
	}
}


/**
 * Удалить слуашетеля
 * @param    {HTMLElement}  el
 * @param    {String}   name
 * @param    {Function} fn
 * @private
 */
function _removeEvent(el, name, fn) {
	var handle = fn.handle;
	if (handle) {
		/* istanbul ignore else */
		if (el.removeEventListener) {
			el.removeEventListener(name, handle, false);
		} else {
			el.detachEvent('on' + name, handle);
		}
	}
}



/**
 * Создание DOM структуры по спецификации
 * @param   {String|Object|HTMLElement}  [spec]
 * @returns {HTMLElement}
 * @private
 */
function _buildDOM(spec) {
	if (spec == null) {
		spec = 'div';
	}

	if (spec.appendChild) {
		return spec;
	}
	else if (spec.skip) {
		return document.createDocumentFragment();
	}

	if (typeof spec === 'string') { // selector
		spec = { tag: spec };
	}

	var el,
		children = spec.children,
		selector = R_SELECTOR.exec(spec.tag || '')
	;

	// Это нам больше не нужно
	delete spec.children;

	// Разбираем селектор
	spec.tag = selector[1] || 'div';
	spec.id = spec.id || (selector[2] || '').substr(1);

	// Собираем className
	selector = (selector[3] || '').split('.');
	selector[0] = (spec.className || '');
	spec.className = selector.join(' ');

	// Создаем элемент, теперь можно
	el  = document.createElement(spec.tag);
	delete spec.tag;

	// Определяем свойсва
	_each(spec, function(value, name)  {
		if (value) {
			if (name === 'css') {
				// Определяем CSS свойства
				_css(el, spec.css);
			}
			else if (name === 'text') {
				(value != null) && _appendChild(el, document.createTextNode(value));
			}
			else if (name === 'html') {
				(value != null) && (el.innerHTML = value);
			}
			else if (name === 'ply') {
				// Ply-аттрибут
				el.setAttribute(_plyAttr, value);
			}
			else if (name in el) {
				try {
					el[name] = value;
				} catch (e) {
					el.setAttribute(name, value);
				}
			}
			else if (/^data-/.test(name)) {
				el.setAttribute(name, value);
			}
		}
	});

	// Детишки
	if (children && children.appendChild) {
		_appendChild(el, children);
	}
	else {
		_each(children, function(spec, selector)  {
			if (spec) {
				if (typeof spec === 'string') {
					spec = { text: spec };
				}
				else if (typeof spec !== 'object') {
					spec = {};
				}

				/* istanbul ignore else */
				if (typeof selector === 'string') {
					spec.tag = spec.tag || selector;
				}

				_appendChild(el, _buildDOM(spec));
			}
		});
	}

	return el;
}


/**
 * Выбрать первый не заполненый элемент
 * @param   {HTMLElement}  parentNode
 * @private
 */
function _autoFocus(parentNode) {
	var items = _getElementsByTagName(parentNode, 'input'),
		i = 0,
		n = items.length,
		el,
		element
	;

	for (; i < n; i++) {
		el = items[i];

		/* istanbul ignore else */
		if (el.type === 'submit') {
			!element && (element = el);
		}
		else if (!/hidden|check|radio/.test(el.type) && el.value == '') {
			element = el;
			break;
		}
	}

	if (!element) {
		element = _getElementsByTagName(parentNode, 'button')[0];
	}

	try { element.focus(); } catch (err) { }
}


/**
 * Предзагрузить все изображения
 * @param   {HTMLElement}  parentNode
 * @returns {Promise}
 * @private
 */
function _preloadImage(parentNode) {
	_loading(true);

	return _promise(function(resolve)  {
		var items = _getElementsByTagName(parentNode, 'img'),
			i = items.length,
			queue = i,
			img,
			complete = function()  {
				/* istanbul ignore else */
				if (--queue <= 0) {
					i = items.length;
					while (i--) {
						img = items[i];
						_removeEvent(img, 'load', complete);
						_removeEvent(img, 'error', complete);
					}
					_loading(false);
					resolve();
				}
			}
		;

		while (i--) {
			img = items[i];
			if (img.complete) {
				queue--;
			} else {
				_addEvent(img, 'load', complete);
				_addEvent(img, 'error', complete);
			}
		}

		!queue && complete();
	});
}
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



	/**
	 * «Загрузка»
	 * @param  {Boolean}  state
	 * @private
	 */
	function _loading(state) {
		var el = _loading.get();

		clearTimeout(_loading.pid);
		if (state) {
			_loading.pid = setTimeout(function()  {
				_appendChild(document.body, el);
			}, 100);
		} else {
			_loading.pid = setTimeout(function()  {
				_removeElement(el);
			}, 100);
		}
	}


	/**
	 * Получить ссылку на элемент loading
	 * @returns {HTMLElement}
	 */
	_loading.get = function()  {
		return _loading.el || (_loading.el = _buildDOM({ tag: '.ply-global-loading', children: { '.ply-loading-spinner': true } }));
	};



	/**
	 * Создать слой с контентом
	 * @param   {HTMLElement} contentEl
	 * @param   {Object}      options
	 * @returns {HTMLElement}
	 * @private
	 */
	function _createLayer(contentEl, options) {
		return _buildDOM({
			css: _extend({
				padding: '20px 20px 40px', // Сницу в два раза больше, так лучше
				display: 'inline-block',
				position: 'relative',
				textAlign: 'left',
				whiteSpace: 'normal',
				verticalAlign: 'middle',
				transform: 'translate3d(0, 0, 0)'
			}, options.wrapper),
			children: options.baseHtml ? [{
				ply: ':layer',
				tag: '.ply-layer',
				className: options.mod,
				css: _extend({
					overflow: 'hidden',
					position: 'relative',
					backfaceVisibility: 'hidden'
				}, options.layer),
				children: [options.flags.closeBtn && {
					ply: ':close',
					tag: '.ply-x',
					text: lang.cross
				}, {
					tag: '.ply-inside',
					children: contentEl
				}]
			}] : contentEl
		});
	}


	/**
	 * Создать затемнение
	 * @param   {Object}   style
	 * @returns {HTMLElement}
	 * @private
	 */
	function _createOverlay(style) {
		return _buildDOM({
			ply: ':overlay',
			tag: '.ply-overlay',
			css: {
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				position: 'fixed'
			},
			children: [{ tag: 'div', css: _extend({ width: '100%', height: '100%' }, style) }]
		});
	}


	/**
	 * Создать ply—объвязку
	 * @param   {Object}   target
	 * @param   {Object}   options
	 * @param   {Boolean}  [onlyLayer]
	 * @returns {Object}
	 * @private
	 */
	function _createPly(target, options, onlyLayer) {
		// Корневой слой
		target.wrapEl = _buildDOM({
			tag: options.rootTag,
			css: { whiteSpace: 'nowrap', zIndex: options.zIndex },
			method: 'post',
			action: '/'
		});


		// Затемнение
		if (!onlyLayer) {
			target.overlayEl = _createOverlay(options.overlay);
			target.overlayBoxEl = target.overlayEl.firstChild;
			_appendChild(target.wrapEl, target.overlayEl);
		}


		// Пустышка для центрирования по вертикали
		var dummyEl = _buildDOM();
		_css(dummyEl, {
			height: '100%',
			display: 'inline-block',
			verticalAlign: 'middle'
		});
		_appendChild(target.wrapEl, dummyEl);


		// Контент
		var el = options.el;
		target.el = (el && el.cloneNode) ? (options.clone ? el.cloneNode(true) : el) : _buildDOM({ html: el || '' });


		// Содержит контент
		target.layerEl = _createLayer(target.el, options);
		target.contentEl = _getContentEl(target.layerEl);
		target.context = new Context(target.layerEl);

		_appendChild(target.wrapEl, target.layerEl);


		// Родительский элемент
		target.bodyEl = options.body && _querySelector(options.body) || document.body;


		target.wrapEl.tabIndex = -1; // для фокуса
		_css(target.wrapEl, {
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			position: 'fixed',
			textAlign: 'center',
			overflow: 'auto',
			outline: 0
		});

		return target;
	}


	/**
	 * Получить ссылку на контент
	 * @param   {HTMLElement}  layerEl
	 * @returns {HTMLElement}
	 * @private
	 */
	function _getContentEl(layerEl) {
		return layerEl.firstChild.lastChild.firstChild;
	}



	//
	//       Основной код
	//




	/**
	 * @class   Ply
	 * @param   {HTMLElement|Object}   el  слой или опции
	 * @param   {Object}               [options]   опции слоя
	 */
	function Ply(el, options) {
		options = (el instanceof Object) ? el : (options || {});
		options.el = options.el || el;


		var _this = this;

		// Локальный идентификатор
		_this.cid = 'c' + gid++;


		// Увеличиваем глобальный zIndex
		_defaults.zIndex++;


		// Опции
		_this.options = options = _extend({}, _defaults, options);


		// Флаги
		options.flags = _extend({}, _defaults.flags, options.flags);


		// Создаем Ply-элементы
		_createPly(_this, options);


		// Установим эффекты
		_this.setEffect(options.effect);


		// Очередь эффектов
		_this.fx = function(executor)  {
			/* jshint boss:true */
			return !(_this.fx.queue = _this.fx.queue.then(executor, executor).then(function()  {
				return _this;
			}));
		};
		_this.fx.queue = _resolvePromise();


		// Клик по затемнению
		_this.on('click', ':overlay', function()  {
			_this.hasFlag('closeByOverlay') && _this.closeBy('overlay');
		});


		// Подписываемся кнопку «отмена» и «крестик»
		_this.on('click', ':close', function(evt, el)  {
			evt.preventDefault();
			_this.closeBy(el.nodeName === 'BUTTON' ? 'cancel' : 'x');
		});


		// Событие инициализации
		_this.options.oninit(this);
	}


	// Методы
	Ply.fn = Ply.prototype = /** @lends Ply.prototype */ {
		constructor: Ply,


		/** @private */
		_activate: function () {
			if (!this.hasFlag('bodyScroll')) {
				var bodyEl = this.bodyEl,
					dummyEl = _buildDOM({
						css: { overflow: 'auto', visibility: 'hidden', height: '5px' },
						children: [{ tag: 'div', css: { height: '100px' } }]
					})
				;

				// @todo: Покрыть тестами
				// Сохраняем оригинальные значения
				this.__overflow = _css(bodyEl, 'overflow');
				this.__paddingRight = _css(bodyEl, 'paddingRight');

				_appendChild(bodyEl, dummyEl);
				_css(bodyEl, {
					overflow: 'hidden',
					paddingRight: (dummyEl.offsetWidth - dummyEl.firstChild.offsetWidth) + 'px'
				});
				_removeElement(dummyEl);
			}

			_addEvent(this.wrapEl, 'submit', this._getHandleEvent('submit'));
		},


		/** @private */
		_deactivate: function () {
			if (!this.hasFlag('bodyScroll')) {
				_css(this.bodyEl, {
					overflow: this.__overflow,
					paddingRight: this.__paddingRight
				});
			}

			_removeEvent(this.layerEl, 'submit', this._getHandleEvent('submit'));
		},


		/**
		 * Получить обработчик события
		 * @param   {String}  name  событие
		 * @returns {*}
		 * @private
		 */
		_getHandleEvent: function (name) {
			var _this = this,
				handleEvent = _this.__handleEvent || (_this.__handleEvent = {})
			;

			if (!handleEvent[name]) {
				handleEvent[name] = function(evt)  {
					_this._handleEvent(name, evt);
				};
			}

			return handleEvent[name];
		},


		/**
		 * Центральный обработчик события
		 * @param   {String}  name
		 * @param   {Event}   evt
		 * @private
		 */
		_handleEvent: function (name, evt) {
			evt.preventDefault();
			this.closeBy(name);
		},


		/**
		 * jQuery выборка из слоя
		 * @param   {String}  selector
		 * @returns {jQuery}
		 */
		$: function (selector) {
			return $(selector, this.layerEl);
		},


		/**
		 * Найти элемент внутри слоя
		 * @param   {String}  selector
		 * @returns {HTMLElement}
		 */
		find: function (selector) {
			return _querySelector(selector, this.layerEl);
		},


		/**
		 * Применить эффект к элементу
		 * @param   {HTMLElement}    el
		 * @param   {String}         name
		 * @param   {String|Object}  [effects]
		 * @returns {Promise}
		 */
		applyEffect: function (el, name, effects) {
			el = this[el] || el;

			if (!el.nodeType) {
				effects = name;
				name = el;
				el = this.layerEl;
			}

			effects = Ply.effects.get(effects || this.effects);
			return Ply.effects.apply.call(effects, el, name);
		},


		/**
		 * Закрыть «по»
		 * @param  {String}  name  прчина закрытия
		 */
		closeBy: function (name) {var this$0 = this;
			var ui = {
					by: name,
					state: name === 'submit',
					data: this.context.toJSON(),
					widget: this,
					context: this.context
				},
				el = this.el,
				result = this.options.onaction(ui)
			;

			if (!this.__lock) {
				this.__lock = true;
				this.el.className += ' ply-loading';

				_cast(result)
					.done(function(state ) {
						if (state !== false) {
							this$0.result = ui;
							this$0.close();
						}
					})
					.always(function()  {
						this$0.__lock = false;
						this$0.el.className = this$0.el.className.replace(/\s?ply-loading/, '');
					})
				;
			}
		},


		/**
		 * Подписаться на ply-событие
		 * @param   {String}    event   событие
		 * @param   {String}    target  ply-selector
		 * @param   {Function}  handle
		 * @returns {Ply}
		 */
		on: function (event, target, handle) {
			var _this = this;

			if (!handle) {
				handle = target;
				target = ':layer';
			}

			handle['_' + target] = function(evt)  {
				var el = evt.target;

				do {
					if (el.nodeType === 1) {
						if (el.getAttribute(_plyAttr) === target) {
							return handle.call(_this, evt, el);
						}
					}
				}
				while ((el !== _this.wrapEl) && (el = el.parentNode));
			};

			_addEvent(_this.wrapEl, event, handle['_' + target]);
			return _this;
		},


		/**
		 * Отписаться от ply-событие
		 * @param   {String}    event   событие
		 * @param   {String}    target  ply-selector
		 * @param   {Function}  handle
		 * @returns {Ply}
		 */
		off: function (event, target, handle) {
			if (!handle) {
				handle = target;
				target = 'layer';
			}

			_removeEvent(this.wrapEl, event, handle['_' + target] || noop);
			return this;
		},


		/**
		 * Проверить наличие флага
		 * @param   {String}  name  имя флага
		 * @returns {Boolean}
		 */
		hasFlag: function (name) {
			return !!this.options.flags[name];
		},


		/**
		 * Установить effect
		 * @param   {String|Object}  name
		 * @returns {Ply}
		 */
		setEffect: function (name) {
			this.effects = Ply.effects.get(name);
			return this;
		},


		/**
		 * Открыть/закрыть слой
		 * @param   {Boolean}  state
		 * @param   {*}  effect
		 * @returns {Promise}
		 * @private
		 */
		_toggleState: function (state, effect) {
			var _this = this,
				mode = state ? 'open' : 'close',
				prevLayer = Ply.stack.last
			;

			/* istanbul ignore else */
			if (_this.visible != state) {
				_this.visible = state;
				_this[state ? '_activate' : '_deactivate']();

				// Добавить или удалить слой из стека
				Ply.stack[state ? 'add' : 'remove'](_this);

				// Очередь эффектов
				_this.fx(function()  {
					return _preloadImage(_this.wrapEl).then(function()  {
						var isFirst = Ply.stack.length === (state ? 1 : 0),
							hideLayer = prevLayer && prevLayer.hasFlag('hideLayerInStack'),
							hasOverlay = isFirst || _this.hasFlag('visibleOverlayInStack');

						if (state) {
							// Убрать «затемнение» если мы не первые в стеке
							!hasOverlay && _removeElement(_this.overlayBoxEl);

							_appendChild(_this.bodyEl, _this.wrapEl);
							_this.wrapEl.focus();
							_autoFocus(_this.layerEl);

							if (hideLayer) {
								// Скрыть слой «под»
								prevLayer.applyEffect('close.layer', effect).then(function()  {
									_removeElement(prevLayer.layerEl);
								});
							}
						} else if (prevLayer = Ply.stack.last) {
							// Слой мог быть скрыт, нужно вернуть его
							_appendChild(prevLayer.wrapEl, prevLayer.layerEl);
							prevLayer.hasFlag('hideLayerInStack') && prevLayer.applyEffect('open.layer', effect).then(function()  {
								_autoFocus(prevLayer.el); // todo: нужен метод layer.autoFocus();
							});
						}

						// Применяем основные эффекты
						return _promiseAll([
							_this.applyEffect(mode + '.layer', effect),
							hasOverlay && _this.applyEffect('overlayEl', mode + '.overlay', effect)
						]).then(function()  {
							if (!state) {
								_removeElement(_this.wrapEl);
								_appendChild(_this.overlayEl, _this.overlayBoxEl);
							}
							// «Событие» open или close
							_this.options['on' + mode](_this);
						});
					});
				});
			}

			return _this.fx.queue;
		},


		/**
		 * Открыть слой
		 * @param   {*}  [effect]
		 * @returns {Promise}
		 */
		open: function (effect) {
			this.result = null;
			return this._toggleState(true, effect);
		},


		/**
		 * Закрыть слой
		 * @param   {*}  [effect]
		 * @returns {Promise}
		 */
		close: function (effect) {
			return this._toggleState(false, effect);
		},


		/**
		 * @param   {HTMLElement}  closeEl
		 * @param   {HTMLElement}  openEl
		 * @param   {Object}    effects
		 * @param   {Function}  prepare
		 * @param   {Function}  [complete]
		 * @returns {*}
		 * @private
		 */
		_swap: function (closeEl, openEl, effects, prepare, complete) {
			var _this = this;

			if (_this.visible) {
				_this.fx(function()  {
					return _preloadImage(openEl).then(function()  {
						prepare();

						return _promiseAll([
							_this.applyEffect(closeEl, 'close.layer', effects),
							_this.applyEffect(openEl, 'open.layer', effects)
						]).then(function()  {
							_removeElement(closeEl);
							complete();
							_this.wrapEl.focus();
							_autoFocus(openEl);
						});
					});
				});
			} else {
				complete();
			}

			return _this.fx.queue;
		},


		/**
		 * Заменить слой
		 * @param   {Object}  options
		 * @param   {Object}  [effect]  эффект замены
		 * @returns {Promise}
		 */
		swap: function (options, effect) {
			options = _extend({}, this.options, options);

			var _this = this,
				ply = _createPly({}, options, true),
				effects = (effect || options.effect) ? Ply.effects.get(effect || options.effect) : _this.effects,
				closeEl = _this.layerEl,
				openEl = ply.layerEl
			;

			return _this._swap(closeEl, openEl, effects,
				function()  {
					_appendChild(_this.bodyEl, _this.wrapEl);
					_appendChild(_this.bodyEl, ply.wrapEl);
				},
				function()  {
					_removeElement(ply.wrapEl);
					_appendChild(_this.wrapEl, openEl);

					_this.el = ply.el;
					_this.layerEl = openEl;
					_this.contentEl = _getContentEl(openEl);
					_this.context.el = openEl;
				})
			;
		},


		/**
		 * Заменить внутренности слоя
		 * @param   {Object}  options
		 * @param   {Object}  [effect]  эффект замены
		 * @returns {Promise}
		 */
		innerSwap: function (options, effect) {
			options = _extend({}, this.options, options);

			var _this = this,
				ply = _createPly({}, options, true),
				effects = (effect || options.effect) ? Ply.effects.get(effect || options.effect) : _this.effects,

				inEl = _querySelector('.ply-inside', ply.layerEl),
				outEl = _querySelector('.ply-inside', _this.layerEl)
			;

			return _this._swap(outEl, inEl, effects, function()  {
				_css(outEl, { width: outEl.offsetWidth + 'px', position: 'absolute' });
				_appendChild(outEl.parentNode, inEl);
			}, noop);
		},


		/**
		 * Уничтожить слой
		 */
		destroy: function () {
			_removeElement(this.wrapEl);

			this._deactivate();
			Ply.stack.remove(this);

			this.visible = false;
			this.options.ondestroy(this);
		}
	};


	//
	// Ply-стек
	//
	/**
 * @desc Работы со стеком
 */

var array_core = [],
	array_push = array_core.push,
	array_splice = array_core.splice
;


Ply.stack = {
	_idx: {},


	/**
	 * Последний Ply в стеке
	 * @type {Ply}
	 */
	last: null,


	/**
	 * Длинна стека
	 * @type {Number}
	 */
	length: 0,


	/**
	 * Удаить последний ply-слой из стека
	 * @param  {Event}  evt
	 * @private
	 */
	_pop: function (evt) {
		var layer = Ply.stack.last;

		if (evt.keyCode === keys.esc && layer.hasFlag('closeByEsc')) {
			layer.closeBy('esc');
		}
	},


	/**
	 * Добавить ply в стек
	 * @param  {Ply}  layer
	 */
	add: function (layer) {
		var idx = array_push.call(this, layer);

		this.last = layer;
		this._idx[layer.cid] = idx - 1;

		if (idx === 1) {
			_addEvent(document, 'keyup', this._pop);
		}
	},


	/**
	 * Удалить ply из стека
	 * @param  {Ply}  layer
	 */
	remove: function (layer) {
		var idx = this._idx[layer.cid];

		if (idx >= 0) {
			array_splice.call(this, idx, 1);

			delete this._idx[layer.cid];
			this.last = this[this.length-1];

			if (!this.last) {
				_removeEvent(document, 'keyup', this._pop);
			}
		}
	}
};



	//
	// Эффекты
	//
	Ply.effects = /**
 * @desc Объект для работы с эффектами
 */

{
	// Установки по умолчанию
	defaults: {
		duration: 300,

		open: {
			layer: null,
			overlay: null
		},

		close: {
			layer: null,
			overlay: null
		}
	},


	/**
	 * Настройти эффекты по умолчанию
	 * @static
	 * @param  {Object}  options
	 */
	setup: function (options) {
		this.defaults = this.get(options);
	},


	set: function (desc) {
		_extend(this, desc);
	},


	/**
	 * Получить опции на основе переданных и по умолчанию
	 * @static
	 * @param   {Object}  options  опции
	 * @returns {Object}
	 */
	get: function (options) {
		var defaults = _deepClone(this.defaults);

		// Функция разбора выражения `name:duration[args]`
		function parseKey(key) {
			var match = /^([\w_-]+)(?::(\d+%?))?(\[[^\]]+\])?/.exec(key) || [];
			return {
				name: match[1] || key,
				duration: match[2] || null,
				args: JSON.parse(match[3] || 'null') || {}
			};
		}


		function toObj(obj, key, def) {
			var fx = parseKey(key),
				val = (obj[fx.name] || def || {}),
				duration = (fx.duration || val.duration || obj.duration || options.duration)
			;

			if (typeof val === 'string') {
				val = parseKey(val);
				delete val.args;
			}

			if (/%/.test(val.duration)) {
				val.duration = parseInt(val.duration, 10) / 100 * duration;
			}

			val.duration = (val.duration || duration) | 0;

			return val;
		}


		if (typeof options === 'string') {
			var fx = parseKey(options);
			options = _deepClone(this[fx.name] || { open: {}, close: {} });
			options.duration = fx.duration || options.duration;
			options.open.args = fx.args[0];
			options.close.args = fx.args[1];
		}
		else if (options instanceof Array) {
			var openFx = parseKey(options[0]),
				closeFx = parseKey(options[1]),
				open = this[openFx.name],
				close = this[closeFx.name]
			;

			options = {
				open: _deepClone(open && open.open || { layer: options[0], overlay: options[0] }),
				close: _deepClone(close && close.close || { layer: options[1], overlay: options[1] })
			};

			options.open.args = openFx.args[0];
			options.close.args = closeFx.args[0];
		}
		else if (!(options instanceof Object)) {
			options = {};
		}

		options.duration = (options.duration || defaults.duration) | 0;

		for (var key in {open: 0, close: 0}) {
			var val = options[key] || defaults[key] || {};
			if (typeof val === 'string') {
				// если это строка, то только layer
				val = { layer: val };
			}
			val.layer = toObj(val, 'layer', defaults[key].layer);
			val.overlay = toObj(val, 'overlay', defaults[key].overlay);

			if(val.args === void 0){
				// clean
				delete val.args;
			}

			options[key] = val;
		}

		return options;
	},


	/**
	 * Применить эффекты
	 * @static
	 * @param   {HTMLElement}  el    элемент, к которому нужно применить эффект
	 * @param   {String}       name  название эффекта
	 * @returns {Promise|undefined}
	 */
	apply: function (el, name) {
		name = name.split('.');

		var effects = this[name[0]], // эффекты open/close
			firstEl = el.firstChild,
			oldStyle = [el.getAttribute('style'), firstEl && firstEl.getAttribute('style')],
			fx,
			effect
		;


		if (support.transition && effects && (effect = effects[name[1]]) && (fx = Ply.effects[effect.name])) {
			if (fx['to'] || fx['from']) {
				// Клонируем
				fx = _deepClone(fx);

				// Выключаем анимацию
				_css(el, 'transition', 'none');
				_css(firstEl, 'transition', 'none');

				// Определяем текущее css-значения
				_each(fx['to'], function(val, key, target)  {
					if (val === '&') {
						target[key] = _css(el, key);
					}
				});

				// Выставляем initied значения
				if (isFn(fx['from'])) {
					fx['from'](el, effects.args);
				} else if (fx['from']) {
					_css(el, fx['from']);
				}

				return _promise(function(resolve)  {
					// Принудительный repaint/reflow
					fx.width = el.offsetWidth;

					// Включаем анимацию
					_css(el, 'transition', 'all ' + effect.duration + 'ms');
					_css(firstEl, 'transition', 'all ' + effect.duration + 'ms');

					// Изменяем css
					if (isFn(fx['to'])) {
						fx['to'](el, effects.args);
					}
					else {
						_css(el, fx['to']);
					}

					// Ждем завершения анимации
					setTimeout(resolve, effect.duration);
				}).then(function()  {
					el.setAttribute('style', oldStyle[0]);
					firstEl && firstEl.setAttribute('style', oldStyle[1]);
				});
			}
		}

		return _resolvePromise();
	}
}
	Ply.effects.set(/**
 * @desc Предустановленные эффекты
 */

{
	//
	// Комбинированный эффекты
	//

	'fade': {
		open:  { layer: 'fade-in:80%', overlay: 'fade-in:100%' },
		close: { layer: 'fade-out:60%', overlay: 'fade-out:60%' }
	},

	'scale': {
		open:  { layer: 'scale-in', overlay: 'fade-in' },
		close: { layer: 'scale-out', overlay: 'fade-out' }
	},

	'fall': {
		open:  { layer: 'fall-in', overlay: 'fade-in' },
		close: { layer: 'fall-out', overlay: 'fade-out' }
	},

	'slide': {
		open:  { layer: 'slide-in', overlay: 'fade-in' },
		close: { layer: 'slide-out', overlay: 'fade-out' }
	},

	'3d-flip': {
		open:  { layer: '3d-flip-in', overlay: 'fade-in' },
		close: { layer: '3d-flip-out', overlay: 'fade-out' }
	},

	'3d-sign': {
		open:  { layer: '3d-sign-in', overlay: 'fade-in' },
		close: { layer: '3d-sign-out', overlay: 'fade-out' }
	},

	'inner': {
		open:  { layer: 'inner-in' },
		close: { layer: 'inner-out' }
	},


	//
	// Описание эффекта
	//

	'fade-in': {
		'from': { opacity: 0 },
		'to':   { opacity: '&' }
	},

	'fade-out': {
		'to': { opacity: 0 }
	},

	'slide-in': {
		'from': { opacity: 0, transform: 'translateY(20%)' },
		'to':   { opacity: '&', transform: 'translateY(0)' }
	},

	'slide-out': {
		'to': { opacity: 0, transform: 'translateY(20%)' }
	},

	'fall-in': {
		'from': { opacity: 0, transform: 'scale(1.3)' },
		'to':   { opacity: '&', transform: 'scale(1)' }
	},

	'fall-out': {
		'to': { opacity: 0, transform: 'scale(1.3)' }
	},

	'scale-in': {
		'from': { opacity: 0, transform: 'scale(0.7)' },
		'to':   { opacity: '&', transform: 'scale(1)' }
	},

	'scale-out': {
		'to': { opacity: 0, 'transform': 'scale(0.7)' }
	},

	'rotate3d': function(el, opacity, axis, deg, origin)  {
		_css(el, { perspective: '1300px' });
		_css(el.firstChild, {
			opacity: opacity,
			transform: 'rotate' + axis + '(' + deg + 'deg)',
			transformStyle: 'preserve-3d',
			transformOrigin: origin ? '50% 0' : '50%'
		});
	},

	'3d-sign-in': {
		'from': function(el)  {
			Ply.effects.rotate3d(el, 0, 'X', -60, '50% 0');
		},
		'to': function(el)  {
			_css(el.firstChild, { opacity: 1, transform: 'rotateX(0)' });
		}
	},

	'3d-sign-out': {
		'from': function(el)  {
			Ply.effects.rotate3d(el, 1, 'X', 0, '50% 0');
		},
		'to': function(el)  {
			_css(el.firstChild, { opacity: 0, transform: 'rotateX(-60deg)' });
		}
	},

	'3d-flip-in': {
		'from': function(el, deg)  {
			Ply.effects.rotate3d(el, 0, 'Y', deg || -70);
		},
		'to': function(el)  {
			_css(el.firstChild, { opacity: 1, transform: 'rotateY(0)' });
		}
	},

	'3d-flip-out': {
		'from': function(el)  {
			Ply.effects.rotate3d(el, 1, 'Y', 0);
		},
		'to': function(el, deg)  {
			_css(el.firstChild, { opacity: 0, transform: 'rotateY(' + (deg || 70) + 'deg)' });
		}
	},

	'inner-in': {
		'from': function(el)  { _css(el, 'transform', 'translateX(100%)'); },
		'to': function(el)  { _css(el, 'transform', 'translateX(0%)'); }
	},

	'inner-out': {
		'from': function(el)  { _css(el, 'transform', 'translateX(0%)'); },
		'to': function(el)  { _css(el, 'transform', 'translateX(-100%)'); }
	}
});



	//
	// Ply.Context
	//
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


	//
	// Ply.ui
	//
	/**
 * @desc Диалоги
 */

/*global Ply */

	'use strict';

	function _isNode(el) {
		return el && el.appendChild;
	}

	function _toBlock(block, name) {
		if (block == null) {
			return { skip: true };
		}

		if (typeof block === 'string') {
			block = { text: block };
		}

		if (typeof block === 'object') {
			block.name = block.name || name;
		}

		return block;
	}



	/**
	 * Управление рендером UI
	 * @param  {String}  name
	 * @param  {Object}  [data]
	 * @param  {String}  [path]
	 * @returns {HTMLElement}
	 */
	function ui(name, data, path) {
		var fn = ui[name], el;

		if (!fn) {
			name = name.split(/\s+/).slice(0, -1).join(' ');
			fn = data && (
					   ui[name + ' [name=' + data.name + ']']
					|| ui[name + ' [type=' + data.type + ']']
				)
				|| ui[name + ' *']
				|| ui[':default'];
		}

		el = _buildDOM(fn(data, path));
		if (data && data.name) {
			el.setAttribute(_plyAttr + '-name', data.name);
		}
		el.className += ' ply-ui';

		return el;
	}


	/**
	 * Назначение визуализатор
	 * @param {String}    name  имя фабрики
	 * @param {Function}  renderer
	 * @param {Boolean}  [simpleMode]
	 */
	ui.factory = function (name, renderer, simpleMode) {
		ui[name.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ')] = function (data, path) {
			var fragment = document.createDocumentFragment(), result;

			if ((data != null) || name === ':root') {
				data = simpleMode ? data : _toBlock(data);

				_each(simpleMode ? data : data.children, function (block, key) {
					var abs = ((path || name) + ' ' + key).replace(/^:\w+\s+/, ''),
						el = _isNode(block) ? block : ui(abs, _toBlock(block, key), abs)
					;

					_appendChild(fragment, el);
				});

				if (!simpleMode) {
					delete data.children;
				}

				result = renderer(data, fragment);

				/* istanbul ignore else */
				if (!_isNode(result)) {
					_extend(result, data);
				}

				return result;
			}

			return fragment;
		};
	};


	// Элемент по умолчанию
	ui.factory(':default', function(data, children)  {
		data.children = children;
		return data;
	});


	// Ply-слой - корневой элемент
	ui.factory(':root', function (data) {
		return {
			tag: '.ply-form',
			className: data.mod,
			children: [
				ui(':header', data.header),
				ui(':content', data.content),
				data.ctrls && ui(':default', {
					tag: 'div.ply-footer',
					children: data.ctrls
				})
			]
		};
	});


	// «Заголовк» слоя
	ui.factory(':header', function (data, children) {
		return { tag: '.ply-header', text: data.text, children: children };
	});


	// «Содержимое» слоя
	ui.factory(':content', function (data, children) {
		return { tag: '.ply-content', children: children };
	}, true);


	// Кнопка «ОК»
	ui.factory('ok', function (data) {
		return {
			ply: ':ok',
			tag: 'button.ply-ctrl.ply-ok',
			text: data === true ? lang.ok : data
		};
	});


	// Кнопка «Отмена»
	ui.factory('cancel', function (data) {
		return {
			ply: ':close',
			tag: 'button.ply-ctrl.ply-cancel',
			type: 'reset',
			text: data === true ? lang.cancel : data
		};
	});


	/**
	 * Фабрика слоев
	 * @param {String}   name
	 * @param {Function} renderer
	 */
	function factory(name, renderer) {
		factory['_' + name] = renderer;

		factory[name] = function(options, data)  {
			return _promise(function(resolve, reject)  {
				renderer(options, data, resolve, reject);
			}).then(function(el)  {
				/* istanbul ignore else */
				if (!_isNode(el)) {
					el = ui(':root', el);
				}

				return el;
			});
		};
	}


	/**
	 * Использовать фабрику
	 * @param {String}   name
	 * @param {Object}   options
	 * @param {Object}   data
	 * @param {Function} resolve
	 * @param {Function} [reject]
	 */
	factory.use = function(name, options, data, resolve, reject)  {
		factory['_' + name](options, data, resolve, reject);
	};


	/**
	 * Абстрактный диалог
	 * @param   {String}  mod  модификатор
	 * @param   {Object}  options
	 * @param   {Object}  data
	 * @param   {Object}  defaults
	 * @returns {Object}
	 * @private
	 */
	function _dialogFactory(mod, options, data, defaults) {
		options.mod = mod;
		options.effect = options.effect || 'slide';
		options.flags = _extend({ closeBtn: false }, options.flags);

		return {
			header: data.title,
			content: data.form
				? { 'dialog-form': { children: data.form } }
				: { el: data.text || data },
			ctrls: {
				ok: data.ok || defaults.ok,
				cancel: data.cancel === false ? null : (data.cancel || defaults.cancel)
			}
		};
	}


	// Фабрика по умолчанию
	factory('default', function(options, data, resolve)  {
		resolve(data || /* istanbul ignore next */ {});
	});


	// Базовый жиалог
	factory('base', function(options, data, resolve)  {
		resolve(_dialogFactory('base', options, data));
	});


	// Диалог: «Предупреждение»
	factory('alert', function(options, data, resolve)  {
		resolve(_dialogFactory('alert', options, data, { ok: true }));
	});


	// Диалог: «Подтверждение»
	factory('confirm', function(options, data, resolve)  {
		resolve(_dialogFactory('confirm', options, data, {
			ok: true,
			cancel: true
		}));
	});


	// Диалог: «Запросить данные»
	factory('prompt', function(options, data, resolve)  {
		resolve(_dialogFactory('prompt', options, data, {
			ok: true,
			cancel: true
		}));
	});


	// Элемент формы
	ui.factory('dialog-form *', function(data)  {
		return {
			tag: 'input.ply-input',
			type: data.type || 'text',
			name: data.name,
			value: data.value,
			required: true,
			placeholder: data.hint || data.text
		};
	});


	/**
	 * Создать Ply-слой на основе фабрики
	 * @param   {String}  name       название фабрики
	 * @param   {Object}  [options]  опции
	 * @param   {Object}  [data]     данные для фабрики
	 * @returns {Promise}
	 */
	Ply.create = function(name, options, data)  {
		if (_isNode(name)) {
			return _resolvePromise(new Ply(_extend(options || {}, { el: name })));
		}

		if (!data) {
			data = options;
			options = {};
		}

		var renderer = (factory[name] || factory['default']);
		return renderer(options, data).then(function(el)  {
			return new Ply(_extend(options, { el: el }));
		});
	};


	/**
	 * Открыть Ply-слой
	 * @param   {String}  name
	 * @param   {Object}  [options]
	 * @param   {Object}  [data]
	 * @returns {Promise}
	 */
	Ply.open = function(name, options, data)  {
		return Ply.create(name, options, data).then(function(layer)  {
			return layer.open();
		});
	};


	/**
	 * Создать диалог или систему диалогов
	 * @param   {String|Object}  name
	 * @param   {Object}         [options]
	 * @param   {Object}         [data]
	 * @returns {Promise}
	 */
	Ply.dialog = function(name, options, data)  {
		if ((name instanceof Object) && !_isNode(name)) {
			options = options || /* istanbul ignore next */ {};

			return _promise(function(resolve, reject)  {
				var first = options.initState,
					current,
					rootLayer,
					interactive,
					stack = name,
					dialogs = {},

					_progress = function(ui, layer)  {
						(options.progress || /* istanbul ignore next */ noop)(_extend({
							name:		current.$name,
							index:		current.$index,
							length:		length,
							stack:		stack,
							current:	current,
							widget:		layer
						}, ui), dialogs);
					},

					changeLayer = function(spec, effect, callback)  {
						// Клонирование данных
						var data = JSON.parse(JSON.stringify(spec.data));

						current = spec; // текущий диалог
						interactive = true; // идет анимация
						(spec.prepare || noop)(data, dialogs);

						Ply.create(spec.ui || 'alert', spec.options || {}, data).then(function(layer)  {
							var promise;

							if (rootLayer) {
								promise = rootLayer[/^inner/.test(effect) ? 'innerSwap' : 'swap'](layer, effect);
							} else {
								rootLayer = layer;
								promise = rootLayer.open();
							}

							promise.then(function()  {
								dialogs[spec.$name].el = rootLayer.layerEl;
								interactive = false;
							});

							callback(rootLayer);
						});
					}
				;


				var length = 0;
				_each(stack, function(spec, key)  {
					first = first || key;
					spec.effects = spec.effects || {};
					spec.$name   = key;
					spec.$index  = length++;
					dialogs[key] = new Ply.Context();
				});
				stack.$length = length;


				changeLayer(stack[first], null, function(layer)  {
					_progress({}, layer);

					//noinspection FunctionWithInconsistentReturnsJS
					rootLayer.options.onaction = function(ui)  {
						if (interactive) {
							return false;
						}

						var isNext = ui.state || (current.back === 'next'),
							swap = stack[current[isNext ? 'next' : 'back']]
						;

//						console.log(current.$name, stack[current[isNext ? 'next' : 'back']]);

						if (swap) {
							changeLayer(swap, current[isNext ? 'nextEffect' : 'backEffect'], function(layer)  {
								_progress(ui, layer);
							});

							return false;
						} else {
							(ui.state ? resolve : /* istanbul ignore next */ reject)(ui, dialogs);
						}
					};
				});
			});
		}
		else {
			if (!data && !_isNode(name)) {
				data = options || {};
				options = {};
			}

			return Ply.open(name, options, data).then(function(layer)  {
				return _promise(function(resolve, reject)  {
					layer.options.onclose = function()  {
						(layer.result.state ? resolve : reject)(layer.result);
					};
				});
			});
		}
	};


	// Export
	Ply.ui = ui;
	Ply.factory = factory;



	//
	// Export
	//
	Ply.lang = lang;
	Ply.css = _css;
	Ply.cssHooks = _cssHooks;

	Ply.keys = keys;
	Ply.noop = noop;
	Ply.each = _each;
	Ply.extend = _extend;
	Ply.promise = _promise;
	Ply.Promise = Promise;
	Ply.support = support;
	Ply.defaults = _defaults;
	Ply.attrName = _plyAttr;
	Ply.Context = Context;

	Ply.dom = {
		build: _buildDOM,
		append: _appendChild,
		remove: _removeElement,
		addEvent: _addEvent,
		removeEvent: _removeEvent
	};


	Ply.version = '0.6.1';

	return Ply;
});