/**
 * @author   RubaXa  <trash@rubaxa.org>
 * @licence  MIT
 * Обязательно нужен JSON и Promise
 */

/*global require, define, window*/
(factory => {
	'use strict';

	/* istanbul ignore next */
	if (typeof define === 'function' && define.amd) {
		define(factory);
	}
	else {
		window['Ply'] = factory();
	}
})(() => {
	'use strict';


	var gid = 1,
		noop = () => {},

		env = window,
		document = env.document,
		setTimeout = env.setTimeout,

		lang = require('lang'),
		support = require('support'),

		/**
		 * Коды кнопок
		 * @type {Object}
		 */
		keys = require('keys'),


		_plyAttr = 'data-ply'
	;


	//
	// $-like object
	//
	var $ = require('jquery');



	//
	//       Настройки по умолчанию
	//
	var _defaults = require('defaults');


	//
	//       Обещания, Утилиты, CSS, DOM
	//
	require('promise');
	require('utils');
	require('dom');
	require('css');



	/**
	 * «Загрузка»
	 * @param  {Boolean}  state
	 * @private
	 */
	function _loading(state) {
		var el = _loading.get();

		clearTimeout(_loading.pid);
		if (state) {
			_loading.pid = setTimeout(() => {
				_appendChild(document.body, el);
			}, 100);
		} else {
			_loading.pid = setTimeout(() => {
				_removeElement(el);
			}, 100);
		}
	}


	/**
	 * Получить ссылку на элемент loading
	 * @returns {HTMLElement}
	 */
	_loading.get = () => {
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
		_this.fx = (executor) => {
			/* jshint boss:true */
			return !(_this.fx.queue = _this.fx.queue.then(executor, executor).then(() => {
				return _this;
			}));
		};
		_this.fx.queue = _resolvePromise();


		// Клик по затемнению
		_this.on('click', ':overlay', () => {
			_this.hasFlag('closeByOverlay') && _this.closeBy('overlay');
		});


		// Подписываемся кнопку «отмена» и «крестик»
		_this.on('click', ':close', (evt, el) => {
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
				handleEvent[name] = (evt) => {
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
		closeBy: function (name) {
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
					.done(state => {
						if (state !== false) {
							this.result = ui;
							this.close();
						}
					})
					.always(() => {
						this.__lock = false;
						this.el.className = this.el.className.replace(/\s?ply-loading/, '');
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

			handle['_' + target] = (evt) => {
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
				_this.fx(() => {
					return _preloadImage(_this.wrapEl).then(() => {
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
								prevLayer.applyEffect('close.layer', effect).then(() => {
									_removeElement(prevLayer.layerEl);
								});
							}
						} else if (prevLayer = Ply.stack.last) {
							// Слой мог быть скрыт, нужно вернуть его
							_appendChild(prevLayer.wrapEl, prevLayer.layerEl);
							prevLayer.hasFlag('hideLayerInStack') && prevLayer.applyEffect('open.layer', effect).then(() => {
								_autoFocus(prevLayer.el); // todo: нужен метод layer.autoFocus();
							});
						}

						// Применяем основные эффекты
						return _promiseAll([
							_this.applyEffect(mode + '.layer', effect),
							hasOverlay && _this.applyEffect('overlayEl', mode + '.overlay', effect)
						]).then(() => {
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
				_this.fx(() => {
					return _preloadImage(openEl).then(() => {
						prepare();

						return _promiseAll([
							_this.applyEffect(closeEl, 'close.layer', effects),
							_this.applyEffect(openEl, 'open.layer', effects)
						]).then(() => {
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
				() => {
					_appendChild(_this.bodyEl, _this.wrapEl);
					_appendChild(_this.bodyEl, ply.wrapEl);
				},
				() => {
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

			return _this._swap(outEl, inEl, effects, () => {
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
	require('stack');



	//
	// Эффекты
	//
	Ply.effects = require('effects');
	Ply.effects.set(require('effects.preset'));



	//
	// Ply.Context
	//
	require('Context');


	//
	// Ply.ui
	//
	require('ui');


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
