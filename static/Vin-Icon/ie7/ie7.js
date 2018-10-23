/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'Vin-Icon\'">' + entity + '</span>' + html;
	}
	var icons = {
		'icon-Vin-to-top2': '&#xe90f;',
		'icon-Vin-non-image': '&#xe900;',
		'icon-Vin-back': '&#xe901;',
		'icon-Vin-close': '&#xe902;',
		'icon-Vin-delete': '&#xe903;',
		'icon-Vin-go': '&#xe904;',
		'icon-Vin-like': '&#xe905;',
		'icon-Vin-like2': '&#xe906;',
		'icon-Vin-logo-title': '&#xe907;',
		'icon-Vin-save': '&#xe908;',
		'icon-Vin-search': '&#xe909;',
		'icon-Vin-slide': '&#xe90a;',
		'icon-Vin-tick': '&#xe90b;',
		'icon-Vin-to-top': '&#xe90c;',
		'icon-Vin-triangle': '&#xe90d;',
		'icon-Vin-wechat': '&#xe90e;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
