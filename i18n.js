/**
 * Domain list
 * @type {Array}
 */
var domains = [];

/**
 * Hexadecimal dictionary in lowercase
 * @type {*[]}
 */
var hexaL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];

/**
 * Hexadecimal dictionary in uppercase
 * @type {*[]}
 */
var hexaU = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];

/**
 * Default language
 * @type {ReactiveVar}
 */
var language = new ReactiveVar(null);

/**
 * Translation domains
 * @type {{Mongo.Collection}}
 */
var translations = new Mongo.Collection(null);

/**
 * Translation util
 * @type {*}
 */
i18n = {

    /**
     * Returns the text in the specified domain and language
     * @param text
     * @param domain
     * @param lang
     * @return {string}
     */
    getText: function (text, domain, lang) {
        lang = lang || language.get();

        var result = translations.findOne({
            domain: domain,
            language: lang,
            from: text
        }, {fields: {to: 1}});

        return result ? result.to : text;
    },

    /**
     * Returns translations matching the query
     * @param filters
     * @param options
     * @return {*}
     */
    getTranslations: function (filters, options) {
        return translations.find(filters, options);
    },

    /**
     * Setup the translation
     * @param options
     */
    init: function (options) {
        options = _.extend({}, options);

        // Set default language
        if (typeof options.language === 'string') {
            language.set(options.language.toLowerCase());
        }
    },

    /**
     * Loads translations from a catalog
     * @param catalog
     */
    loadCatalog: function (catalog) {
        if (typeof catalog !== 'object' || catalog === null) {
            throw new Error("i18n.addDomain: first argument must be an object");
        }
        if (typeof catalog.language !== 'string') {
            throw new Error("i18n.addDomain: the domain `" + catalog.name + "` has no language defined");
        }
        if (typeof catalog.data !== 'object') {
            throw new Error("i18n.addDomain: the domain `" + catalog.name + "` has no data defined");
        }

        // Add domain to list
        if (typeof catalog.domain === 'string' && domains.indexOf(catalog.domain) === -1) {
            domains.push(catalog.domain);
        }

        for (let text in catalog.data) {
            if (catalog.data.hasOwnProperty(text)) {
                translations.insert({
                    domain: catalog.domain || null,
                    language: catalog.language,
                    from: text,
                    to: catalog.data[text]
                });
            }
        }
    },

    /**
     * Sets the language to use
     * @param lang
     */
    setLanguage: function (lang) {
        language.set(lang);
    },

    /**
     * Returns the translated string
     * @return {string}
     */
    t: function () {
        if (typeof arguments[0] !== 'string') {
            throw new Error('i18n.t: first argument must be a String');
        }
        var args = arguments;
        var text = args[0];
        var domain = null;
        var i = 0;

        // Check domain
        if (args.length > 1) {
            var name = args[args.length - 1];
            if (typeof name === 'string') {
                if (domains.indexOf(name) !== -1) {
                    domain = name;
                }
            }
        }

        // Get the translated text
        text = i18n.getText(text, domain, language.get());

        // Replace variables
        text = text.replace(/%([bcdefsxX])/g, function (m, f) {
            i += 1;

            switch (f) {
                case 'b':
                    return Boolean(args[i]);

                case 'c':
                    return String.fromCharCode(args[i]);

                case 'd':
                    return parseInt(args[i]);

                case 'e':
                    return parseInt(args[i]).toExponential();

                case 'f':
                    return parseFloat(args[i]);

                case 's':
                    return args[i];

                case 'x':
                    return hexaL[parseInt(args[i])];

                case 'X':
                    return hexaU[parseInt(args[i])];
            }
            return '';
        });

        return text;
    },

    /**
     * Translates a string depending of a quantity
     * @return {string}
     */
    plural: function () {
        if (typeof arguments[0] !== 'number') {
            throw new Error('i18n.plural: first argument must be a Number');
        }
        if (typeof arguments[1] !== 'object' || arguments[1] === null) {
            throw new Error('i18n.plural: second argument must be an object {0,1,n}');
        }
        var count = arguments[0];

        if (count === 0) {
            return arguments[1]['0'];
        }
        if (count === 1) {
            return arguments[1]['1'];
        }
        if (count > 1) {
            return arguments[1]['n'];
        }
        return '';
    },

    /**
     * Returns the translated string if count equals zero
     * @param count
     * @param text
     * @return {string}
     */
    t0: function (count, text) {
        return count === 0 ? i18n.t(text) : '';
    },

    /**
     * Returns the translated string if count equals (-)1
     * @param count
     * @param text
     * @return {string}
     */
    t1: function (count, text) {
        return count === 1 || count === -1 ? i18n.t(text) : '';
    },

    /**
     * Returns the translated string if count is greater than 1 or lesser than -1
     * @param count
     * @param text
     * @return {string}
     */
    tn: function (count, text) {
        if (count > 1 || count < -1) {
            var args = [];
            for (var i = 1; i < arguments.length; i += 1) {
                args.push(arguments[i]);
            }
            return i18n.t.apply(this, args);
        }
        return '';
    }
};


if (Meteor.isClient) {
    var fn = function (fun, arguments) {
        var args = [];
        var options = arguments[arguments.length - 1].hash;

        for (var i = 0; i < arguments.length - 1; i += 1) {
            args.push(arguments[i]);
        }
        if (options.domain) {
            args.push(options.domain);
        }
        return fun.apply(this, args);
    };

    Template.registerHelper('t', function () {
        return fn(i18n.t, arguments);
    });
    Template.registerHelper('t0', function () {
        return fn(i18n.t0, arguments);
    });
    Template.registerHelper('t1', function () {
        return fn(i18n.t1, arguments);
    });
    Template.registerHelper('tn', function () {
        return fn(i18n.tn, arguments);
    });
}
