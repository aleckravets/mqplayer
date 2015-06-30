'use strict';

angular.module('types', []);
angular.module('playlistManager', []);
angular.module('services', ['types', 'playlistManager']);
angular.module('directives', ['types', 'services', 'ui.slider']);


angular.module('app', [
    'ngRoute', 'directives', 'services', 'types',
    'playlistManager'
]);

angular.module('app')
    .run(function ($templateCache, $http) {
            $http.get('partials/accounts.html', { cache: $templateCache });
            $http.get('tmpl/playlistManager.html', { cache: $templateCache });
        });

