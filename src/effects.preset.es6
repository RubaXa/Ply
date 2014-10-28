/**
 * @desc Предустановленные эффекты
 */

module.exports = {
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

	'rotate3d': (el, opacity, axis, deg, origin) => {
		_css(el, { perspective: '1300px' });
		_css(el.firstChild, {
			opacity: opacity,
			transform: 'rotate' + axis + '(' + deg + 'deg)',
			transformStyle: 'preserve-3d',
			transformOrigin: origin ? '50% 0' : '50%'
		});
	},

	'3d-sign-in': {
		'from': (el) => {
			Ply.effects.rotate3d(el, 0, 'X', -60, '50% 0');
		},
		'to': (el) => {
			_css(el.firstChild, { opacity: 1, transform: 'rotateX(0)' });
		}
	},

	'3d-sign-out': {
		'from': (el) => {
			Ply.effects.rotate3d(el, 1, 'X', 0, '50% 0');
		},
		'to': (el) => {
			_css(el.firstChild, { opacity: 0, transform: 'rotateX(-60deg)' });
		}
	},

	'3d-flip-in': {
		'from': (el, deg) => {
			Ply.effects.rotate3d(el, 0, 'Y', deg || -70);
		},
		'to': (el) => {
			_css(el.firstChild, { opacity: 1, transform: 'rotateY(0)' });
		}
	},

	'3d-flip-out': {
		'from': (el) => {
			Ply.effects.rotate3d(el, 1, 'Y', 0);
		},
		'to': (el, deg) => {
			_css(el.firstChild, { opacity: 0, transform: 'rotateY(' + (deg || 70) + 'deg)' });
		}
	},

	'inner-in': {
		'from': (el) => { _css(el, 'transform', 'translateX(100%)'); },
		'to': (el) => { _css(el, 'transform', 'translateX(0%)'); }
	},

	'inner-out': {
		'from': (el) => { _css(el, 'transform', 'translateX(0%)'); },
		'to': (el) => { _css(el, 'transform', 'translateX(-100%)'); }
	}
};
