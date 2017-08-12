// Ionic Starter App
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.config', 'ionic-toast'])
  .run(function ($ionicPlatform, $log, $ionicPopup) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

      checkConnection(false);

      function checkConnection(reload) {
        if (window.Connection) {
          $log.log(navigator.connection);
          if (navigator.connection.type == Connection.NONE || navigator.connection.type == Connection.UNKNOWN) {
            $ionicPopup.confirm({
              title: 'Network Problem',
              content: "Can't conect to network. Please check your network connection. And try again.",
              okText: 'RELOAD'
            }).then(function (result) {
              if (result) {
                checkConnection(true);
              } else {
                navigator.app.exitApp();
              }
            });
          } else {
            if (reload) {
              window.location.reload();
            }
          }
        }
      }

      if (navigator.splashscreen) {
        setTimeout(function () {
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
        cache: true,
        views: {
          'menuContent': {
            templateUrl: "templates/app/feed.html",
            controller: 'FeedCtrl'
          }
        }
      })
      .state('app.destinations', {
        url: "/destinations",
        cache: true,
        views: {
          'menuContent': {
            templateUrl: "templates/destinations.html",
            controller: 'CmsCtrl'
          }
        }
      })
      .state('app.home', {
        url: "/home",
        cache: true,
        views: {
          'menuContent': {
            templateUrl: "templates/home.html",
            controller: 'HomeCtrl'
          }
        }
      })
      .state('app.properties', {
        url: "/home/:type",
        cache: true,
        views: {
          'menuContent': {
            templateUrl: "templates/properties.html",
            controller: 'HomeCtrl'
          }
        }
      })
      .state('app.details', {
        url: "/details/:productId",
        cache: true,
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
      .state('app.cms', {
        url: "/cms/:cmsId/:title",
        cache: true,
        views: {
          'menuContent': {
            templateUrl: 'templates/app/cms.html',
            controller: 'CmsCtrl'
          }
        }
      })
      .state('app.privacy', {
        url: "/privacy",
        views: {
          'menuContent': { templateUrl: 'templates/privacy.html'}
        }
      })
      .state('app.terms', {
        url: "/terms",
        views: {
          'menuContent': { templateUrl: 'templates/terms.html'}
        }
      })
      .state('app.refundpolicy', {
        url: "/refundpolicy",
        views: {
          'menuContent': { templateUrl: 'templates/refundpolicy.html'}
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
      .state('app.membership', {
        url: '/membership/:cmsId',
        cache: true,
        views: {
          'menuContent': {
            templateUrl: 'templates/app/membership.html',
            controller: 'SignupCtrl'
          }
        }
      })
      
      .state('app.contant-us', {
        url: '/contant-us',
        cache: true,
        views: {
          'menuContent': {
            templateUrl: 'templates/app/contant-us.html',
            controller: 'ContactCtrl'
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

var appUrl = 'http://www.countryholidaysinnsuites.com/rest/api/v1/index.php/';
if (window.location.host === "demo.incaendo.com") {
  appUrl = 'http://demo.incaendo.com/kapil/country-holiday/api/rest/api/src/v1/';
}
/*global define */
angular.module('starter.config', [])
  .constant('CONFIG', {
    imageUrl: 'http://www.countryholidaysinnsuites.com/admin/upload/',
    apiKey: '341542grfyt345325326',
//    apiUrl: 'http://demo.incaendo.com/kapil/country-holiday/api/rest/api/src/v1/',
//    apiUrl: 'http://www.countryholidaysinnsuites.com/rest/api/v1/index.php/',
    apiUrl: appUrl,
    validators: {
      email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      password: /^.{6,12}$/,
      phone: /^[7-9][0-9]{9}$/
    },
    days: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  }
);
