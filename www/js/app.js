// Ionic Starter App
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.config', 'ionic-toast'])
  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
      
      if (navigator.splashscreen) {
        setTimeout(function() {
          navigator.splashscreen.hide();
        }, 2000);
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(0);
    $stateProvider.state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })
      .state('app.feed', {
        url: "/feed/:cateId",
        views: {
          'menuContent': {
            templateUrl: "templates/app/feed.html",
            controller: 'FeedCtrl'
          }
        }
      })
      .state('app.home', {
        url: "/home",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "templates/home.html",
            controller: 'HomeCtrl'
          }
        }
      })
      .state('app.properties', {
        url: "/home/:type",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "templates/properties.html",
            controller: 'HomeCtrl'
          }
        }
      })
      .state('app.details', {
        url: "/details/:productId",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "templates/app/view-details.html",
            controller: 'DetailsCtrl'
          }
        }
      })
      .state('app.booking-success', {
        url: "/success/:bookingId",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "templates/app/booking_success.html",
            controller: 'BookingSuccessCtrl'
          }
        }
      })
      .state('app.editprofile', {
        url: "/editprofile",
        views: {
          'menuContent': {
            templateUrl: 'templates/app/profile-edit.html',
            controller: 'EditProfileCtrl'
          }
        }
      })

      .state('app.book-now', {
        url: '/book-now/:day',
        views: {
          'menuContent': {
            templateUrl: 'templates/book-now.html',
            controller: 'BookNowCtrl'
          }
        }
      })
      .state('app.login', {
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'templates/app/login.html',
            controller: 'LoginCtrl'
          }
        }
      })
      .state('app.signup', {
        url: '/signup',
        views: {
          'menuContent': {
            templateUrl: 'templates/app/signup.html',
            controller: 'SignupCtrl'
          }
        }
      })

      .state('app.profile', {
        url: '/profile',
        views: {
          'menuContent': {
            templateUrl: 'templates/profile.html',
            controller: 'ProfileCtrl'
          }
        }
      });
    $urlRouterProvider.otherwise('/app/home');
  }).filter('stripStrong', function () {
  return function (str) {
    str = str.replace(/<strong>/, '').replace(/<\/strong>/, '').replace(/<b>/, '').replace(/<\/b>/, '');
    var _string = str.split("<p>&nbsp;</p>").join('').replace(/<\/strong>/, '').replace(/<b>/, '').replace(/<\/b>/, '');
    return _string;
  };
});

/*global define */
angular.module('starter.config', [])
  .constant('CONFIG', {
    imageUrl: 'http://www.countryholidaysinnsuites.com/admin/upload/',
    apiKey: '341542grfyt345325326',
//    apiUrl: 'http://demo.incaendo.com/kapil/country-holiday/api/rest/api/src/v1/',
    apiUrl: 'http://www.countryholidaysinnsuites.com/rest/api/v1/index.php/',
    validators: {
      email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      password: /^.{6,12}$/,
      phone: /^[7-9][0-9]{9}$/
    },
    days: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  }
  );
