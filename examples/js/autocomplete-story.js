// This is where you describe the storyline of your video.
//
// Available effects:
//
// Jump to the specified beat of the song:
//
//     {a:'jump_to', d:1}
//
// Background colour effects:
//
//     {a:'bg_colour', d: {colour: "#eee"}}
//     {a:'bg_fade_to', d: {colour: "rgba(123, 123, 123, %d)"}}
//     {a:'bg_fade_in'}
//     {a:'bg_fade_out'}
//
// Flicker images:
//
//     {a:'flicker', d: {img: "pix/image.png", duration: 1}}
//     {a:'flicker_sequence', d: {images: ["img1.png", "img2.png"], duration: 1}}
//     {a:'flicker_panels', d: {
//         images: ["img1.png", "img2.png", "img3.png", "img4.png"], duration: 1}}
//     {a:'flicker_parallax', d: {
//         layers: ["back.png", "middle.png", "top.png"],
//         duration: 4, auto: true, direction: 'right'}}
//
// Display the specified lyrics then fade them away:
//
//     {a:'lyrics', d: {txt: "...", x: 123, y: 123, colour:'rgba(102, 102, 102, 1)'}}
//
// Volume control:
//
//     {a:'set_volume', d:0.7}
//     {a:'volume_fade', d:{to:0.7, duration:4}}
//
// Request viewer input:
//
//     {a:'input_text', d: {msg: "Please enter your name",
//         save_to: "/save_input.php", jump_to: 10}}
//     {a:'input_text', d: {msg: "Please enter your city",
//         save_to: "/save_input.php", jump_to: 10, autocomplete: list_values}}
//     {a:'input_textarea', d: {msg: "Tell me a story",
//         save_to: "/save_input.php", jump_to: 10}}
//     {a:'input_branching', d: {msg: "What would you do?", options: [
//     	{choice: "Go down the dark staircase", jump_to: 10}
//     	{choice: "Hide in the attic", jump_to: 20}
//     	{choice: "Call the Ghostbusters", jump_to: 30}
//     ]}}
//
// An interactive circle hide/reveal effect:
//
//     {a:'circles_on', d: {fill: '#eee'}}
//     {a:'circles_off'}
//
// Bounce a skyline of the `eq_data` to the beat of the song:
//
//     {a:'skyline_on'}
//     {a:'skyline_off'}
//
// Render ContextFree.js code:
//
//     {a:'context_on', d: "code here"}
//     {a:'context_off'} (use img:'context' to reference the saved image later)
//
// Allow drawn input using the Harmony ribbon pen:
//
//     {a:'ribbon_on', d: {msg: "Draw me something", save_to: "/save_image.php"}}
//     {a:'ribbon_off'} (use img:'ribbon' to reference the saved image later)
//
// Render a scene from Three.js:
//
//     {a:'three_on', d:{func:function_with_three_js_code, arg1:'foo', arg2:'bar'}}
//     {a:'three_off'}
//
// Use data feeds to display current info in your video (JSON, RSS, ATOM, XML):
//
//     {a:'datafeed_slideshow', d:{url: '/example.rss'}}
//     {a:'datafeed_headlines', d:{url: '/example.rss'}}
//     {a:'datafeed_map_on', d:{url: '/coords.json', view:'street'}}
//     {a:'datafeed_map_off'}
//
// Example story:
//
//     _s[0] = [
//     	{a:'bg_fade_in'}
//     ];
//     _s[1] = [
//     	{a:'lyrics', d: {txt: "Draw how you're feeling today", x: 50, y: 50}}
//     ];
//     _s[4] = [
//     	{a:'lyrics', d: {txt: "Ready?", x: 100, y: 100}}
//     ]
//     _s[6] = [
//     	{a:'lyrics', d: {txt: "Set...", x: 200, y: 100}}
//     ]
//     _s[8] = [
//     	{a:'lyrics', d: {txt: "Go!", x: 300, y: 100}},
//     	{a:'ribbon_on', d: {save_to: "http://www.example.com/save_image.php"}}
//     ];
//     _s[20] = [
//     	{a:'lyrics', d: {txt: "Almost done?", x: 100, y: 100}}
//     ];
//     _s[24] = [
//     	{a:'ribbon_off'},
//     	{a:'lyrics', d: {txt: "Saving...", x:100, y: 100}}
//     ];
//

// #### Your story goes here.

_s[0] = [
	{a:'bg_colour', d:{colour: 'rgba(200, 200, 200, 1)'}}
];

_s[1] = [
	{a:'lyrics', d:{txt:'Demonstrating input with autocomplete', x: 120, y: 200, colour:'rgba(50, 50, 50, 1)'}}
];

_s[18] = [
	{a:'input_text', d: {
		msg: "Please enter your country",
		autocomplete: country_list, // see autocomplete-settings.js for the list
		thanks: "Thank you for participating!"
	}}
];

_s[166] = [
	{a:'bg_fade_out'}
];
