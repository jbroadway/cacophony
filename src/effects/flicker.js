// A variety of effects to flicker images, sequences of images, panels
// of images, and images in a parallax effect.

var flicker_img,
	panel1, panel2, panel3, panel4,
	panel_timeout = false,
	seq = [],
	seq_img = false,
	seq_dur = 100,
	f = false,
	flicker_layers = false,
	flicker_auto = false,
	flicker_auto_direction = 'right';

// Flicker an image on the screen for the specified duration (measured in beats).
//
// Usage:
//
//     {a:'flicker', d:{img: 'pix/image.png', duration: 1}}
function flicker (data) {
	if (flicker_img) {
		cacophony.canvas.remove (flicker_img);
		flicker_img = false;
		return;
	}

	if (! data) {
		return;
	}

	flicker_img = new ImageNode (_i[data.img]);
	flicker_img.x = 0;
	flicker_img.y = 0;
	flicker_img.dWidth = cacophony.width;
	flicker_img.dHeight = cacophony.height;
	cacophony.canvas.append (flicker_img);

	var dur = (data.duration) ? cacophony.beatLength () * data.duration : cacophony.beatLength () * .375;
	setTimeout (flicker, dur);
}

// Flicker a set of images in multiple layers (specified from back to front)
// on the screen using a parallax effect. Can move automatically to the left
// or right by specifying `auto:true` and an optional direction (default is
// `'right'`, or in reaction to mouse movements.
//
// Usage:
//
//     {a:'flicker_parallax', d:{
//         layers: ['pix/back.png', 'pix/middle.png', 'pix/top.png'],
//         duration: 4
//     }}
//
//     {a:'flicker_parallax', d:{
//         layers:['pix/back.png', 'pix/middle.png', 'pix/top.png'],
//         duration: 4, auto:true, direction: 'right'
//     }}
function flicker_parallax (data) {
	if (flicker_layers) {
		for (var i = flicker_layers.length; i > 0; i--) {
			cacophony.canvas.remove (flicker_layers[i - 1]);
		}
		flicker_layers = false;
		return;
	}

	var midx, midy, dur;
	midx = cacophony.width / 2;
	midy = cacophony.height / 2;

	flicker_layers = [];
	for (var i = 0; i < data.layers.length; i++) {
		flicker_layers[i] = new ImageNode (_i[data.layers[i]]);
		flicker_layers[i].x = midx - (flicker_layers[i].image.width / 2);
		flicker_layers[i].y = midy - (flicker_layers[i].image.height / 2);
		flicker_layers[i].origx = flicker_layers[i].x;
		flicker_layers[i].origy = flicker_layers[i].y;
		flicker_layers[i].maxx = flicker_layers[i].origx - flicker_layers[i].origx;
		flicker_layers[i].maxy = cacophony.height / 10 - ((data.layers.length - i) * 4);
		flicker_layers[i].minx = flicker_layers[i].origx + flicker_layers[i].origx;
		flicker_layers[i].miny = 0;
		flicker_layers[i].y = flicker_layers[i].maxy;
		cacophony.canvas.append (flicker_layers[i]);
	}

	dur = (data.duration) ? cacophony.beatLength () * data.duration : cacophony.beatLength ();
	setTimeout (flicker_parallax, dur);
	if (data.auto) {
		flicker_auto = true;
		if (data.direction) {
			flicker_auto_direction = data.direction;
		} else {
			flicker_auto_direction = 'right';
		}
		setTimeout (flicker_parallax_update, 65);
	} else {
		flicker_auto = false;
	}
}

// Handle parallax updating on timer or mousemove.
function flicker_parallax_update (m) {
	if (m !== true) {
		for (var i = 0; i < flicker_layers.length; i++) {
			if (flicker_auto_direction == 'right') {
				var newx = flicker_layers[i].x + (((i + 1) * 2) / 2);
				if (newx < flicker_layers[i].maxx) {
					flicker_layers[i].x = newx;
				}
			} else {
				var newx = flicker_layers[i].x - (((i + 1) * 2) / 2);
				if (newx > flicker_layers[i].minx) {
					flicker_layers[i].x = newx;
				}
			}
		}
		setTimeout (flicker_parallax_update, 65);
		return;
	}

	var midx, midy;
	midx = cacophony.width / 2;
	midy = cacophony.height / 2;

	for (var i = 0; i < flicker_layers.length; i++) {
		var newx, newy;
		newx = (flicker_layers[i].origx - cacophony.mousex) / (flicker_layers.length - i) / 2;
		newy = flicker_layers[i].maxy - (((cacophony.mousey / cacophony.height) * i) * 10);
		if (newx >= flicker_layers[i].minx && newx <= flicker_layers[i].maxx) {
			flicker_layers[i].x = newx;
		}
		if (newy >= flicker_layers[i].miny && newy <= flicker_layers[i].maxy) {
			flicker_layers[i].y = newy;
		}
	}
}

