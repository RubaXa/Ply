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
	var handle = fn.handle = fn.handle || ((evt) => {
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
			evt.preventDefault = () => {
				evt.returnValue = false;
			};
		}

		/* istanbul ignore if */
		if (!evt.stopPropagation) {
			evt.stopPropagation = () => {
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
	_each(spec, (value, name) => {
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
		_each(children, (spec, selector) => {
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

	return _promise((resolve) => {
		var items = _getElementsByTagName(parentNode, 'img'),
			i = items.length,
			queue = i,
			img,
			complete = () => {
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
