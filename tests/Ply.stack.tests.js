(function (Ply) {
	module('Ply.stack');

	asyncTest('2x', function () {
		new Ply('foo', { effect: 'slide' }).open().then(function (foo) {
			new Ply('bar', { effect: 'fall' }).open().then(function (bar) {
				ok(!foo.layerEl.parentNode, 'foo.parent == null');
				ok(!bar.overlayBoxEl.parentNode, 'bar.parent == null');

				Ply.stack.last.close().then(function () {
					ok(!!foo.layerEl.parentNode, 'foo.parent != null');
					ok(!!bar.overlayBoxEl.parentNode, 'bar.parent != null');

					Ply.stack.last.close().then(function () {
						start();
					});
				});
			});
		});
	});
})(Ply);
