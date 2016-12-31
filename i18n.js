/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import {_} from 'meteor/underscore';
import {Meteor} from 'meteor/meteor';
import {ReactiveVar} from 'meteor/reactive-var';
import {Translations as translations} from './i18n-collection';


/**
 * Domain list
 * @type {Array}
 */
const domains = [];

/**
 * Hexadecimal dictionary in lowercase
 * @type {*[]}
 */
const hexaL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];

/**
 * Hexadecimal dictionary in uppercase
 * @type {*[]}
 */
const hexaU = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];

/**
 * Default language
 * @type {ReactiveVar}
 */
const language = new ReactiveVar(null);


export const i18n = {
    /**
     * Adds translation helpers for Blaze
     */
    addBlazeHelpers() {
        const self = this;
        const fn = function (fun, args) {
            args = Array.prototype.slice.call(args);
            const options = args.pop();

            if (options.domain) {
                args.push(options.domain);
            }
            return fun.apply(self, args);
        };
        Template.registerHelper('t', function () {
            return fn(self.t, arguments);
        });
        Template.registerHelper('t0', function () {
            return fn(self.t0, arguments);
        });
        Template.registerHelper('t1', function () {
            return fn(self.t1, arguments);
        });
        Template.registerHelper('tn', function () {
            return fn(self.tn, arguments);
        });
    },

    /**
     * Returns the default language
     * @returns {*}
     */
    getLanguage() {
        return language.get();
    },

    /**
     * Returns the text translation in the specified domain and language
     * @param text
     * @param domain
     * @param lang
     * @return {string}
     */
    getText(text, domain, lang) {
        lang = lang || language.get();

        const result = translations.findOne({
            domain: domain,
            lang: lang,
            from: text
        }, {fields: {to: 1}});

        return result ? result.to : text;
    },

    /**
     * Returns translations matching the query
     * @param where
     * @param options
     * @return {*}
     */
    getTranslations(where, options) {
        return translations.find(where, options);
    },

    /**
     * Setup translations
     * @param options
     */
    init(options) {
        options = _.extend({}, options);

        // Set default language
        if (typeof options.lang === 'string') {
            language.set(options.lang.toLowerCase());
        }
    },

    /**
     * Loads translations from a catalog
     * @param catalog
     */
    loadCatalog(catalog) {
        if (typeof catalog !== 'object' || catalog === null) {
            throw new Error("i18n.loadCatalog: first argument must be an object");
        }
        if (typeof catalog.lang !== 'string') {
            throw new Error(`i18n.loadCatalog: the domain "${catalog.name}" has no lang defined`);
        }
        if (typeof catalog.data !== 'object' || catalog.data === null) {
            throw new Error(`i18n.loadCatalog: the domain "${catalog.name}" has no data defined`);
        }

        // Add domain to the list
        if (typeof catalog.domain === 'string' && domains.indexOf(catalog.domain) === -1) {
            domains.push(catalog.domain);
        }

        for (const text in catalog.data) {
            if (catalog.data.hasOwnProperty(text)) {
                const to = catalog.data[text];

                // Insert translation if it does not exist
                if (translations.find({from: text, to: to}).count() === 0) {
                    translations.insert({
                        domain: catalog.domain || null,
                        lang: catalog.lang,
                        from: text,
                        to: to
                    });
                }
            }
        }
    },

    /**
     * Returns a string depending of a quantity
     * @return {string}
     */
    plural() {
        if (typeof arguments[0] !== 'number') {
            throw new Error('i18n.plural: first argument must be a Number');
        }
        if (typeof arguments[1] !== 'object' || arguments[1] === null) {
            throw new Error('i18n.plural: second argument must be an object {0,1,n}');
        }
        const count = Math.abs(arguments[0]);
        const text = arguments[1];

        if (count === 0) {
            return text['0'];
        }
        else if (count === 1) {
            return text['1'];
        }
        return text['n'];
    },

    /**
     * Sets the language to use
     * @param lang
     */
    setLanguage(lang) {
        language.set(lang.toLowerCase());
    },

    /**
     * Returns the translated string
     * @return {string}
     */
    t() {
        if (typeof arguments[0] !== 'string') {
            throw new Error('i18n.t: first argument must be a String');
        }
        const args = arguments;
        let text = args[0];
        let domain = null;
        let i = 0;

        // Check domain
        if (args.length > 1) {
            const name = args[args.length - 1];

            if (typeof name === 'string') {
                if (domains.indexOf(name) !== -1) {
                    domain = name;
                }
            }
        }

        // Get the translated text
        text = this.getText(text, domain, language.get());

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
     * Returns the translated string if count equals zero
     * @return {string}
     */
    t0() {
        const args = Array.prototype.slice.call(arguments);
        const count = args.shift();
        return count === 0 ? this.t.apply(this, args) : '';
    },

    /**
     * Returns the translated string if count equals (-)1
     * @return {string}
     */
    t1() {
        const args = Array.prototype.slice.call(arguments);
        const count = args.shift();
        return count === 1 || count === -1 ? this.t.apply(this, args) : '';
    },

    /**
     * Returns the translated string if count is greater than 1 or lesser than -1
     * @return {string}
     */
    tn() {
        const args = Array.prototype.slice.call(arguments);
        const count = args.shift();
        return count > 1 || count < -1 ? this.t.apply(this, args) : '';
    }
};

export default i18n;
export const Translations = translations;

if (Meteor.isServer) {
    // Expose the module globally
    if (typeof global !== 'undefined') {
        global['i18n'] = i18n;
    }
}
else if (Meteor.isClient) {
    // Expose the module globally
    if (typeof window !== 'undefined') {
        window.i18n = i18n;
    }
}
