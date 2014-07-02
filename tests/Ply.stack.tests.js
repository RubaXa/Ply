(function (Ply) {
	module('Ply.stack');

	asyncTest('2x', function () {
		new Ply({ el: '1', effect: 'fade' }).open().then(function () {
			new Ply({ el: '2', effect: 'fade' }).open().then(function () {
//				Ply.stack.last.close();
//				Ply.stack.last.close().then(function () {
//					start();
//				});
			});
		});
	});
})(Ply);
