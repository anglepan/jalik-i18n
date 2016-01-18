Package.describe({
    name: 'jalik:i18n',
    version: '0.1.1',
    author: 'karl.stein.pro@gmail.com',
    summary: 'Simple and easy translation engine',
    homepage: 'https://github.com/jalik/jalik-i18n',
    git: 'https://github.com/jalik/jalik-i18n.git',
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.2.1');
    api.use('mongo@1.1.2');
    api.use('reactive-var');
    api.use('templating@1.1.4', 'client');
    api.use('underscore');
    api.use('ecmascript@0.1.5');
    api.addFiles('i18n.js');
    api.export('i18n');
});
