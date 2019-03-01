/**
 * Created by raul on 11/20/16.
 */

// Require keystone and i18n-node
var keystone = require('keystone'),
	extend = require('util')._extend,
	i18n = require('i18n');

// extend twig
var twigAvailable = true;
try {
	require.resolve('twig');
} catch (e) {
	twigAvailable = false;
	console.log('twig module not found');
}
if (twigAvailable) {
	var twig = require('twig');
	twig.extendFunction("__", function(text, domain) {
		if (typeof domain == 'undefined') domain = '';
		return i18n.__(text, domain);
	});
}

// define module
var _this = {
	defaultOptions: {
		locales: ['en', 'es'],
		endpoint: '/lang',
		defaultLocale: 'en',
		cookie: 'language'
	},
	cookie_name: "",
	init: function (options) {
		// Get options
		options = extend(_this.defaultOptions, options);
		
		// Set cookie name for switchLocale
		_this.cookie_name = options.cookie;
		
		// Setup i18n
		i18n.configure(options);
		i18n.setLocale(options.defaultLocale);
		
		// Push to keystones
		keystone.pre('routes', i18n.init);
	},
	switchLocale: function (req, res) {
		i18n.setLocale(req.params.lang);
		res.cookie(_this.cookie_name, req.params.lang, { maxAge: 900000, httpOnly: true });
		res.redirect('back');
	}
};

// export
module.exports = _this;