// Register a mousemove callback for parallax effect.
cacophony.mousemove (function () {
	if (! flicker_layers || flicker_auto) {
		return;
	}
	flicker_parallax_update (true);
});

// Flicker a set of images in four panels (specified in the order
// top-left, top-right, bottom-right, bottom-left).
//
// Usage:
//
//     {a:'flicker_panels', d:{
//         images: ['pix/one.png', 'pix/two.png', 'pix/three.png', 'pix/four.png'],
//         duration: 4
//     }}
function flicker_panels (data) {
	if (panel_timeout) {
		clearTimeout (panel_timeout);
	}

	if (panel1) {
		cacophony.canvas.remove (panel1);
		cacophony.canvas.remove (panel2);
		cacophony.canvas.remove (panel3);
		cacophony.canvas.remove (panel4);
	}

	panel1 = new ImageNode (_i[data.images[0]]);
	panel1.x = 0;
	panel1.y = 0;
	panel1.dWidth = cacophony.width / 2;
	panel1.dHeight = cacophony.height / 2;
	cacophony.canvas.append (panel1);

	panel2 = new ImageNode (_i[data.images[1]]);
	panel2.x = cacophony.width / 2;
	panel2.y = 0;
	panel2.dWidth = cacophony.width / 2;
	panel2.dHeight = cacophony.height / 2;
	cacophony.canvas.append (panel2);

	panel3 = new ImageNode (_i[data.images[2]]);
	panel3.x = 0;
	panel3.y = cacophony.height / 2;
	panel3.dWidth = cacophony.width / 2;
	panel3.dHeight = cacophony.height / 2;
	cacophony.canvas.append (panel3);

	panel4 = new ImageNode (_i[data.images[3]]);
	panel4.x = cacophony.width / 2;
	panel4.y = cacophony.height / 2;
	panel4.dWidth = cacophony.width / 2;
	panel4.dHeight = cacophony.height / 2;
	cacophony.canvas.append (panel4);

	var dur = (data.duration) ? cacophony.beatLength () * data.duration : cacophony.beatLength () * .375;
	panel_timeout = setTimeout (four_panel_clear, dur);
}

// Clear panels.
function four_panel_clear () {
	if (panel1) {
		cacophony.canvas.remove (panel1);
		cacophony.canvas.remove (panel2);
		cacophony.canvas.remove (panel3);
		cacophony.canvas.remove (panel4);
		panel1 = false;
		panel2 = false;
		panel3 = false;
		panel4 = false;
	}
}

// Flicker a sequence of images one after another. Duration is how many beats
// to show each image for.
//
// Usage:
//
//     {a:'flicker_sequence', d:{
//         images: ['pix/one.png', 'pix/two.png', 'pix/three.png', 'pix/four.png'],
//         duration: .5
//     }}
function flicker_sequence (data) {
	if (data) {
		seq_dur = (data.duration) ? cacophony.beatLength () * data.duration : cacophony.beatLength () * .375;
		seq = data.images;
	}

	if (seq_img) {
		cacophony.canvas.remove (seq_img);
		seq_img = false;
	}
	if (seq.length > 0) {
		img = seq.shift ();

		seq_img = new ImageNode (_i[img]);
		seq_img.x = 0;
		seq_img.y = 0;
		seq_img.dWidth = cacophony.width;
		seq_img.dHeight = cacophony.height;
		cacophony.canvas.append (seq_img);

		setTimeout ('flicker_sequence ();', seq_dur);
	}
}

// Register all effects.
_e['flicker'] = flicker;
_e['flicker_panels'] = flicker_panels;
_e['flicker_sequence'] = flicker_sequence;
_e['flicker_parallax'] = flicker_parallax;
