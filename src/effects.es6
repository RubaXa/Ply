/**
 * @desc Объект для работы с эффектами
 */

module.exports = {
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
				_each(fx['to'], (val, key, target) => {
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

				return _promise((resolve) => {
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
				}).then(() => {
					el.setAttribute('style', oldStyle[0]);
					firstEl && firstEl.setAttribute('style', oldStyle[1]);
				});
			}
		}

		return _resolvePromise();
	}
};
