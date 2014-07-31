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
