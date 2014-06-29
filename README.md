# Ply
Amazing layer/modal/dialog system. Wow!



## Features
 * Support browsers Chrome 20+, FireFox 20+, Safari 6+, Opera 12+, IE8+ (in progress)
 * [ES6 syntax](https://github.com/termi/es6-transpiler)
 * No jQuery (but then need polyfill [Promise](https://gist.github.com/RubaXa/8501359) polyfill)
 * More than 90% [test code coverage](http://rubaxa.github.io/Ply/tests/)



## Base usage

Include [ply.css](ply.css) in `<head/>` (optional)
```html
	<link href='./ply.css' rel='stylesheet' type='text/css'/>
```

Create a dialog:
```js
Ply.dialog("alert", "Wow!").then(function (ui) {
	ui.by; // submit, overlay, esc, "x"
	ui.state; // true — "OK", false — "cancel"
});
```


---


## Dialogs

```js
Ply.dialog({
	"init-state": {
		ui: "alert",
		data: "Wow!",
		next: "other-step"
		nextEffect: "3d-flip[180,-180]"
	},

	"other-step": {
		ui: "confirm",
		data: {
			text: "What's next?",
			ok: "Exit",     // button text
			cancel: "Back"
		},
		back: "init-state",
		backEffect: "3d-flip[-180,180]"
	}
}).then(function (ui) {
	// ...
})
```



---


## Low-level

```js
var ply = new Ply({
	el: "...", // HTML-content

	effect: "fade", // or ["open-effect:duration", "close-effect:duration"]

	layer: {}, // default css

	overlay: { // defaults css
		opacity: 0.6,
		backgroundColor: "#000"
	},

	flags: { // defaults
		bodyScroll: false, // disable scrollbar at body
		closeByEsc: true, // close by press on `Esc` key
		closeByOverlay: true // close by click on the overlay
	},

	// Callback
	init: function () {},
	open: function (ply) {},
	close: function (ply) {},
	destory: function (ply) {},
	callback: function (ui) {},
});


// And
ply.open().then(function () {
	ply.swap({ el: ".." }, "3d-flip").then(function () {
		ply.close();
	});
});
```


---


## Preset effects
 - fade
 - scale
 - fall
 - slide
 - 3d-flip
 - 3d-sign



### Combined effects
```js
Ply.dialog("alert", { effect: ["fade", "scale"] }, "Fade & scale");
```


### Custom effects
```js
Ply.effects["my-effect"] = {
	open:  { layer: "fade-in", overlay: "background-in" },
	close: { layer: "fade-out", overlay: "background-out" }
};

Ply.effects["background-in"] = {
	"from": { opacity: 0, backgroundColor: "red" },
	"to":   { opacity: 1, backgroundColor: "white" }
};

Ply.effects["background-out"] = {
	"from": { opacity: 1, backgroundColor: "white" },
	"to":   { opacity: 0, backgroundColor: "green" }
};
```

---


## Ply.stack
 * last`:Ply|null`
 * length`:Number`


---


## Ply.support
 * transition`:String|Boolean`
 * transform`:String|Boolean`
 * perspective`:String|Boolean`
 * transformStyle`:String|Boolean`
 * transformOrigin`:String|Boolean`
 * backfaceVisibility`:String|Boolean`


---


## Ply.lang (localization)
 * ok`:String` — "OK"
 * cancel:`String` — "Cancel"


---


## Ply.defaults
 * layer`:Object` — `{}`
 * overlay`:Object` — `{ opacity: 0.6, backgroundColor: 'rgb(0, 0, 0)' }`
 * flags`:Object` — `{ bodyScroll: false, closeByEsc: true, closeByOverlay: true }`


---


## Ply.dom

#### build(tag`:String|Object`)`:HTMLElement`
```js
Ply.build(); // <div/>
Ply.build("input"); // <input/>
Ply.build(".foo"); // <div class="foo"/>
Ply.build(".foo.bar"); // <div class="foo bar"/>
Ply.build({  // <input type="password" class="foo" style="padding: 10px" maxlength="32"/>
	tag: "input.foo",
	type: "password",
	css: { padding: "10px" },
	maxlength: 32
});
Ply.build({ text: "<i>?</i>" }); // <div>&lt;i&gt;?&lt;/i&gt;</div>
Ply.build({ html: "<i>!</i>" }); // <div><i>!</i></div>
```

#### append(parent`:HTMLElement`, el`:HTMLElement`)

#### remove(el`:HTMLElement`)

#### addEvent(el`:HTMLElement`, name`:String`, fn`:Function`)

#### removeEvent(el`:HTMLElement`, name`:String`, fn`:Function`)



