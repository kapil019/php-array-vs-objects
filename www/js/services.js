var app = angular.module('starter.services', [])

/*
 * apiManager
 * apiManager is to manage all api requests.
 * @param {type} $http
 * @param {type} $q
 * @param {type} $log
 * @param {type} $ionicLoading
 * @param {type} CONFIG
 */
app.factory('apiManager', function ($http, $q, $log, $ionicLoading, CONFIG) {
  return {
    login: function ($request) {
      $log.log("Login api request data");
      $log.log($request);
      var defer = $q.defer();
      $http.post(CONFIG.apiUrl + "booking/login?api_key=" + CONFIG.apiKey, $request).success(function (resp) {
        $log.log(resp);
        var resp = {"status": 0, "body": {"id": "7", "first_name": "Kapil", "last_name": "Chauhan", "email": "test2@test.com", "phone": "12345689", "profile_image": "http://demo.incaendo.com/webcroud/kapil/booking-api/files/img/act1.jpg", "token": "nnZYoknc", "usertype": "vendor", "code": 0}};
        defer.resolve(resp);
      }).error(function () {
        var resp = {"status": 0, "body": {"id": "7", "first_name": "Kapil", "last_name": "Chauhan", "email": "test2@test.com", "phone": "12345689", "profile_image": "http://demo.incaendo.com/webcroud/kapil/booking-api/files/img/act1.jpg", "token": "nnZYoknc", "usertype": "vendor", "code": 0}};
        defer.resolve(resp);
        $ionicLoading.hide();
        $log.error("Error in login api.");
      });
      return defer.promise;
    },
    logout: function ($request) {
      $log.log("Logout api request data");
      $log.log($request);
      var defer = $q.defer();
      $http.post(CONFIG.apiUrl + "booking/logout?api_key=" + CONFIG.apiKey, $request).success(function (resp) {
        $log.log(resp);
        defer.resolve(resp);
      }).error(function () {
        $ionicLoading.hide();
        $log.error("Error in logout api.");
      });
      return defer.promise;
    },
    signup: function ($request) {
      var defer = $q.defer();
      $http.post(CONFIG.apiUrl + "booking/register?api_key=" + CONFIG.apiKey, $request).success(function (resp) {
        $log.log(resp);
        defer.resolve(resp);
      }).error(function () {
        $ionicLoading.hide();
        $log.error("Error in signup api.");
      });
      return defer.promise;
    },
    getStateList: function () {
      var defer = $q.defer();
      $http.get(CONFIG.apiUrl + "booking/states?api_key=" + CONFIG.apiKey).success(function (resp) {
        $log.log(resp);
        defer.resolve(resp);
      }).error(function () {
        $ionicLoading.hide();
        $log.error("Error in get state list api.");
      });
      return defer.promise;
    },
    getVendorSchedule: function (vendorId, day) {
      var defer = $q.defer();
      $http.get(CONFIG.apiUrl + "booking/vendoeSchedule?vendor_id=" + vendorId + "&day=" + day + "&api_key=" + CONFIG.apiKey).success(function (resp) {
        $log.log(resp);
        defer.resolve(resp);
      }).error(function () {
        $ionicLoading.hide();
        $log.error("Error in get Vendor Schedule api.");
      });
      return defer.promise;
    },
    getProfile: function (userId) {
      var defer = $q.defer();
      $http.get(CONFIG.apiUrl + "booking/userdetails?user_id=" + userId + "&api_key=" + CONFIG.apiKey).success(function (resp) {
        $log.log(resp);
        defer.resolve(resp);
      }).error(function () {
        var resp = {"status": "200", "body": {"data": {"id": "7", "token": "nnZYoknc", "email": "test2@test.com", "password": "9810fdc1f26d399e7575f826c845fcde60424198", "first_name": "testhanu", "last_name": "hanuLast", "phone": "12345689", "city_id": "1", "state_id": "1", "pincode": "110045", "address": "test address", "latitude": "12345.55", "longitude": "2345.66", "status": "1", "group_id": "2", "category_id": "1", "dob": "0000-00-00", "newsleter": "Y", "about_me": "This is test about me", "profile_image": "1.jpg", "cover_image": "2.png", "device_id": "e345rtt66", "device_platform": "android", "creation_date": "2016-12-24 11:22:41", "last_login": "2016-12-24 11:22:41", "is_active": true}, "code": 0}};
        defer.resolve(resp);
        $ionicLoading.hide();
        $log.error("Error in get profile api.");
      });
      return defer.promise;
    },
    getCancelReason: function (_for) {
      var defer = $q.defer();
      $http.get(CONFIG.apiUrl + "booking/getCancelReason?for=" + _for + "&api_key=" + CONFIG.apiKey).success(function (resp) {
        $log.log(resp);
        defer.resolve(resp);
      }).error(function () {
        $ionicLoading.hide();
        $log.error("Error in get getCancelReason api.");
      });
      return defer.promise;
    },
    getBookingById: function (bookingId) {
      var defer = $q.defer();
      $http.get(CONFIG.apiUrl + "booking/getBookingById?book_id=" + bookingId + "&api_key=" + CONFIG.apiKey).success(function (resp) {
        $log.log(resp);
        defer.resolve(resp);
      }).error(function () {
        $ionicLoading.hide();
        $log.error("Error in get getBookingById api.");
      });
      return defer.promise;
    },
    saveVendorSchedule: function ($params) {
      var defer = $q.defer();
      $http.post(CONFIG.apiUrl + "booking/vendoeSchedule?api_key=" + CONFIG.apiKey, $params).success(function (resp) {
        $log.log(resp);
        defer.resolve(resp);
      }).error(function () {
        $ionicLoading.hide();
        $log.error("Error in save Vendor Schedule api.");
      });
      return defer.promise;
    },
    saveProfile: function ($params) {
      var defer = $q.defer();
      $http.post(CONFIG.apiUrl + "booking/saveProfile?api_key=" + CONFIG.apiKey, $params).success(function (resp) {
        $log.log(resp);
        defer.resolve(resp);
      }).error(function () {
        $ionicLoading.hide();
        $log.error("Error in save profile api.");
      });
      return defer.promise;
    },
    changePassword: function ($params) {
      var defer = $q.defer();
      $http.post(CONFIG.apiUrl + "booking/changePassword?api_key=" + CONFIG.apiKey, $params).success(function (resp) {
        $log.log(resp);
        defer.resolve(resp);
      }).error(function () {
        $ionicLoading.hide();
        $log.error("Error in change password api.");
      });
      return defer.promise;
    },
    searchVendors: function ($params) {
      var defer = $q.defer();
      $http.get(CONFIG.apiUrl + "booking/searchSeats?category_id="
//        + "&longitude=" + $params.longitude
//        + "&latitude=" + $params.latitude
//        + "&range=" + $params.range.value
//        + "&schedule=" + $params.schedule.value
        + "&page=" + $params.page
//        + "&datefor=" + $params.datefor.getFullYear() + "-" + ($params.datefor.getMonth() + 1) + "-" + $params.datefor.getDate()
        + "&api_key=" + CONFIG.apiKey, $params).success(function (resp) {

        var data = {
          status: "200",
          body: {
            data: [
              {
                id: "7",
                token: "PIXo7pSh",
                email: "test2@test.com",
                password: "9810fdc1f26d399e7575f826c845fcde60424198",
                first_name: "testhanu",
                last_name: "hanuLast",
                phone: "12345689",
                city_id: "1",
                state_id: "1",
                pincode: "110045",
                address: "test address",
                latitude: "12345.55",
                longitude: "2345.66",
                status: "1",
                group_id: "2",
                category_id: "1",
                dob: "0000-00-00",
                newsleter: "Y",
                about_me: "This is test about me",
                profile_image: "1.jpg",
                cover_image: "2.png",
                device_id: "e345rtt66",
                device_platform: "android",
                creation_date: "2016-12-24 11:22:41",
                last_login: "2016-12-24 11:22:41",
                is_active: true,
                schedule: "12-13",
                TotalSeats: "4",
                TotalBookSeats: "0",
                TotalRemainSeats: "-28",
                VendorDistance: "4831.82"
              }, {
                id: "7",
                token: "PIXo7pSh",
                email: "test2@test.com",
                password: "9810fdc1f26d399e7575f826c845fcde60424198",
                first_name: "testhanu",
                last_name: "hanuLast",
                phone: "12345689",
                city_id: "1",
                state_id: "1",
                pincode: "110045",
                address: "test address",
                latitude: "12345.55",
                longitude: "2345.66",
                status: "1",
                group_id: "2",
                category_id: "1",
                dob: "0000-00-00",
                newsleter: "Y",
                about_me: "This is test about me",
                profile_image: "act13.jpg",
                cover_image: "2.png",
                device_id: "e345rtt66",
                device_platform: "android",
                creation_date: "2016-12-24 11:22:41",
                last_login: "2016-12-24 11:22:41",
                is_active: true,
                schedule: "12-13",
                TotalSeats: "4",
                TotalBookSeats: "0",
                TotalRemainSeats: "-28",
                VendorDistance: "4831.82"
              }, {
                id: "7",
                token: "PIXo7pSh",
                email: "test2@test.com",
                password: "9810fdc1f26d399e7575f826c845fcde60424198",
                first_name: "testhanu",
                last_name: "hanuLast",
                phone: "12345689",
                city_id: "1",
                state_id: "1",
                pincode: "110045",
                address: "test address",
                latitude: "12345.55",
                longitude: "2345.66",
                status: "1",
                group_id: "2",
                category_id: "1",
                dob: "0000-00-00",
                newsleter: "Y",
                about_me: "This is test about me",
                profile_image: "1.jpg",
                cover_image: "2.png",
                device_id: "e345rtt66",
                device_platform: "android",
                creation_date: "2016-12-24 11:22:41",
                last_login: "2016-12-24 11:22:41",
                is_active: true,
                schedule: "12-13",
                TotalSeats: "4",
                TotalBookSeats: "0",
                TotalRemainSeats: "-28",
                VendorDistance: "4831.82"
              }
            ],
            code: 0
          }
        };

        defer.resolve(data);
        var data = {
          status: "200",
          body: {
            data: [
              {
                id: "7",
                token: "PIXo7pSh",
                email: "test2@test.com",
                password: "9810fdc1f26d399e7575f826c845fcde60424198",
                first_name: "testhanu",
                last_name: "hanuLast",
                phone: "12345689",
                city_id: "1",
                state_id: "1",
                pincode: "110045",
                address: "test address",
                latitude: "12345.55",
                longitude: "2345.66",
                status: "1",
                group_id: "2",
                category_id: "1",
                dob: "0000-00-00",
                newsleter: "Y",
                about_me: "This is test about me",
                profile_image: "1.jpg",
                cover_image: "2.png",
                device_id: "e345rtt66",
                device_platform: "android",
                creation_date: "2016-12-24 11:22:41",
                last_login: "2016-12-24 11:22:41",
                is_active: true,
                schedule: "12-13",
                TotalSeats: "4",
                TotalBookSeats: "0",
                TotalRemainSeats: "-28",
                VendorDistance: "4831.82"
              }, {
                id: "7",
                token: "PIXo7pSh",
                email: "test2@test.com",
                password: "9810fdc1f26d399e7575f826c845fcde60424198",
                first_name: "testhanu",
                last_name: "hanuLast",
                phone: "12345689",
                city_id: "1",
                state_id: "1",
                pincode: "110045",
                address: "test address",
                latitude: "12345.55",
                longitude: "2345.66",
                status: "1",
                group_id: "2",
                category_id: "1",
                dob: "0000-00-00",
                newsleter: "Y",
                about_me: "This is test about me",
                profile_image: "1.jpg",
                cover_image: "2.png",
                device_id: "e345rtt66",
                device_platform: "android",
                creation_date: "2016-12-24 11:22:41",
                last_login: "2016-12-24 11:22:41",
                is_active: true,
                schedule: "12-13",
                TotalSeats: "4",
                TotalBookSeats: "0",
                TotalRemainSeats: "-28",
                VendorDistance: "4831.82"
              }, {
                id: "7",
                token: "PIXo7pSh",
                email: "test2@test.com",
                password: "9810fdc1f26d399e7575f826c845fcde60424198",
                first_name: "testhanu",
                last_name: "hanuLast",
                phone: "12345689",
                city_id: "1",
                state_id: "1",
                pincode: "110045",
                address: "test address",
                latitude: "12345.55",
                longitude: "2345.66",
                status: "1",
                group_id: "2",
                category_id: "1",
                dob: "0000-00-00",
                newsleter: "Y",
                about_me: "This is test about me",
                profile_image: "1.jpg",
                cover_image: "2.png",
                device_id: "e345rtt66",
                device_platform: "android",
                creation_date: "2016-12-24 11:22:41",
                last_login: "2016-12-24 11:22:41",
                is_active: true,
                schedule: "12-13",
                TotalSeats: "4",
                TotalBookSeats: "0",
                TotalRemainSeats: "-28",
                VendorDistance: "4831.82"
              }
            ],
            code: 0
          }
        };

        defer.resolve(data);

        $log.log(resp);
        defer.resolve(resp);
      }).error(function () {

        var data = {
          status: "200",
          body: {
            data: [
              {
                id: "7",
                token: "PIXo7pSh",
                email: "test2@test.com",
                image: "../www/img/travel/act1.jpg",
                password: "9810fdc1f26d399e7575f826c845fcde60424198",
                first_name: "testhanu",
                last_name: "hanuLast",
                phone: "12345689",
                city_id: "1",
                state_id: "1",
                pincode: "110045",
                address: "test address",
                latitude: "12345.55",
                longitude: "2345.66",
                status: "1",
                group_id: "2",
                category_id: "1",
                dob: "0000-00-00",
                newsleter: "Y",
                about_me: "This is test about me",
                profile_image: "1.jpg",
                cover_image: "2.png",
                device_id: "e345rtt66",
                device_platform: "android",
                creation_date: "2016-12-24 11:22:41",
                last_login: "2016-12-24 11:22:41",
                is_active: true,
                schedule: "12-13",
                TotalSeats: "4",
                TotalBookSeats: "0",
                TotalRemainSeats: "-28",
                VendorDistance: "4831.82"
              }, {
                id: "7",
                token: "PIXo7pSh",
                image: "../www/img/travel/act2.jpg",
                email: "test2@test.com",
                password: "9810fdc1f26d399e7575f826c845fcde60424198",
                first_name: "testhanu",
                last_name: "hanuLast",
                phone: "12345689",
                city_id: "1",
                state_id: "1",
                pincode: "110045",
                address: "test address",
                latitude: "12345.55",
                longitude: "2345.66",
                status: "1",
                group_id: "2",
                category_id: "1",
                dob: "0000-00-00",
                newsleter: "Y",
                about_me: "This is test about me",
                profile_image: "1.jpg",
                cover_image: "2.png",
                device_id: "e345rtt66",
                device_platform: "android",
                creation_date: "2016-12-24 11:22:41",
                last_login: "2016-12-24 11:22:41",
                is_active: true,
                schedule: "12-13",
                TotalSeats: "4",
                TotalBookSeats: "0",
                TotalRemainSeats: "-28",
                VendorDistance: "4831.82"
              }, {
                id: "7",
                token: "PIXo7pSh",
                image: "../www/img/travel/act3.jpg",
                email: "test2@test.com",
                password: "9810fdc1f26d399e7575f826c845fcde60424198",
                first_name: "testhanu",
                last_name: "hanuLast",
                phone: "12345689",
                city_id: "1",
                state_id: "1",
                pincode: "110045",
                address: "test address",
                latitude: "12345.55",
                longitude: "2345.66",
                status: "1",
                group_id: "2",
                category_id: "1",
                dob: "0000-00-00",
                newsleter: "Y",
                about_me: "This is test about me",
                profile_image: "1.jpg",
                cover_image: "2.png",
                device_id: "e345rtt66",
                device_platform: "android",
                creation_date: "2016-12-24 11:22:41",
                last_login: "2016-12-24 11:22:41",
                is_active: true,
                schedule: "12-13",
                TotalSeats: "4",
                TotalBookSeats: "0",
                TotalRemainSeats: "-28",
                VendorDistance: "4831.82"
              }
            ],
            code: 0
          }
        }

        defer.resolve(data);
        $ionicLoading.hide();
        $log.error("Error in get search api.");
      });
      return defer.promise;
    },
    bookingListByDateRange: function ($params) {
      var defer = $q.defer();
      $http.get(CONFIG.apiUrl + "booking/bookingListByDateRange?user_id=" + $params.user_id
        + "&startdate=" + $params.startdate
        + "&enddate=" + $params.enddate
        + "&api_key=" + CONFIG.apiKey, $params).success(function (resp) {
        $log.log(resp);
        defer.resolve(resp);
      }).error(function () {
        defer.resolve(false);
        $ionicLoading.hide();
        $log.error("Error in get search api.");
      });
      return defer.promise;
    },
    getBaseSlotList: function () {
      var defer = $q.defer();
      var slots = [
        {title: "10-11 AM", value: "10-11"},
        {title: "11-12 AM", value: "11-12"},
        {title: "12-13 AM", value: "12-13"},
        {title: "13-14 AM", value: "13-14"},
        {title: "14-15 AM", value: "14-15"},
        {title: "15-16 AM", value: "15-16"},
        {title: "16-17 AM", value: "16-17"},
        {title: "17-18 AM", value: "17-18"},
        {title: "18-19 AM", value: "18-19"},
        {title: "19-20 AM", value: "19-20"},
        {title: "20-21 AM", value: "20-21"},
        {title: "21-22 AM", value: "21-22"},
        {title: "22-23 AM", value: "22-23"},
        {title: "23-24 AM", value: "23-24"}
      ];
      defer.resolve(slots);
      return defer.promise;
    },
    getDistanceList: function () {
      var defer = $q.defer();
      var distanceList = [
        {id: 1, title: "Upto 1 KM", value: 1000},
        {id: 2, title: "Upto 2 KM", value: 2000},
        {id: 3, title: "Upto 5 KM", value: 5000},
        {id: 4, title: "Upto 10 KM", value: 10000},
        {id: 5, title: "Upto  20 KM", value: 20000},
        {id: 6, title: "Upto 30 KM", vvalue: 30000},
        {id: 7, title: "Upto 50 KM", value: 50000},
        {id: 8, title: "Upto 100 KM", value: 100000},
        {id: 9, title: "Upto 500 KM", value: 5000000}
      ];
      defer.resolve(distanceList);
      return defer.promise;
    },
    getBookingCountLIst: function () {
      var defer = $q.defer();
      var counterList = [
        {title: "5 Bookings", value: 5},
        {title: "10 Bookings", value: 10},
        {title: "20 Bookings", value: 20},
        {title: "50 Bookings", value: 50},
        {title: "100 Bookings", value: 100}
      ];
      defer.resolve(counterList);
      return defer.promise;
    },
    getCityList: function ($stateId) {
      var defer = $q.defer();
      $http.get(CONFIG.apiUrl + "booking/cities?state_id=" + $stateId + "&api_key=" + CONFIG.apiKey).success(function (resp) {
        $log.log(resp);
        defer.resolve(resp);
      }).error(function () {
        $ionicLoading.hide();
        $log.error("Error in get city list api.");
      });
      return defer.promise;
    },
    createBooking: function ($params) {
      var defer = $q.defer();
      $http.post(CONFIG.apiUrl + "booking/createBooking?api_key=" + CONFIG.apiKey, $params).success(function (resp) {
        $log.log(resp);
        defer.resolve(resp);
      }).error(function () {
        $ionicLoading.hide();
        $log.error("Error in create booking api.");
      });
      return defer.promise;
    },
    updateBooking: function ($params) {
      var defer = $q.defer();
      $http.post(CONFIG.apiUrl + "booking/updateBooking?api_key=" + CONFIG.apiKey, $params).success(function (resp) {
        $log.log(resp);
        defer.resolve(resp);
      }).error(function () {
        $ionicLoading.hide();
        $log.error("Error in update booking api.");
      });
      return defer.promise;
    },
    getCategoryList: function ($request) {
      var defer = $q.defer();
      $http.post(CONFIG.apiUrl + "booking/categoryLists?api_key=" + CONFIG.apiKey, $request).success(function (resp) {
        $log.log(resp);
        defer.resolve(resp);
      }).error(function () {
        $ionicLoading.hide();
        defer.resolve(false);
        $log.error("Error in getCategoryList api.");
      });
      return defer.promise;
    },
    getProductList: function ($request) {
      var defer = $q.defer();
      $http.get(CONFIG.apiUrl + "products?api_key=" + CONFIG.apiKey, $request).success(function (resp) {
        $log.log(resp);
        defer.resolve(resp);
      }).error(function () {
        $ionicLoading.hide();
        defer.resolve(false);
        $log.error("Error in getCategoryList api.");
      });
      return defer.promise;
    },
    getUserBookingList: function ($userId, $date) {
      var defer = $q.defer();
      $http.post(CONFIG.apiUrl + "booking/userBookings?user_id=" + $userId + "&date=" + $date + "&api_key=" + CONFIG.apiKey).success(function (resp) {
        $log.log(resp);
        defer.resolve(resp);
      }).error(function () {
        $ionicLoading.hide();
        $log.error("Error in getCategoryList api.");
      });
      return defer.promise;
    },
    regidterGcm: function ($params) {
      $log.log("Inside register notification api (GCM)");
      var defer = $q.defer();
      $http.post(CONFIG.apiUrl + "registerGcm?api_key=" + CONFIG.apiKey, $params).success(function (resp) {
        $log.log(resp);
        defer.resolve(resp);
      }).error(function () {
        $ionicLoading.hide();
        $log.error("Error in gcm register api.");
      });
      return defer.promise;
    },
    updateGcm: function ($params) {
      $log.log("Inside update notification api (GCM)");
      var defer = $q.defer();
      $http.put(CONFIG.apiUrl + "registerGcm?api_key=" + CONFIG.apiKey, $params).success(function (resp) {
        $log.log(resp);
        defer.resolve(resp);
      }).error(function () {
        $ionicLoading.hide();
        $log.error("Error in gcm update api.");
      });
      return defer.promise;
    }
  };
});

