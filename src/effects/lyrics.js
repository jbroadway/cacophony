// Effects to display lyrics then fade them away.

$(document).ready (function () {
	cacophony.addInterval (text_display, (cacophony.beatLength () / 4));
	cacophony.addInterval (erase_text, 65);
	cacophony.addInterval (erase_text_queue, (cacophony.beatLength () * .7));
});

var text_queue = [],
	text_rendered = [],
	erase_pre_queue = [],
	erase_queue = [],
	cur_letter = 0,
	erased_letters = 0,
	cur_x = 30,
	cur_colour;

// Display the specified lyrics (or text of any kind) then fade them
// away. You can include the input from the last input_text or
// input_textarea by including `{input}` in your text string.
//
// Usage:
//
//     {a:'lyrics', d: {txt: "One for the money...", x: 123, y: 123,
//         colour:'rgba(102, 102, 102, 1)'}}
function lyrics (data) {
	data.txt = data.txt.replace ('{input}', input_value);
	text_queue.push (data);
}

// Display another letter from the text queue.
function text_display () {
	if (text_queue.length == 0) {
		return;
	}

	if (cur_letter == 0) {
		cur_x = text_queue[0].x;
		cur_colour = (text_queue[0].colour) ? text_queue[0].colour : 'rgba(102, 102, 102, 1.0)';
	}
	var t = new ElementNode (E('span', text_queue[0].txt[cur_letter]), {
		x: cur_x,
		y: text_queue[0].y,
		fontSize: '20',
		fontFamily: 'courier new',
		noScaling: true,
		color: cur_colour
	});
	text_rendered.push ({t: t, l: text_queue[0].txt[cur_letter], o: 1.0});
	cacophony.canvas.append (t);
	cur_x += 16;
	cur_letter++;

	if (cur_letter == text_queue[0].txt.length) {
		erase_pre_queue.push (text_queue.shift ());
		cur_letter = 0;
	}
}

// Add another line to the erase queue.
function erase_text_queue () {
	if (erase_pre_queue.length > 0) {
		erase_queue.push (erase_pre_queue.shift ());
	}
}

// Fade out currently displayed text.
function erase_text () {
	if (erase_queue.length == 0) {
		return;
	}

	if (erased_letters >= erase_queue[0].txt.length) {
		for (var l = 0; l < erase_queue[0].txt.length; l++) {
			cacophony.canvas.remove (text_rendered[0].t);
			text_rendered.shift ();
		}
		erase_queue.shift ();
		erased_letters = 0;
		return;
	}

	for (var i = 0; i < erase_queue[0].txt.length / 2; i++) {
		r = -1;
		while (text_rendered.length > 0 && ! text_rendered[r]) {
			r = Math.floor (Math.random () * erase_queue[0].txt.length);
		}
		text_rendered[r].o -= 0.1;
		op = Math.round ((text_rendered[r].o) * 10) / 10;
		if (op >= 0) {
			text_rendered[r].t.content.style.opacity = op;
		}
		if (op == 0) {
			erased_letters++;
		}
	}
}

// Register effect.
_e['lyrics'] = lyrics;
