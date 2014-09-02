'use strict';

angular.module('app')
    .controller('HomeController', function(session) {
        if (session.loggedIn() === undefined) {
            session.autoLogin();
        }
    });