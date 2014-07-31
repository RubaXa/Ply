/**
 * @desc Что поддерживает браузер
 */


/*global _buildDOM*/
module.exports = (() => {
	var props = {},
		style = document.createElement('div').style,
		names = 'opacity transition transform perspective transformStyle transformOrigin backfaceVisibility'.split(' '),
		prefix = ['Webkit', 'Moz', 'O', 'MS']
	;

	_each(names, (name, i) => {
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
})();
