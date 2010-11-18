// Effects to accept input via the [Harmony](http://mrdoob.com/projects/harmony/)
// ribbon pen tool.

var rib,
	con,
	SCREEN_WIDTH = 854,
	SCREEN_HEIGHT = 480,
	BRUSH_SIZE = 1,
	BRUSH_PRESSURE = 1,
	COLOR = [0, 0, 0],
	ribbon_img,
	ribbon_save_to;

// Turn on the Harmony ribbon pen for enabling drawing input
// from the viewer.
//
// Usage:
//
//     {a:'ribbon_on', d:{
//         msg: 'Draw me something',
//         save_to: '/save_drawing.php'
//     }}
//
// The `save_to` value will optionally send a POST request to
// the specified URL on your server, allowing you to save
// the image data when `ribbon_off` is called. The data can
// be retrieved in PHP via `$_POST['image']` and is generated
// by the `canvas.toDataURL()` method.
function ribbon_on (data) {
	cacophony.visible ([0, 0, 0, 1, 0, 1]);
	if (data) {
		if (data.msg) {
			cacophony.html (data.msg);
		}
		ribbon_save_to = (data.save_to) ? data.save_to : false;
	}
	harmony_init ();
}

// Turn off the Harmony ribbon pen.
//
// Usage:
//
//     {a:'ribbon_off'}
//
// After calling `ribbon_off`, you can refer back to the image
// in subsequent effects by specifying `'ribbon'` as your image
// file name, for example:
//
//     {a:'flicker', d:{img: 'ribbon', duration: 1}}
function ribbon_off () {
	ribbon_img = canvas.toDataURL('image/png');
	_i['ribbon'] = document.createElement ('img');
	_i['ribbon'].src = ribbon_img;

	cacophony.visible ([1, 1, 0, 0, 0, 0]);

	if (ribbon_save_to) {
		$.post (ribbon_save_to, { image: ribbon_img });
	}
}

// Register all effects.
_e['ribbon_on'] = ribbon_on;
_e['ribbon_off'] = ribbon_off;
