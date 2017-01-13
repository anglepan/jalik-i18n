/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
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

import {Meteor} from 'meteor/meteor';
import {i18n} from 'meteor/jalik:i18n';
import {Translations} from 'meteor/jalik:i18n';
import {chai} from 'meteor/practicalmeteor:chai';


describe('i18n', function () {

    before(function () {
        // Load French translations
        i18n.loadCatalog({
            domain: null,
            lang: 'fr',
            data: {"Hello %s": "Bonjour %s"}
        });
        // Initialize translations
        i18n.init({lang: 'en'});
    });

    describe(`loadCatalog({lang: 'es'})`, function () {
        it(`should add Spanish translations`, function () {
            i18n.loadCatalog({
                domain: null,
                lang: 'es',
                data: {"Hello %s": "Hola %s"}
            });
            chai.assert.equal(Translations.find({lang: 'es'}).count(), 1);
        });
    });

    describe(`getText('Hello %s')`, function () {
        it(`should return "Hello %s"`, function () {
            const text = "Hello %s";
            chai.assert.equal(i18n.getText(text), text);
        });
    });

    describe(`t('Hello %s', 'World')`, function () {
        it(`should return "Hello World"`, function () {
            chai.assert.equal(i18n.t("Hello %s", 'World'), 'Hello World');
        });
    });

    describe(`t('Hello %s', 'World') with language set to 'fr'`, function () {
        it(`should return "Bonjour World"`, function () {
            i18n.setLanguage('fr');
            chai.assert.equal(i18n.t("Hello %s", 'World'), 'Bonjour World');
        });
    });

    describe(`t('Hello %s', 'World') with language set to 'xx'`, function () {
        it(`should return "Hello World"`, function () {
            i18n.setLanguage('xx');
            chai.assert.equal(i18n.t("Hello %s", 'World'), 'Hello World');
        });
    });

    describe(`plural(-1, {0: i18n.t('Nothing'), 1: i18n.t('One thing'), n: i18n.t('%d things')})`, function () {
        it(`should return "One thing"`, function () {
            chai.assert.equal(i18n.plural(-1, {
                0: i18n.t('Nothing'),
                1: i18n.t('One thing'),
                n: i18n.t('%d things')
            }), 'One thing');
        });
    });

    describe(`plural(0, {0: i18n.t('Nothing'), 1: i18n.t('One thing'), n: i18n.t('%d things')})`, function () {
        it(`should return "Nothing"`, function () {
            chai.assert.equal(i18n.plural(0, {
                0: i18n.t('Nothing'),
                1: i18n.t('One thing'),
                n: i18n.t('%d things')
            }), 'Nothing');
        });
    });

    describe(`plural(1, {0: i18n.t('Nothing'), 1: i18n.t('One thing'), n: i18n.t('%d things')})`, function () {
        it(`should return "One thing"`, function () {
            chai.assert.equal(i18n.plural(1, {
                0: i18n.t('Nothing'),
                1: i18n.t('One thing'),
                n: i18n.t('%d things')
            }), 'One thing');
        });
    });

    describe(`plural(5, {0: i18n.t('Nothing'), 1: i18n.t('One thing'), n: i18n.t('%d things', 5)})`, function () {
        it(`should return "5 things"`, function () {
            chai.assert.equal(i18n.plural(5, {
                0: i18n.t('Nothing'),
                1: i18n.t('One thing'),
                n: i18n.t('%d things', 5)
            }), '5 things');
        });
    });

    describe(`setLanguage('fr')`, function () {
        it(`should set the language to "fr"`, function () {
            i18n.setLanguage('fr');
            chai.assert.equal(i18n.getLanguage(), 'fr');
        });
    });
});
