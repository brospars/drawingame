'use strict';

angular.module('myApp.homeCtrl', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl: 'views/homeView.html',
        controller: 'HomeCtrl'
    });
}])

.controller('HomeCtrl', function ($rootScope, $scope, $http, $location) {
    
    $scope.connectAs = function(){
        console.log($scope.formData.pseudo);
        if($scope.formData.pseudo){
            $rootScope.pseudo = $scope.formData.pseudo;
            $location.path( "/room");
        }
    }
});