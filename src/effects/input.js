// Effects to request viewer input.

var input_thanks,
	input_save_to,
	input_jump_to,
	input_options = [],
	input_value = 'Default',
	input_choice = false;

// Request viewer input as a single-line text box. The `jump_to`
// option will optionally call `cacophony.jumpTo()` after the
// form has been submitted, allowing you to create a loop while
// the form is being shown that is then broken out of afterwards.
// The `save_to` option will send the choice to the URL specified,
// accessible via `$_POST['input']`. The value is also accessible
// to subsequent effects via the global input_value variable.
//
// Usage:
//
//     {a:'input_text', d:{
//         msg: 'Please enter your name',
//         save_to: '/save_input.php',
//         jump_to: 10
//     }}
//
//     {a:'input_text', d:{
//         msg: 'Please enter your city',
//         save_to: '/save_input.php',
//         jump_to: 10,
//         autocomplete: list_of_cities
//     }}
function input_text (data) {
	cacophony.input = true;
	input_thanks = data.thanks;
	input_save_to = data.save_to;
	input_jump_to = data.jump_to;
	if (! data.value) {
		data.value = '';
	}

	cacophony.html (
		'<div style="width: ' + Math.round (cacophony.width * .6) + 'px; height: ' + Math.round (cacophony.height * .35) + 'px; background-color: rgba(255, 255, 255, .7); padding: 20px; text-align: left; border-radius: 10px">' +
		'<form onsubmit="return input_save (this)" style="display: inline">' +
		'<p>' + data.msg + '</p>' +
		'<p><input type="text" id="input-field" name="input-field" value="' + data.value + '" style="border: 1px solid #666; width: 70%; height: 20px" />' +
		'&nbsp;<input type="submit" value="Submit" />&nbsp;<a href="#" onclick="return input_cancel ()">Cancel</a></p>' +
		'</form></div>');
}

// Request viewer input as a multiline text box. The `jump_to`
// option will optionally call `cacophony.jumpTo()` after the
// form has been submitted, allowing you to create a loop while
// the form is being shown that is then broken out of afterwards.
// The `save_to` option will send the choice to the URL specified,
// accessible via `$_POST['input']`. The value is also accessible
// to subsequent effects via the global input_value variable.
//
// Usage:
//
//     {a:'input_textarea', d:{
//         msg: 'Tell me a story',
//         save_to: '/save_input.php',
//         jump_to: 10
//     }}
function input_textarea (data) {
	cacophony.input = true;
	input_thanks = data.thanks;
	input_save_to = data.save_to;
	input_jump_to = data.jump_to;
	if (! data.value) {
		data.value = '';
	}

	cacophony.html (
		'<div style="width: ' + Math.round (cacophony.width * .6) + 'px; height: ' + Math.round (cacophony.height * .35) + 'px; background-color: rgba(255, 255, 255, .7); padding: 20px; text-align: left; border-radius: 10px">' +
		'<form onsubmit="return input_save (this)" style="display: inline">' +
		'<p>' + data.msg + '</p>' +
		'<p><textarea id="input-field" name="input-field" style="border: 1px solid #666; width: 100%; height: 60px">' + data.value + '</textarea></p>' +
		'<p><input type="submit" value="Submit" />&nbsp;<a href="#" onclick="return input_cancel ()">Cancel</a></p>' +
		'</form></div>');
}

// Request viewer input as a set of choices, each of which specify
// a beat number to jump to via `cacophony.jumpTo()` once clicked.
// This allows for branching videos in the style of a choose-your-
// own-adventure story. The `save_to` option will send the choice
// to the URL specified, accessible via `$_POST['choice']`. The
// value is also accessible to subsequent effects via the global
// input_choice variable.
//
// Usage:
//
//     {a:'input_branching', d:{
//         msg: 'What would you do?',
//         options: [
//             {choice: "Go down the dark staircase", jump_to: 10}
//             {choice: "Hide in the attic", jump_to: 20}
//             {choice: "Call the Ghostbusters", jump_to: 30}
//         ],
//         save_to: '/save_input.php'
//     }}
function input_branching (data) {
	input_options = data.options;
	input_save_to = data.save_to;

	cacophony.html (data.msg);
	var opts = '';

	for (var i = 0; i < input_options.length; i++) {
		opts += '<p><a href="#" onclick="return input_choose (' + i + ')">' + input_options[i].choice + '</a></p>';
	}

	cacophony.html (
		'<div style="width: ' + Math.round (cacophony.width * .6) + 'px; height: ' + Math.round (cacophony.height * .35) + 'px; background-color: rgba(255, 255, 255, .7); padding: 20px; text-align: left; border-radius: 10px">' +
		'<p>' + data.msg + '</p>' +
		opts +
		'</div>');
}

// Handles the input for `input_text` and `input_textarea`.
function input_save () {
	cacophony.input = false;
	input_value = $('#input-field').get (0).value;
	$.post (input_save_to, { input: input_value });
	cacophony.html (
		'<div style="width: ' + Math.round (cacophony.width * .6) + 'px; height: ' + Math.round (cacophony.height * .35) + 'px; background-color: rgba(255, 255, 255, .7); padding: 20px; text-align: left; border-radius: 10px">' +
		'<p style="width: 100%">' + input_thanks + '</p>' +
		'</div>');
	setTimeout ('cacophony.html ();', 3000);
	if (input_jump_to) {
		cacophony.jumpTo (input_jump_to);
		input_jump_to = false;
	}
	return false;
}

function input_cancel () {
	cacophony.input = false;
	input_value = false;
	cacophony.html ();
	if (input_jump_to) {
		cacophony.jumpTo (input_jump_to);
		input_jump_to = false;
	}
	return false;
}

// Handles the choice selection for `input_branching`.
function input_choose (n) {
	input_choice = n + 1;
	if (input_save_to) {
		$.post (input_save_to, { choice: input_choice });
	}
	cacophony.html ();
	cacophony.jumpTo (input_options[n].jump_to);
}

// Register all effects.
_e['input_text'] = input_text;
_e['input_textarea'] = input_textarea;
_e['input_branching'] = input_branching;
