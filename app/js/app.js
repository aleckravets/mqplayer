'use strict';

angular.module('types', []);
angular.module('services', ['types'])
angular.module('directives', ['types', 'services', 'ui.slider'])

angular.module('app', ['ngRoute', 'directives', 'services', 'types']);

angular.module('app')
    .run(function ($templateCache, $http) {
            $http.get('partials/accounts.html', { cache: $templateCache });
            $http.get('tmpl/playlistManager.html', { cache: $templateCache });
        });