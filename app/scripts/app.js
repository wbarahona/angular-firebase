'use strict';

/**
 * @ngdoc overview
 * @name angularFirebaseApp
 * @description
 * # angularFirebaseApp
 *
 * Main module of the application.
 */
angular
  .module('angularFirebaseApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase'
  ])
  .factory('authInterceptor', function ($q,$location) {
      return {
          request: function (config) {
              config.headers = config.headers || {};
              if ( !localStorage.firebaseSession && config.url === 'views/chat.html' ) {
                  $location.path('/login');
              } else {
                  config.headers.tokem = localStorage.firebaseSession;
              }
              return config;
          },
          responseError: function (response) {
              if(response.status === 401) {
                  $location.path('/login');
              }
              return $q.reject(response);
          }
      };
  })
  .config(function ($httpProvider) {
      $httpProvider.interceptors.push('authInterceptor');
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainController'
      })
      .when('/chat', {
        templateUrl: 'views/chat.html',
        controller: 'ChatController'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
      })
      .when('/logout', {
        template: 'Login out...',
        controller: 'LogoutController'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterController'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .constant('firebaseURL', 'https://vivid-heat-1154.firebaseio.com/')
  .constant('fbMessagesURL', 'https://vivid-heat-1154.firebaseio.com/messages');
