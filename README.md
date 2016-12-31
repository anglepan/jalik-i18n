# jalik:i18n

This package provides a quick and easy way to translate your Meteor apps.

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=SS78MUMW8AH4N)

## Installation

To install the package, execute this command in the root of your project :
```
meteor add jalik:i18n
```

If later you want to remove the package :
```
meteor remove jalik:i18n
```

## Getting started

First thing to do is to setup the translation engine with `i18n.init(options)`.

```js
import {i18n} from 'meteor/jalik:i18n';

i18n.init({
    lang: 'fr'
});
```

## Changing the language

To set the language, use `i18n.setLanguage(lang)`.
If the text cannot be translated, the original text will be displayed instead.

```js
import {i18n} from 'meteor/jalik:i18n';

// Set French as language
i18n.setLanguage('fr');
```

## Translating

To translate a text, use `i18n.t(text)`.

```js
import {i18n} from 'meteor/jalik:i18n';

console.log(i18n.t("Hello World"));
```

### Translating with variables

If your sentence contains variables, pass them after the text `i18n.t(text, arg1, arg2..)` keeping the same order as defined in the string.

```js
import {i18n} from 'meteor/jalik:i18n';

console.log(i18n.t("Hello %s, today is %s", 'Karl', new Date()));
```

As there are several types of variables (`int`, `float`, `string`...), you can force a type of display by using the corresponding syntax.

```js
import {i18n} from 'meteor/jalik:i18n';

console.log(i18n.t("This is a boolean %b", true));
console.log(i18n.t("This is a char code %c", 75));
console.log(i18n.t("This is a number %d", 32));
console.log(i18n.t("This is a scientific notation %e", 13.37));
console.log(i18n.t("This is a float %f", 64.999992));
console.log(i18n.t("This is a string %s", "Hello"));
console.log(i18n.t("This is a hexadecimal %x", 3));
console.log(i18n.t("This is a HEXADECIMAL %X", 12));
```

### Translating plurals

If you need to display different sentences depending of a quantity, you can use the following helpers and methods.

```js
import {i18n} from 'meteor/jalik:i18n';

const count = 3;

console.log(i18n.plural(count, {
    0: i18n.t("There is nothing"),
    1: i18n.t("There is %d thing", count),
    n: i18n.t("There is %d things", count)
}));
```

## Adding translations

Translations are defined in catalogs, you only load a catalog once during initialization.
A catalog must define a language (ex: en, fr, es, de...) and data (the translations), it can also provide a domain
that will be used to regroup translations.

Setting the domain to `null` put translations in the global namespace, so they will be used if no domain is defined.

```js
import {i18n} from 'meteor/jalik:i18n';

i18n.loadCatalog({
    domain: null,
    lang: 'fr',
    data: {
        "There is nothing": "Il n'y a rien",
        "There is %d thing": "Il y a %d chose",
        "There is %d things": "Il y a %d choses"
    }
});
```

You can define your translations in a private domain to avoid collisions with existing translations.
This way, the same original string can be translated to different results depending of the domain.

```js
import {i18n} from 'meteor/jalik:i18n';

i18n.loadCatalog({
    domain: 'my-module',
    lang: 'fr',
    data: {
        "There is nothing": "Il n'y a rien",
        "There is %d thing": "Il y a un truc",
        "There is %d things": "Il y a %d trucs"
    }
});
```

Then pass the domain when you translate the sentence.

```js
import {i18n} from 'meteor/jalik:i18n';

console.log(i18n.t("There is nothing", 'my-module'));
```

## Using template helpers

There are some template helpers you can use, but before you need to add them with `i18n.addBlazeHelpers()`.
```js
import {i18n} from 'meteor/jalik:i18n';

if (Meteor.isClient) {
    i18n.addBlazeHelpers();
}
```

And in the HTML:
```html
<!-- translate a sentence -->
<p>{{t "Hello %s" user}}</p>

<!-- handling plural -->
<div>
    {{t0 count "There is nothing"}}
    {{t1 count "There is one thing"}}
    {{tn count "There is %d things" count}}
</div>
```

## Changelog

### v0.2.0
- Uses ES6 module `import` and `export` syntax
- Adds `i18n.addBlazeHelpers()` to add template helpers for Blaze
- Adds `i18n.getLanguage()`
- Adds unit tests to eliminate bugs
- Renames the `language` option to `lang` in `i18n.init(options)`
- Renames the `language` option to `lang` in `i18n.loadCatalog(options)`

## License

This project is released under the [MIT License](http://www.opensource.org/licenses/MIT).