/*
 * geolocationService
 * To get current position of user.
 * @param {type} $q
 * @param {type} $timeout
 */
app.factory('geolocationService', function ($q, $timeout) {
  var currentPositionCache;
  return {
    getCurrentPosition: function () {
      if (!currentPositionCache) {
        var deffered = $q.defer();
        navigator.geolocation.getCurrentPosition(function (position) {
          deffered.resolve(currentPositionCache = position);
          $timeout(function () {
            currentPositionCache = undefined;
          }, 10000);
        }, function () {
          deffered.reject();
        });
        return deffered.promise;
      }
      return $q.when(currentPositionCache);
    }
  };
});


/*
 * ionPlatform
 * @param {type} $q
 */
app.factory(("ionPlatform"), function ($q, $log) {
  var ready = $q.defer();
  ionic.Platform.ready(function (device) {
    $log.log("DEVICE READY");
    ready.resolve(device);
  });
  return {
    ready: ready.promise
  };
});


app.factory('$localStorage', function ($q) {
  if (localStorage.getItem("local_data") == null) {
    var localData = {
      id: 0,
      booking_id: null,
      user_id: "",
      user: {
        id: null,
        first_name: null,
        last_name: null,
        profile_image: null,
        email: null,
        phone: null
      },
      device_id: ""
    };
    localStorage.setItem("local_data", JSON.stringify(localData));
  }
  var local_data = JSON.parse(localStorage.getItem("local_data"));
  return {
    getUser: function () {
      return local_data.user;
    },
    setUser: function (user) {
      var defer = $q.defer();
      local_data.user = user;
      local_data.user_id = user.id;
      localStorage.setItem("local_data", JSON.stringify(local_data));
      defer.resolve();
      return defer.promise;
    },
    getUserId: function () {
      return local_data.user_id;
    },
    setUserId: function (user_id) {
      local_data.user_id = user_id;
      local_data.user.id = user_id;
      localStorage.setItem("local_data", JSON.stringify(local_data));
    },
    getOrderId: function () {
      return local_data.order_id;
    },
    setOrderId: function (order_id) {
      local_data.order_id = order_id;
      localStorage.setItem("local_data", JSON.stringify(local_data));
    },
    getDeviceId: function () {
      return local_data.device_id;
    },
    setDeviceId: function (device_id) {
      local_data.device_id = device_id;
      localStorage.setItem("local_data", JSON.stringify(local_data));
    }
  };
});


