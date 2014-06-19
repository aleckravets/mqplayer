'use strict';

angular.module('types', []);
angular.module('services', ['types'])
angular.module('directives', ['types', 'services', 'ui.slider'])

angular.module('app', ['ngRoute', 'directives', 'services', 'types']);
