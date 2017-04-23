'use strict';

var bikeApp = angular.module('bikeApp', [
    'ngRoute'
 ]);

bikeApp.run(function($rootScope, facebook) {
    $rootScope.Facebook = facebook;
});


bikeApp.factory('facebook', ['$window', function($window) {

    //get FB from the global (window) variable.
    var FB = $window.FB;

    // gripe if it's not there.
    if(!FB) throw new Error('Facebook not loaded');

    //make sure FB is initialized.
    FB.init({
        appId : '405452559812718',
        xfbml: true,
        version: 'v2.9'
    });

    return {
        // a me function
        login : function(callback) {
            FB.login(callback,{scope:'email,public_profile,user_friends'});
        },
        logout: function (callback) {
            FB.logout(callback);
        },
        friendslist: function (callback) {
            FB.api("/me",{fields: 'friends'},callback);
        },
        details: function (callback) {
            FB.api("/me",{fields: 'email,gender,name,age_range'},callback);
        }

    }
}]);

bikeApp.config(['$routeProvider','$locationProvider',
     function($routeProvider,$locationProvider) {
         $routeProvider.
             when('/', {
                 templateUrl: '/static/pages/welcome.html'
             }).
             when('/directions', {
                 templateUrl: '/static/pages/directions.html',
                 controller: 'RouteController'
             }).
             otherwise({
                 redirectTo: '/'
             });

         $locationProvider.hashPrefix('');
    }]);

bikeApp.controller('loginController',[
    '$scope','$http','facebook', function ($scope,$http,facebook) {
        $scope.beforeloginnavbar = true;
        $scope.afterloginnavbar = false;
        $scope.login = function () {
            facebook.login(function (loginData) {
                $scope.beforeloginnavbar = false;
                $scope.afterloginnavbar = true;
                facebook.details(function (details) {
                    var re_details = {};
                    re_details["name"] = details["name"];
                    re_details["age"] = parseInt(details["age_range"]["min"]);
                    re_details["gender"]  = details["gender"];
                    re_details["email_id"] = details["email"];
                    re_details["fb_id"] = details["id"];
                    var req = {
                        method: 'POST',
                        url: '/adduser',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify(re_details)
                    };
                    console.log (req);
                    $http(req).then(function (resp) {
                        console.log(resp);
                    });
                });
            });
        };
        $scope.logout = function () {
            facebook.logout(function (response) {
                console.log(response);
                $scope.beforeloginnavbar = true;
                $scope.afterloginnavbar = false;
            });
        }
    }
]);

bikeApp.controller('RouteController', function($scope, $http) {

    $scope.route = {};

    /*
    $scope.getdirections = function(){
					$http({
						method: 'POST',
						url: '/getdirections',
						data: $.param($scope.route),
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
					}).then(function(response) {
					    console.log(response);
						$scope.route = {}
					}, function(error) {
						console.log(error);
					});
	}
	*/
});