app.factory(("imageManager"), function ($q, $log, $cordovaCamera, $cordovaDevice, $cordovaFile, $ionicPopup, ionicToast, $cordovaFileTransfer, $cordovaActionSheet) {
  return {
    loadImage: function (key) {
      var options = {
        title: 'Select Image Source',
        buttonLabels: ['Load from Library', 'Use Camera'],
        addCancelButtonWithLabel: 'Cancel',
        androidEnableCancelButton: true
      };
      $cordovaActionSheet.show(options).then(function (btnIndex) {
        var type = null;
        if (btnIndex === 1) {
          type = Camera.PictureSourceType.PHOTOLIBRARY;
        } else if (btnIndex === 2) {
          type = Camera.PictureSourceType.CAMERA;
        }
        if (type !== null) {
          this.selectPicture(type, key);
        }
      });
    },
    pathForImage: function (image) {
      if (image === null) {
        return '';
      } else {
        return cordova.file.dataDirectory + image;
      }
    },
    showAlert: function (title, msg) {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: msg
      });
    },
    selectPicture: function (sourceType, key) {
      var defer = $q.defer();
      var options = {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: sourceType,
        saveToPhotoAlbum: false
      };
      $cordovaCamera.getPicture(options).then(function (imagePath) {
        // Grab the file name of the photo in the temporary directory
        var currentName = imagePath.replace(/^.*[\\\/]/, '');
        //Create a new name for the photo
        var d = new Date(),
          n = d.getTime(),
          newFileName = n + ".jpg";
        // If you are trying to load image from the gallery on Android we need special treatment!
        if ($cordovaDevice.getPlatform() == 'Android' && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
          window.FilePath.resolveNativePath(imagePath, function (entry) {
            window.resolveLocalFileSystemURL(entry, success, fail);
            function fail(e) {
              console.error('Error: ', e);
            }
            function success(fileEntry) {
              var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
              // Only copy because of access rights
              $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function (success) {
                defer.resolve({key: key, file: newFileName});
              }, function (error) {
                this.showAlert('Error', error.exception);
              });
            }
            ;
          }
          );
        } else {
          var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
          // Move the file to permanent storage
          $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function (success) {
            defer.resolve({key: key, file: newFileName});
          }, function (error) {
            this.showAlert('Error', error.exception);
          });
        }
      },
        function (err) {
          // Not always an error, maybe cancel was pressed...
        });
      return defer.promise;
    }
  },
  uploadImage = function (image) {
    if (!image || image == null) {
      ionicToast.show('Please select image.', 'middle', false, 1500);
    }
    // Destination URL
    var url = "http://localhost:80/upload.php";
    // File for Upload
    var targetPath = this.pathForImage(image);
    // File name only
    var filename = image;
    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: {'fileName': filename}
    };
    $cordovaFileTransfer.upload(url, targetPath, options).then(function (result) {
      this.showAlert('Success', 'Image upload finished.');
    });
  }
});
