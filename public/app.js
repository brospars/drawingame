'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    
    'luegg.directives',

    'myApp.homeCtrl',
    'myApp.roomCtrl'
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/home'});
}]).
run(function($rootScope) {
    $rootScope.config = {
        "baseUrl" : 'http://localhost:1337' 
    };
    
    $rootScope.pseudo = 'Guest'+(Math.round(Date.now()*Math.random())%10000);
});