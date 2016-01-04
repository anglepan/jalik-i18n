# i18n : Translation for Meteor

## Introduction

This package provides an easy way to translate your apps using Meteor's reactivity,
it means that you can switch the language whenever you want and the translation will be instantly visible.

## Configuration

As of now the only setting you should provide is the default language to use.

```js
i18n.init({language: 'fr'});
```

## Getting started

The simplest use is to call the `t()` method.

```js
console.log(i18n.t("Hello World"));
```

You can also use the helper :

```html
{{t "Hello World"}}
```

## Passing variables

If your sentence contains variables, you just have to pass them as arguments of `t()` using the same order.

```js
var name = 'Karl';
var day = 'Monday';
console.log(i18n.t("Hello %s, we are %s", name, day));
```
```html
{{t "Hello %s, we are %s" name day}}
```

As there are several types of variables (int, float, string...), you can force a type of display by using the corresponding syntax.

```html
<p>{{t "This is a boolean %b" 1}}</p>
<p>{{t "This is a char code %c" 75}}</p>
<p>{{t "This is a number %d" 32}}</p>
<p>{{t "This is a scientific notation %e" 13.37}}</p>
<p>{{t "This is a float %f" 64.999992}}</p>
<p>{{t "This is a string %s" "Hello"}}</p>
<p>{{t "This is a hexadecimal %x" 3}}</p>
<p>{{t "This is a HEXADECIMAL %X" 12}}</p>
```

## Handling plurals

If you need to display different sentences depending of a quantity, you can use the following helpers and methods.

```js
var count = 3;
console.log(i18n.plural(count, {
    0: i18n.t("There is nothing"),
    1: i18n.t("There is %d thing", count),
    n: i18n.t("There is %d things", count)
}));
```

You can also use the helpers :

```html
<div>
    {{t0 count "There is nothing"}}
    {{t1 count "There is one thing"}}
    {{tn count "There is %d things" count}}
</div>
```

## Translating

Translations are defined in catalogs, you only load a catalog once during app initialization.
A catalog must define a language (ex: en, fr, es, de...) and data (the translations), it can also provide a domain
that will be used to regroup translations and avoid overriding. Setting the domain to `null` will put all translations
in a global namespace and potentially override existing translations in that domain.

```js
i18n.loadCatalog({
    domain: null,
    language: 'fr',
    data: {
        "There is nothing": "Il n'y a rien",
        "There is %d thing": "Il y a %d chose",
        "There is %d things": "Il y a %d choses"
    }
});
```

## Namespacing (using domains)

You can define your translations in a private domain to avoid collision with existing translations.

```js
i18n.loadCatalog({
    domain: 'familiar',
    language: 'fr',
    data: {
        "There is nothing": "Il n'y a rien",
        "There is %d thing": "Il y a un truc",
        "There is %d things": "Il y a %d trucs"
    }
});
```

Then pass the domain when you translate the sentence.

```js
i18n.t("There is nothing", 'familiar');
```
```html
{{t "There is nothing" domain='familiar'}}
```

## Changing the language

You can change the language globally when you want.
If there is no translation for the language you want, the original text will be displayed instead.

```js
i18n.setLanguage('fr');
// or
i18n.setLanguage('en');
```
