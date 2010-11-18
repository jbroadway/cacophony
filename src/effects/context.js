// Effects to render [ContextFree.js](http://code.google.com/p/contextfree/) code in your video.

var context_tok = new Tokenizer (),
	context_comp = new Compiler (),
	context_saved_context,
	context_img,
	context_tokenz = document.createElement ('input');
context_tokenz.setAttribute ('type', 'hidden');
context_tokenz.setAttribute ('id', 'context-tokens');
$(document).ready (function () {
	document.getElementsByTagName('body') [0].appendChild (context_tokenz);
});

// Turn on and render a drawing using ContextFree.js.
//
// Usage:
//
//     {a:'context_on', d:'code here'}
function context_on (data) {
	var container, canvas, context_tokens, compiled;

	cacophony.visible ([0, 0, 1, 0, 0, 0]);

	container = $('#cacophony-canvas2');
	container.find ('#contextCanvas').remove ();

	canvas = document.createElement ('canvas');
	canvas.width = container.width ();
	canvas.height = container.height ();
	canvas.id = 'contextCanvas';
	container.append (canvas);

	context_tokenz.value = data;
	context_tokens = context_tok.tokenize ('context-tokens');
	compiled = context_comp.compile (context_tokens);
	Renderer.queue = [];
	Renderer.render (compiled, 'contextCanvas');
}

// Turn off ContextFree.js.
//
// Usage:
//
//     {a:'context_off'}
function context_off () {
	context_img = $('#contextCanvas').get (0).toDataURL('image/png');
	_i['context'] = document.createElement ('img');
	_i['context'].src = context_img;

	cacophony.visible ([1, 1, 0, 0, 0, 0]);
}

// Register all effects.
_e['context_on'] = context_on;
_e['context_off'] = context_off;
