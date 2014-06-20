(function () {
	module('Ply');

	var layer;

	test('core', function () {
		equal(typeof Ply, 'function');
		ok(new Ply instanceof Ply);
	});


	function sleep(fn, ms) {
		return Ply.promise(function (resolve) {
			setTimeout(function () {
				fn();
				resolve();
			}, ms);
		});
	}


	function checkVisiblity(layer, state, msg) {
		equal(!!layer.visible, state, '[' + msg + '] visible: ' + state);
		equal(!!layer.wrapEl.parentNode, state, msg + ' -> parentNode is ' + (state ? '' : 'not') + 'exists');
	}


	test('options', function () {
		layer = new Ply();

		for (var key in Ply.defaults.overlay) {
			equal(layer.overlayEl.style[key], Ply.defaults.overlay[key], key);
		}
		equal(layer.bodyEl, document.body, 'body');

		// Body
		layer = new Ply({ body: '#playground' });
		equal(layer.bodyEl, playground, '#playground');

		// Overlay 1
		layer = new Ply({ overlay: { opacity: 1 } });
		equal(layer.overlayEl.style.opacity, 1, 'opacity: 1');
		equal(layer.overlayEl.style.backgroundColor, "", 'backgroundColor: ""');

		// Overlay 2
		layer = new Ply({ overlay: { opacity: 1, backgroundColor: 'rgb(255, 0, 0)' } });
		equal(layer.overlayEl.style.opacity, 1, 'opacity: 1');
		equal(layer.overlayEl.style.backgroundColor, 'rgb(255, 0, 0)', 'backgroundColor: red');

		// Overlay 3
		layer = new Ply({ overlay: null });
		notEqual(layer.overlayEl.style.position, 'fixed', 'overlay: null');

		// Layer
		layer = new Ply({ layer: { textAlign: 'center' } });
		equal(layer.contentEl.style.textAlign, 'center', 'textAlign: center');
	});


	test('flags', function () {
		layer = new Ply();
		for (var key in Ply.defaults.flags) {
			equal(layer.options.flags[key], Ply.defaults.flags[key], key);
		}


		layer = new Ply({ flags: { bodyScroll: true } });
		for (var key in Ply.defaults.flags) {
			equal(layer.options.flags[key], key == 'bodyScroll' ? true : Ply.defaults.flags[key], key);
		}
	});


	test('content', function () {
		var content = document.createElement('b');
		content.innerHTML = '!';

		equal(new Ply().contentEl.innerHTML, '');
		equal(new Ply({ el: 'Wow!' }).contentEl.innerHTML, 'Wow!');
		equal(new Ply({ el: content }).layerEl.innerHTML.replace(/\sstyle=".*?"/, ''), '<b>!</b>');
	});


	promiseTest('open/close', function () {
		layer = new Ply({ el: 'Wow!' });

		ok(!layer.wrapEl.parentNode, '!parent - open');
		ok(!layer.visible, 'visible: false');

		return layer.open().then(function () {
			var ratio = layer.wrapEl.offsetHeight / (layer.layerEl.offsetTop + layer.layerEl.offsetHeight/2);

			ok(layer.visible, 'visible: true');
			ok(layer.wrapEl.offsetWidth > 0, 'offsetWidth > 0');
			ok(Math.abs(2 - ratio) < 0.1, ratio, 'delat(' + ratio + ') < 0.1');

			layer.close().then(function () {
				ok(!layer.visible, 'visible: false - close');
				ok(!layer.wrapEl.parentNode, '!parent - close');
			});
		});
	});


	promiseTest('closeByEsc', function () {
		function open(msg, esc) {
			var layer = new Ply({ flags: { closeByEsc: esc }, effect: { duration: 1 } });

			checkVisiblity(layer, false, msg);

			return layer.open().then(function () {
				checkVisiblity(layer, true, msg);
				return layer;
			});
		}


		return open('1. esc: true', true).then(function (escTrue) {
			return open('2. esc: false', false).then(function (escFalse) {
				simulateEvent(document, 'keyup', { keyCode: Ply.keys.esc });

				checkVisiblity(escTrue, true, '3. esc: true');
				checkVisiblity(escFalse, true, '4. esc: false');

				return escFalse.close().then(function () {
					checkVisiblity(escTrue, true, '5. esc: true');
					checkVisiblity(escFalse, false, '6. esc: false');

					simulateEvent(document, 'keyup', { keyCode: Ply.keys.esc });

					return sleep(function () {
						checkVisiblity(escTrue, false, '7. esc: true');
						checkVisiblity(escFalse, false, '8. esc: false');
					}, 50);
				});
			});
		});
	});


	promiseTest('closeByOverlay', function () {
		function test(msg, state, callback) {
			var layer = new Ply({ flags: { closeByOverlay: state }, effect: { duration: 1 } });
			return layer.open().then(function () {
				checkVisiblity(layer, true, msg);
				simulateEvent(layer.overlayEl, 'click');

				return sleep(function () {
					callback(layer, msg);
				}, 50);
			});
		}


		return test('closeByOverlay: true', true, function (layer, msg) {
			checkVisiblity(layer, false, msg);

			return test('closeByOverlay: false', false, function (layer, msg) {
				checkVisiblity(layer, true, msg);
				return layer.close();
			});
		})
	});


	promiseTest('swap', function () {
		return new Ply({ el: 1, effect: 'none:1' }).open().then(function (layer) {
			return layer.swap({ el: 2 }).then(function () {
				equal(layer.contentEl.innerHTML, 2);

				return layer.close().then(function () {
					return layer.swap({ el: 3 }, 'none:2').then(function () {
						equal(layer.contentEl.innerHTML, 3);
					});
				});
			});
		});
	});


	promiseTest('destory', function () {
		return new Ply({ effect: 'none:1' }).open().then(function (layer) {
			checkVisiblity(layer, true, '#1');

			layer.destroy();

			checkVisiblity(layer, false, '#2');
		});
	});


	promiseTest('on/off', function () {
		var log = [],
			logMe = function (prefix, evt, el) {
				log.push(prefix + ':' + el.tagName + '.' + evt.type + '->' + el.getAttribute('data-ply'));
			},
			barHandle = function (evt, el) {
				log.pop();
				logMe('bar', evt, el);
			}
		;

		return new Ply({ el: '<i data-ply="foo"><em>foo</em></i><b data-ply="bar"><em>bar</em></b>' }).open().then(function (layer) {
			layer.on('click', function (evt, el) {
				logMe('layer', evt, el);
			});

			layer.on('click', 'foo', function (evt, el) {
				logMe('foo', evt, el);
			});

			layer.on('click', 'bar', barHandle);

			simulateEvent(layer.contentEl.getElementsByTagName('em')[0], 'click');
			simulateEvent(layer.contentEl.getElementsByTagName('em')[1], 'click');

			layer.off('click', barHandle);

			simulateEvent(layer.contentEl.getElementsByTagName('em')[1], 'click');

			layer.off('click', 'bar', barHandle);

			simulateEvent(layer.contentEl.getElementsByTagName('em')[1], 'click');

			equal(log.join('\n'), [
				'layer:DIV.click->layer',
				'foo:I.click->foo',
				'bar:B.click->bar',
				'bar:B.click->bar',
				'layer:DIV.click->layer'
			].join('\n'));

			return layer.close();
		});
	});


//	if (/state=2/.test(location)) {
//		promiseTest('Promise', function () {
//			expect(0);
//
//			return Ply.promise(function (resolve) {
//				window.resolveTest = function () {
//					resolve();
//				};
//				document.write('<iframe src="?state=2"></iframe>');
//			});
//		});
//	}
})();
