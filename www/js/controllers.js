'use strict';
angular.module('starter.controllers', [])
  .controller('AppCtrl', function ($scope, $timeout, apiManager, $localStorage, CONFIG, $rootScope, $state, $ionicLoading, ionicToast, $log) {
    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
      navIcons.addEventListener('click', function () {
        this.classList.toggle('active');
      });
    }

    $scope.enableSubMenu = false;
    $rootScope.showBackButton = true;
    $scope._enableSubMenu = function () {
      $scope.enableSubMenu = !$scope.enableSubMenu;
      $scope.enableSubMenu2 = false;
    };
    $scope.enableSubMenu2 = false;
    $scope._enableSubMenu2 = function () {
      $scope.enableSubMenu2 = !$scope.enableSubMenu2;
      $scope.enableSubMenu = false;
    };

    $scope.isUserLoggedIn = false;
    $rootScope.user = $localStorage.getUser();
    if ($localStorage.getUserId() !== null) {
      $scope.user = $localStorage.getUser();
      $ionicLoading.show();
      apiManager.getProfile($scope.user.id).then(function (resp) {
        $ionicLoading.hide();
        if (!resp.error) {
          $scope.isUserLoggedIn = true;
        }
      });
    }
    $rootScope.isUserLoggedInn = function () {
      if ($localStorage.getUserId() !== null) {
        $scope.isUserLoggedIn = true;
        return true;
      } else {
        $scope.isUserLoggedIn = false;
        return false;
      }
    };
    $scope.formData = {};
    $scope.closeModal = function () {
      if ($scope.modal) {
        $scope.modal.hide();
      }
    };

    $scope.login = function () {
      $state.go('app.login');
    };

    $scope.signup = function () {
      $state.go('app.signup');
    };

    $scope.logout = function () {
//      $ionicLoading.show();
      var $requestData = {user_id: $localStorage.getUserId(), device_id: $localStorage.getDeviceId()};
//      apiManager.logout($requestData).then(function (resp) {
//        $ionicLoading.hide();
//      });
      var details = {id: null, name: null, phone: null, email: null};
      $localStorage.setUser(details);
      $scope.isUserLoggedIn = false;
      $rootScope.isUserLoggedIn = false;
      $scope.$broadcast('logout');
      $state.go('app.home');
      $timeout(function () {
        $scope.isUserLoggedIn = false;
      }, 2);
    };
    $scope.categoryList = [];
    $scope.stateList = [];
    $scope.cityList = [];
    $scope.updateCityList = function ($stateId) {
      $ionicLoading.show();
      apiManager.getCityList($stateId).then(function (resp) {
        if (!resp.code) {
          $scope.cityList = resp.body.data;
          $ionicLoading.hide();
        }
      });
    };

  })

  .controller('ForgotCtrl', function ($scope, $ionicLoading, CONFIG, $log, ionicToast, apiManager) {
    $scope.recoverData = {
      email: null,
      api: 'forgot_pwd'
    };
    $scope.emailValidator = CONFIG.validators.email;
    $scope.tryForgot = function () {
      $scope.submitted = true;
      if (!$scope.recoverData.email || $scope.recoverData.email == null) {
        ionicToast.show('Email can not be left blank.', 'middle', false, 1500);
      } else if ($scope.recoverData.email && !$scope.emailValidator.test($scope.recoverData.email)) {
        ionicToast.show('Please enter valid email.', 'middle', false, 1500);
      } else {
        $ionicLoading.show();
        $log.log("Inside valid details");
        apiManager.forgotPassword($scope.recoverData).then(function (resp) {
          if (resp.status) {
            ionicToast.show('We have sent you  password to your registered email, Please check your email.', 'middle', false, 2000);
            $ionicLoading.hide();
          } else if (resp.message) {
            ionicToast.show(resp.message, 'middle', false, 2000);
            $ionicLoading.hide();
          } else {
            ionicToast.show('Your email is not registered, Please try with a registered email.', 'middle', false, 2000);
            $ionicLoading.hide();
          }
        });
      }
    };
  })

  .controller('Booking1Ctrl', function ($scope, $ionicLoading, $state, $rootScope, CONFIG, apiManager, $stateParams, $ionicNavBarDelegate) {
    $scope.data = {
      cityList: []
    };
    $ionicNavBarDelegate.showBackButton(true);
    $scope.imageUrl = CONFIG.imageUrl;
    $ionicLoading.show();
    apiManager.getCityList().then(function (resp) {
      $ionicLoading.hide();
      $scope.data.cityList = resp.data;
    });
    $scope.goToNextSlide = function (id) {
      $state.go('app.booking', {cityId: id, hid: $stateParams.hid});
    };
  })

  .controller('ContactFindCtrl', function ($scope, $ionicLoading, $state, $rootScope, CONFIG, apiManager, $stateParams, $ionicNavBarDelegate) {
    $scope.data = null;
    $scope.country = null;
//    $scope._state = null;
    $ionicNavBarDelegate.showBackButton(true);
    $ionicLoading.show();
    var url = "getAddressList";
    apiManager.customGet(url).then(function (resp) {
      $ionicLoading.hide();
      $scope.data = resp.data;
    });
  })

  .controller('BookingCtrl', function ($scope, $ionicLoading, CONFIG, $stateParams, $localStorage, ionicToast, apiManager, $state, $rootScope, $ionicNavBarDelegate) {
    $scope.data = {
      resporce: [],
      adults: 1,
      childs: 0,
      childAge: []
    };
    $scope.user = $localStorage.getUser();
    $ionicNavBarDelegate.showBackButton(true);
    $scope.imageUrl = CONFIG.imageUrl;
    $ionicLoading.show();
    var url = "getCityPackageList?idte_id=" + $stateParams.cityId + "&email=" + $scope.user.email;
    apiManager.customGet(url).then(function (resp) {
      $ionicLoading.hide();
      $scope.data.resporce = resp.data;
      $scope.data.selected_date = $scope.data.resporce.itenary_package[0].date_available[0];
    });
    $scope.childs = [];
    $scope.getRange = function (n) {
      $scope.childs = [];
      for (var i = 1; i <= n; i++) {
        $scope.childs.push(i);
        if (!$scope.data.childAge[i]) {
          $scope.data.childAge[i] = 1;
        }
      }
      return $scope.childs;
    };
    $scope.cinfirm = function () {
      $rootScope.booking = {
        holiday: $scope.data.resporce.itenary_package[0],
        selected_date: $scope.data.selected_date,
        adults: $scope.data.adults,
        childs: $scope.data.childs,
        childAge: $scope.data.childAge
      };
      $state.go('app.booking-confirm', {cityId: $stateParams.cityId, hid: $stateParams.hid});
    };
  })

  .controller('BookingConfirmCtrl', function ($scope, $ionicLoading, CONFIG, $stateParams, $log, ionicToast, apiManager, $rootScope, $localStorage, $ionicNavBarDelegate) {
    $scope.data = $rootScope.booking;
    $scope.imageUrl = CONFIG.imageUrl;
    $scope.user = $localStorage.getUser();
    $ionicNavBarDelegate.showBackButton(true);
    $ionicLoading.show();
    apiManager.getProfile($scope.user.id).then(function (resp) {
      $ionicLoading.hide();
      if (!resp.error) {
        resp.data.address = resp.data.address.split(",").join("<br>");
        resp.data.package_detail = resp.data.package_detail.split("FOR ").join("<br>FOR ");
        $scope.profileData = resp.data;
      }
    });
    $scope.saveBooking = function () {
      $ionicLoading.show();
      var request = {
        firstname: $scope.profileData.member_name.split(' ')[0],
        email: $scope.profileData.membership_id,
        phone: $scope.profileData.phone_no,
        amount: $scope.data.holiday.package_price,
        status: "",
        hid: $stateParams.hid,
        adults: $scope.data.adults,
        childs: $scope.data.childs,
        childAge: $scope.data.childAge,
        selected_date: $scope.data.selected_date,
        city: $scope.data.holiday.hotel_city,
        resort: $scope.data.holiday.title,
        duration: $scope.data.holiday.length_package.lenghtpackage
      };
      apiManager.createOrder(request).then(function (resp) {
        $ionicLoading.hide();
        if (!resp.error) {
          onDeviceReadyTest(resp.data.txnid);
        } else {
          ionicToast.show('Some error occured please try again later.', 'middle', false, 2000);
        }
      });
    };
  })

  .controller('ChangePwdCtrl', function ($scope, $ionicLoading, CONFIG, $log, ionicToast, apiManager, $localStorage) {
    $scope.user = $localStorage.getUser();
    var _initData = function () {
      $scope.recoverData = {
        old: null,
        new : null,
        repeat: null,
        userId: $scope.user.id
      };
    };
    _initData();
    $scope.passwordValidator = CONFIG.validators.password;
    $scope.tryForgot = function () {
      $scope.submitted = true;
      if (!$scope.recoverData.old || $scope.recoverData.old == null) {
        ionicToast.show('Old password can not be left blank.', 'middle', false, 1500);
      } else if (!$scope.recoverData.new || $scope.recoverData.new == null) {
        ionicToast.show('New password can not be left blank.', 'middle', false, 1500);
      } else if (!$scope.recoverData.repeat || $scope.recoverData.repeat == null) {
        ionicToast.show('Repeat password can not be left blank.', 'middle', false, 1500);
      } else if ($scope.recoverData.new && !$scope.passwordValidator.test($scope.recoverData.new)) {
        ionicToast.show('Passwords should be 5-12 characters long.', 'middle', false, 1500);
      } else if ($scope.recoverData.new && $scope.recoverData.new !== $scope.recoverData.repeat) {
        ionicToast.show('Repeat password did not patch to new password.', 'middle', false, 1500);
      } else {
        $ionicLoading.show();
        $log.log("Inside valid details");
        apiManager.changePassword($scope.recoverData).then(function (resp) {
          if (resp.status) {
            ionicToast.show('Your password has changed successfully.', 'middle', false, 2000);
            _initData();
            $ionicLoading.hide();
          } else if (resp.message) {
            ionicToast.show(resp.message, 'middle', false, 2000);
            $ionicLoading.hide();
          } else {
            ionicToast.show('Cound not find email.', 'middle', false, 2000);
            $ionicLoading.hide();
          }
        });
      }
    };
  })

  .controller('LoginCtrl', function ($scope, $state, $rootScope, $localStorage, apiManager, $ionicLoading, ionicToast, $log, CONFIG) {
    if ($rootScope.isUserLoggedIn) {
      $state.go('app.profile');
    }
    $scope.emailValidator = CONFIG.validators.email;
    $scope.passwordValidator = CONFIG.validators.password;
    $scope.phoneValidator = CONFIG.validators.phone;

    $scope.formData = {
      email: null,
      password: null
    };
    $scope.doLogin = function () {
      if (!$scope.formData.email || $scope.formData.email === null) {
        ionicToast.show('Please enter valid email.', 'middle', false, 1500);
      } else if ($scope.formData.email && !$scope.emailValidator.test($scope.formData.email)) {
        ionicToast.show('Please enter valid email.', 'middle', false, 1500);
      } else if (!$scope.formData.password || $scope.formData.password === null) {
        ionicToast.show('Password can not be left blank.', 'middle', false, 1500);
      } else if ($scope.formData.password && !$scope.passwordValidator.test($scope.formData.password)) {
        ionicToast.show('Passwords should be 5-12 characters long.', 'middle', false, 1500);
      } else {
        if ($scope.formData.email && $scope.formData.password) {
          $ionicLoading.show();
          $log.log("Inside valid details");
          apiManager.login($scope.formData).then(function (resp) {
            if (!resp.error) {
              $localStorage.setUser({
                id: resp.user.tlb_cms_id,
                first_name: resp.user.member_name.split(" ")[0],
                last_name: resp.user.last_name,
                name: resp.user.member_name,
                email: resp.user.membership_id,
                phone: resp.user.phone_no
              }).then(function (resp) {
                $rootScope.isUserLoggedIn = true;
                $rootScope.isUserLoggedInn();
                $rootScope.user = $localStorage.getUser();
                $ionicLoading.hide();
                $scope.$broadcast('logedin');
                $state.go('app.home');
              });
            } else {
              ionicToast.show('Could not match Email/Password, Please try with correct details.', 'middle', false, 2000);
              $ionicLoading.hide();
            }
          });
        }
      }
    };

  })

  .controller('SignupCtrl', function ($scope, $stateParams, $rootScope, $localStorage, apiManager, $ionicLoading, ionicToast, $log, CONFIG) {
    $scope.signupData = {};
    $scope.emailValidator = CONFIG.validators.email;
    $scope.passwordValidator = CONFIG.validators.password;
    $scope.phoneValidator = CONFIG.validators.phone;

    $scope.pageTitle = "Register";
    $scope.cmsData = {};
    if ($stateParams.cmsId && $stateParams.cmsId != null) {
      $scope.pageTitle = "Membership";
      $ionicLoading.show();
      apiManager.getProfile($stateParams.cmsId).then(function (resp) {
        $ionicLoading.hide();
        if (!resp.error) {
          $scope.cmsData = resp.data;
        }
      });
    }

    $scope.doSignup = function () {
      $log.log("Indide signup action");
      $scope.submitted = true;
      if (!$scope.signupData.name || $scope.signupData.name === null) {
        ionicToast.show('Name can not be left blank.', 'middle', false, 1500);
      } else if (!$scope.signupData.email) {
        ionicToast.show('Email can not be left blank.', 'middle', false, 1500);
      } else if ($scope.signupData.email && !$scope.emailValidator.test($scope.signupData.email)) {
        ionicToast.show('Please enter valid email.', 'middle', false, 1500);
      } else if (!$scope.signupData.phone || $scope.signupData.phone === null) {
        ionicToast.show('Phone can not be left blank.', 'middle', false, 1500);
      } else if ($scope.signupData.phone && !$scope.phoneValidator.test($scope.signupData.phone)) {
        ionicToast.show('Phone enter valid phone.', 'middle', false, 1500);
      } else if (!$scope.signupData.state || $scope.signupData.state === null) {
        ionicToast.show('State can not be left blank.', 'middle', false, 1500);
      } else if (!$scope.signupData.city || $scope.signupData.city === null) {
        ionicToast.show('City can not be left blank.', 'middle', false, 1500);
      } else {
        $ionicLoading.show();
        var requestParams = {
          type: $scope.pageTitle.toLowerCase(),
          from: $scope.signupData.email,
          data: $scope.signupData
        };
        apiManager.sendEmail(requestParams).then(function (resp) {
          $ionicLoading.hide();
          if (!resp.error) {
            ionicToast.show('Your request has been submitted successfully.', 'middle', false, 2000);
          } else {
            ionicToast.show('Some error occured please try again later.', 'middle', false, 2000);
          }
        });
      }
    };
  })

  .controller('ReferCtrl', function ($scope, $stateParams, $rootScope, $localStorage, apiManager, $ionicLoading, ionicToast, $log, CONFIG) {
    $scope.signupData = {};
    $scope.emailValidator = CONFIG.validators.email;
    $scope.phoneValidator = CONFIG.validators.phone;

    $scope.signupData = {
      sirName: 'Mr'
    };

    $scope.doSignup = function () {
      $log.log("Indide signup action");
      $scope.submitted = true;
      if (!$scope.signupData.name || $scope.signupData.name === null) {
        ionicToast.show('Name can not be left blank.', 'middle', false, 1500);
      } else if (!$scope.signupData.email) {
        ionicToast.show('Email can not be left blank.', 'middle', false, 1500);
      } else if ($scope.signupData.email && !$scope.emailValidator.test($scope.signupData.email)) {
        ionicToast.show('Please enter valid email.', 'middle', false, 1500);
      } else if (!$scope.signupData.phone || $scope.signupData.phone === null) {
        ionicToast.show('Phone can not be left blank.', 'middle', false, 1500);
      } else if ($scope.signupData.phone && !$scope.phoneValidator.test($scope.signupData.phone)) {
        ionicToast.show('Phone enter valid phone.', 'middle', false, 1500);
      } else if (!$scope.signupData.friendName || $scope.signupData.friendName === null) {
        ionicToast.show('Friend name can not be left blank.', 'middle', false, 1500);
      } else if (!$scope.signupData.friendPhone || $scope.signupData.friendPhone === null) {
        ionicToast.show('Friend phone can not be left blank.', 'middle', false, 1500);
      } else if (!$scope.signupData.friendState || $scope.signupData.friendState === null) {
        ionicToast.show('Friend state can not be left blank.', 'middle', false, 1500);
      } else if (!$scope.signupData.friendCity || $scope.signupData.friendCity === null) {
        ionicToast.show('Friend city can not be left blank.', 'middle', false, 1500);
      } else {
        $ionicLoading.show();
        var requestParams = {
          type: 'refer',
          from: $scope.signupData.email,
          data: $scope.signupData
        };
        apiManager.sendEmail(requestParams).then(function (resp) {
          $ionicLoading.hide();
          if (!resp.error) {
            ionicToast.show('Your request has been submitted successfully.', 'middle', false, 2000);
          } else {
            ionicToast.show('Some error occured please try again later.', 'middle', false, 2000);
          }
        });
      }
    };
  })

  .controller('FeedBackCtrl', function ($scope, apiManager, $ionicLoading, ionicToast, $log, CONFIG) {
    $scope.signupData = {};
    $scope.emailValidator = CONFIG.validators.email;
    $scope.phoneValidator = CONFIG.validators.phone;
    $scope.signupData = {
      sirName: 'Mr'
    };
    $scope.doSignup = function () {
      $log.log("Indide signup action");
      $scope.submitted = true;
      if (!$scope.signupData.name || $scope.signupData.name === null) {
        ionicToast.show('Name can not be left blank.', 'middle', false, 1500);
      } else if (!$scope.signupData.email) {
        ionicToast.show('Email can not be left blank.', 'middle', false, 1500);
      } else if ($scope.signupData.email && !$scope.emailValidator.test($scope.signupData.email)) {
        ionicToast.show('Please enter valid email.', 'middle', false, 1500);
      } else if (!$scope.signupData.phone || $scope.signupData.phone === null) {
        ionicToast.show('Phone can not be left blank.', 'middle', false, 1500);
      } else if ($scope.signupData.phone && !$scope.phoneValidator.test($scope.signupData.phone)) {
        ionicToast.show('Phone enter valid phone.', 'middle', false, 1500);
      } else if (!$scope.signupData.address || $scope.signupData.address === null) {
        ionicToast.show('Address can not be left blank.', 'middle', false, 1500);
      } else if (!$scope.signupData.feedbackType || $scope.signupData.feedbackType === null) {
        ionicToast.show('Please select feedback type.', 'middle', false, 1500);
      } else if (!$scope.signupData.remark || $scope.signupData.remark === null) {
        ionicToast.show('Remark can not be left blank.', 'middle', false, 1500);
      } else {
        $ionicLoading.show();
        var requestParams = {
          type: 'feedback',
          from: $scope.signupData.email,
          data: $scope.signupData
        };
        apiManager.sendEmail(requestParams).then(function (resp) {
          $ionicLoading.hide();
          if (!resp.error) {
            ionicToast.show('Your request has been submitted successfully.', 'middle', false, 2000);
          } else {
            ionicToast.show('Some error occured please try again later.', 'middle', false, 2000);
          }
        });
      }
    };
  })

  .controller('PaymentCtrl', function ($scope, apiManager, $ionicLoading, ionicToast, $log, CONFIG, $ionicNavBarDelegate) {
    $scope.signupData = {};
    $scope.emailValidator = CONFIG.validators.email;
    $scope.phoneValidator = CONFIG.validators.phone;
    $scope.signupData = {
      sirName: 'Mr'
    };

    $ionicNavBarDelegate.showBackButton(true);

    $scope.doSignup = function () {
      $log.log("Indide signup action");
      $scope.submitted = true;
      if (!$scope.signupData.name || $scope.signupData.name === null) {
        ionicToast.show('Name can not be left blank.', 'middle', false, 1500);
      } else if (!$scope.signupData.email) {
        ionicToast.show('Email can not be left blank.', 'middle', false, 1500);
      } else if ($scope.signupData.email && !$scope.emailValidator.test($scope.signupData.email)) {
        ionicToast.show('Please enter valid email.', 'middle', false, 1500);
      } else if (!$scope.signupData.phone || $scope.signupData.phone === null) {
        ionicToast.show('Phone can not be left blank.', 'middle', false, 1500);
      } else if ($scope.signupData.phone && !$scope.phoneValidator.test($scope.signupData.phone)) {
        ionicToast.show('Phone enter valid phone.', 'middle', false, 1500);
      } else if (!$scope.signupData.paymentType || $scope.signupData.paymentType === null) {
        ionicToast.show('Please select payment type.', 'middle', false, 1500);
      } else if (!$scope.signupData.address || $scope.signupData.address === null) {
        ionicToast.show('Address can not be left blank.', 'middle', false, 1500);
      } else if (!$scope.signupData.state || $scope.signupData.state === null) {
        ionicToast.show('State can not be left blank.', 'middle', false, 1500);
      } else if (!$scope.signupData.city || $scope.signupData.city === null) {
        ionicToast.show('City can not be left blank.', 'middle', false, 1500);
      } else if (!$scope.signupData.amount || $scope.signupData.amount === null) {
        ionicToast.show('Amount can not be left blank.', 'middle', false, 1500);
      } else {
        $ionicLoading.show();
        $scope.signupData.status = "";
        $scope.signupData.firstname = $scope.signupData.name.split(' ')[0];
        apiManager.createOrder($scope.signupData).then(function (resp) {
          $ionicLoading.hide();
          if (!resp.error) {
            onDeviceReadyTest(resp.data.txnid);
          } else {
            ionicToast.show('Some error occured please try again later.', 'middle', false, 2000);
          }
        });
      }
    };
  })

  .controller('HolidayFeedBackCtrl', function ($scope, apiManager, $ionicLoading, ionicToast, $log, CONFIG) {
    $scope.signupData = {};
    $scope.emailValidator = CONFIG.validators.email;
    $scope.phoneValidator = CONFIG.validators.phone;
    $scope.hotells = [
      "A.D. Condominium Hyatt, Pattaya, Thailand",
      "Sai Motels, Auckland",
      "United-21 Nature Paradise, Bhimtal",
      "The Georgian Resort, NY",
      "United-21 Resort, Chail",
      "Clarion Inn, Hudson, Ohio",
      "Baymont Inn and Suite, NC",
      "United-21 Wildlife Resort, Corbett",
      "Graciano Cottages, Goa",
      "United 21, Thane",
      "United-21 Grassland, Kaziranga",
      "Panoramic Resort , Karnala",
      "United-21 Resort, Kodaikanal",
      "Sai Sahavas, Shirdi",
      "Sagar Kinara, Malvan",
      "United-21 Resort, Mahableshwar",
      "United-21 Hotel, Mysore",
      "United-21 Paradise, Ooty",
      "United 21 Tiger Camp Resort, Tadoba",
      "Global Residence, Singapore",
      "United-21 Lake City Resort, Udaipur",
      "United-21 Retreat, Lonavala",
      "United 21, Hyderabad",
      "Patong Tower, Phuket",
      "United-21 Tiger's Habitat, Kanha",
      "Econolodge, USA (Burlington, North Carolina)",
      "UNITED-21, Vanvaso Gir, Gujarat",
      "Regal Palms Resort development, USA (Orlando Florida)",
      "United 21 Emerald Resort, Varca Goa",
      "United 21- Citymark, Gurgaon",
      "United 21 DAMAC Masion Cour Jardin, Dubai, United Arab Emirates"
    ];
    $scope.signupData = {
      sirName: 'Mr'
    };
    $scope.doSignup = function () {
      $log.log("Indide signup action");
      $scope.submitted = true;
      if (!$scope.signupData.name || $scope.signupData.name === null) {
        ionicToast.show('Name can not be left blank.', 'middle', false, 1500);
      } else if (!$scope.signupData.email) {
        ionicToast.show('Email can not be left blank.', 'middle', false, 1500);
      } else if ($scope.signupData.email && !$scope.emailValidator.test($scope.signupData.email)) {
        ionicToast.show('Please enter valid email.', 'middle', false, 1500);
      } else if (!$scope.signupData.phone || $scope.signupData.phone === null) {
        ionicToast.show('Phone can not be left blank.', 'middle', false, 1500);
      } else if ($scope.signupData.phone && !$scope.phoneValidator.test($scope.signupData.phone)) {
        ionicToast.show('Phone enter valid phone.', 'middle', false, 1500);
      } else if (!$scope.signupData.hotel || $scope.signupData.hotel === null) {
        ionicToast.show('Please select hotel.', 'middle', false, 1500);
      } else if (!$scope.signupData.scheme || $scope.signupData.scheme === null) {
        ionicToast.show('Scheme can not be left blank.', 'middle', false, 1500);
      } else {
        $ionicLoading.show();
        var requestParams = {
          type: 'holiday-feedback',
          from: $scope.signupData.email,
          data: $scope.signupData
        };
        apiManager.sendEmail(requestParams).then(function (resp) {
          $ionicLoading.hide();
          if (!resp.error) {
            ionicToast.show('Your request has been submitted successfully.', 'middle', false, 2000);
          } else {
            ionicToast.show('Some error occured please try again later.', 'middle', false, 2000);
          }
        });
      }
    };
  })

  .controller('RequestCtrl', function ($scope, $stateParams, $rootScope, $localStorage, apiManager, $ionicLoading, ionicToast, $log, CONFIG) {
    $scope.signupData = {};
    $scope.emailValidator = CONFIG.validators.email;
    $scope.phoneValidator = CONFIG.validators.phone;
    $scope.signupData = {
      sirName: 'Mr',
      email: null
    };
    $scope.doSignup = function () {
      $log.log("Indide signup action");
      $scope.submitted = true;
      if (!$scope.signupData.name || $scope.signupData.name === null) {
        ionicToast.show('Name can not be left blank.', 'middle', false, 1500);
      } else if (!$scope.signupData.email || $scope.signupData.email === null) {
        ionicToast.show('Email can not be left blank.', 'middle', false, 1500);
      } else if ($scope.signupData.email && !$scope.emailValidator.test($scope.signupData.email)) {
        ionicToast.show('Please enter valid email.', 'middle', false, 1500);
      } else if (!$scope.signupData.phone || $scope.signupData.phone === null) {
        ionicToast.show('Phone can not be left blank.', 'middle', false, 1500);
      } else if ($scope.signupData.phone && !$scope.phoneValidator.test($scope.signupData.phone)) {
        ionicToast.show('Phone enter valid phone.', 'middle', false, 1500);
      } else if (!$scope.signupData.address || $scope.signupData.address === null) {
        ionicToast.show('Address can not be left blank.', 'middle', false, 1500);
      } else if (!$scope.signupData.feedbackType || $scope.signupData.feedbackType === null) {
        ionicToast.show('Please select feedback type.', 'middle', false, 1500);
      } else if (!$scope.signupData.feedbackType || $scope.signupData.feedbackType === null) {
        ionicToast.show('City can not be left blank.', 'middle', false, 1500);
      } else {
        $ionicLoading.show();
        var requestParams = {
          type: 'request',
          from: $scope.signupData.email,
          data: $scope.signupData
        };
        apiManager.sendEmail(requestParams).then(function (resp) {
          $ionicLoading.hide();
          if (!resp.error) {
            ionicToast.show('Your request has been submitted successfully.', 'middle', false, 2000);
          } else {
            ionicToast.show('Some error occured please try again later.', 'middle', false, 2000);
          }
        });
      }
    };
  })

  .controller('BookHolidayCtrl', function ($scope, $stateParams, $rootScope, $localStorage, apiManager, $ionicLoading, ionicToast, $log, CONFIG) {
    $scope.signupData = {};
    $scope.emailValidator = CONFIG.validators.email;
    $scope.phoneValidator = CONFIG.validators.phone;
    $scope.signupData = {
      sirName: 'Mr',
      email: null
    };

    if ($rootScope.cmsData2 && $rootScope.cmsData2 !== null) {
      $scope.cmsData = $rootScope.cmsData2;
    } else {
      $ionicLoading.show();
      apiManager.getCmsData(10).then(function (resp) {
        $ionicLoading.hide();
        if (!resp.error) {
          $scope.cmsData = resp.data;
          $rootScope.cmsData2 = $scope.cmsData;
        }
      });
    }

    $scope.doSignup = function () {
      $log.log("Indide signup action");
      $scope.submitted = true;
      if (!$scope.signupData.isMember && (!$scope.signupData.name || $scope.signupData.name === null)) {
        ionicToast.show('Name can not be left blank.', 'middle', false, 1500);
      } else if (!$scope.signupData.isMember && (!$scope.signupData.email || $scope.signupData.email === null)) {
        ionicToast.show('Email can not be left blank.', 'middle', false, 1500);
      } else if (!$scope.signupData.isMember && ($scope.signupData.email && !$scope.emailValidator.test($scope.signupData.email))) {
        ionicToast.show('Please enter valid email.', 'middle', false, 1500);
      } else if (!$scope.signupData.isMember && (!$scope.signupData.phone || $scope.signupData.phone === null)) {
        ionicToast.show('Phone can not be left blank.', 'middle', false, 1500);
      } else if (!$scope.signupData.isMember && ($scope.signupData.phone && !$scope.phoneValidator.test($scope.signupData.phone))) {
        ionicToast.show('Phone enter valid phone.', 'middle', false, 1500);
      } else if ($scope.signupData.isMember && !$scope.signupData.membershipId || $scope.signupData.membershipId === null) {
        ionicToast.show('Membership Id not be left blank.', 'middle', false, 1500);
      } else if (!$scope.signupData.nightOfUtilise || $scope.signupData.nightOfUtilise === null) {
        ionicToast.show('Please select Night Of Utilise.', 'middle', false, 1500);
      } else if (!$scope.signupData.option1CheckIn || $scope.signupData.option1CheckIn === null) {
        ionicToast.show('Option1 Check In not be left blank.', 'middle', false, 1500);
      } else if (!$scope.signupData.option1CheckOut || $scope.signupData.option1CheckOut === null) {
        ionicToast.show('Option1 Check Out not be left blank.', 'middle', false, 1500);
      } else {
        $ionicLoading.show();
        var requestParams = {
          type: 'bookHoliday',
          from: $scope.signupData.email,
          data: $scope.signupData
        };
        apiManager.sendEmail(requestParams).then(function (resp) {
          $ionicLoading.hide();
          if (!resp.error) {
            ionicToast.show('Your request has been submitted successfully.', 'middle', false, 2000);
          } else {
            ionicToast.show('Some error occured please try again later.', 'middle', false, 2000);
          }
        });
      }
    };
  })

  .controller('ContactCtrl', function ($scope, $rootScope, apiManager, $ionicLoading, ionicToast, $log, CONFIG, $ionicNavBarDelegate) {
    $scope.signupData = {};
    $scope.emailValidator = CONFIG.validators.email;
    $scope.passwordValidator = CONFIG.validators.password;
    $scope.phoneValidator = CONFIG.validators.phone;
    $ionicNavBarDelegate.showBackButton(true);
    $scope.doSignup = function () {
      $log.log("Indide signup action");
      $scope.submitted = true;
      if (!$scope.signupData.name || $scope.signupData.name === null) {
        ionicToast.show('Name can not be left blank.', 'middle', false, 1500);
      } else if (!$scope.signupData.email || $scope.signupData.email === null) {
        ionicToast.show('Email can not be left blank.', 'middle', false, 1500);
      } else if ($scope.signupData.email && !$scope.emailValidator.test($scope.signupData.email)) {
        ionicToast.show('Please enter valid email.', 'middle', false, 1500);
      } else if (!$scope.signupData.phone || $scope.signupData.phone === null) {
        ionicToast.show('Phone can not be left blank.', 'middle', false, 1500);
      } else if ($scope.signupData.phone && !$scope.phoneValidator.test($scope.signupData.phone)) {
        ionicToast.show('Phone enter valid phone.', 'middle', false, 1500);
      } else if (!$scope.signupData.subject || $scope.signupData.subject === null) {
        ionicToast.show('Subject can not be left blank.', 'middle', false, 1500);
      } else if (!$scope.signupData.message || $scope.signupData.message === null) {
        ionicToast.show('Message can not be left blank.', 'middle', false, 1500);
      } else {
        $ionicLoading.show();
        var requestParams = {
          type: 'contact',
          from: $scope.signupData.email,
          data: $scope.signupData
        };
        apiManager.sendEmail(requestParams).then(function (resp) {
          $ionicLoading.hide();
          if (!resp.error) {
            ionicToast.show('Your request has been submitted successfully.', 'middle', false, 2000);
          } else {
            ionicToast.show('Some error occured please try again later.', 'middle', false, 2000);
          }
        });
      }
    };

  })

  /*
   * HOME CONTROLLER
   * @param {type} $scope
   * @param {type} $timeout
   * @param {type} apiManager
   * @returns {undefined}
   */
  .controller('HomeCtrl', function ($scope, $stateParams, $rootScope, apiManager, $ionicLoading, CONFIG, $ionicNavBarDelegate) {
    $scope.categoryList = [];
    $scope.imageUrl = CONFIG.imageUrl;
    $ionicNavBarDelegate.showBackButton(false);
    if ($rootScope.productList && $rootScope.productList !== null) {
      $scope.productList = $rootScope.productList;
    } else {
      $ionicLoading.show();
      apiManager.getProductList($stateParams.type).then(function (resp) {
        if (resp.error === false) {
          $ionicLoading.hide();
          $scope.productList = resp.products;
          $rootScope.productList = $scope.productList;
          $ionicLoading.hide();
        }
      });
    }
  })

  .controller('ProfileCtrl', function ($scope, $localStorage, $rootScope, $state, $ionicLoading, apiManager) {
    $scope.profileData = {};
    $scope.user = $localStorage.getUser();
//    if (!$rootScope.isUserLoggedIn) {
//      $state.go('app.home');
//    }
    $ionicLoading.show();
    apiManager.getProfile($scope.user.id).then(function (resp) {
      $ionicLoading.hide();
      if (!resp.error) {
        resp.data.address = resp.data.address.split(",").join("<br>");
        resp.data.package_detail = resp.data.package_detail.split("FOR ").join("<br>FOR ");
        $scope.profileData = resp.data;
      }
    });
  })

  .controller('AmcCtrl', function ($scope, $localStorage, $rootScope, $state, $ionicLoading, apiManager, ionicToast) {
    $scope.amcData = {};
    $scope.user = $localStorage.getUser();
    $ionicLoading.show();
    var url = "getAmcDAta?email=" + $scope.user.email;
    apiManager.customGet(url).then(function (resp) {
      $ionicLoading.hide();
      $scope.amcData = resp.data;
    });

    $scope.payNow = function () {
      $ionicLoading.show();
      var data = {};
      data.firstname = $scope.user.first_name;
      data.email = $scope.user.email;
      data.phone = $scope.user.phone;
      data.amount = $scope.amcData.drTtotal - $scope.amcData.crTtotal;
      //"firstname", "email", "phone", "amount"
      apiManager.createOrder(data).then(function (resp) {
        $ionicLoading.hide();
        if (!resp.error) {
          onDeviceReadyTest(resp.data.txnid);
        } else {
          ionicToast.show('Some error occured please try again later.', 'middle', false, 2000);
        }
      });
    };
  })

  .controller('MembershipFeeCtrl', function ($scope, $localStorage, $rootScope, $state, $ionicLoading, apiManager, ionicToast) {
    $scope.amcData = {};
    $scope.user = $localStorage.getUser();
    $ionicLoading.show();
    var url = "getMembershipData?email=" + $scope.user.email;
    apiManager.customGet(url).then(function (resp) {
      $ionicLoading.hide();
      $scope.amcData = resp.data;
    });

    $scope.payNow = function () {
      $ionicLoading.show();
      var data = {};
      data.firstname = $scope.user.first_name;
      data.email = $scope.user.email;
      data.phone = $scope.user.phone;
      data.amount = $scope.amcData.drTtotal - $scope.amcData.crTtotal;
      //"firstname", "email", "phone", "amount"
      apiManager.createOrder(data).then(function (resp) {
        $ionicLoading.hide();
        if (!resp.error) {
          onDeviceReadyTest(resp.data.txnid);
        } else {
          ionicToast.show('Some error occured please try again later.', 'middle', false, 2000);
        }
      });
    };
  })

  .controller('HolidaysCtrl', function ($scope, $localStorage, $rootScope, $state, $ionicLoading, apiManager) {
    $scope.profileData = {};
    $scope.user = $localStorage.getUser();
    $ionicLoading.show();
    apiManager.getHolidays($scope.user.email).then(function (resp) {
      $ionicLoading.hide();
      if (!resp.error) {
        $scope.profileData = resp.data;
      }
    });
  })

  .controller('RedeemCtrl', function ($scope, $localStorage, $rootScope, $state, $ionicLoading, apiManager, ionicToast) {
    $scope.profileData = {};
    $scope.redeemUser = null;
    $scope.data = {};
    $scope.user = $localStorage.getUser();
    if ($rootScope.redeemUser && $rootScope.redeemUser !== null) {
      $scope.redeemUser = $rootScope.redeemUser;
    }
    $scope.getVoucher = function () {
      if (!$scope.data.voucherCode || $scope.data.voucherCode == null) {
        ionicToast.show('Please enter coucher code', 'middle', false, 1500);
      } else {
        $ionicLoading.show();
        var url = "getVoucherDetails?voucher_no=" + $scope.data.voucherCode;
        apiManager.customGet(url).then(function (resp) {
          $ionicLoading.hide();
          if (resp.data && resp.data.voucher && resp.data.voucher !== null) {
            $rootScope.redeemUser = resp.data.voucher;
            $scope.redeemUser = resp.data.voucher;
          } else {
            ionicToast.show('This voucher code is not valid', 'middle', false, 1500);
          }
        }).error(function (resp){
          ionicToast.show('This voucher code is not valid', 'middle', false, 1500);
        });
      }
    };
    $scope.goToNextSlide = function () {
      if (!$scope.data.selectedLocation || $scope.data.selectedLocation == null) {
        ionicToast.show('Please select Location', 'middle', false, 1500);
      } else {
        $state.go('app.redeem2', {location: $scope.data.selectedLocation.id, voucher:$scope.data.voucherCode});
      }
    };
  })
  
  .controller('Redeem2Ctrl', function ($scope, $localStorage, $stateParams, $state, $ionicLoading, apiManager, ionicToast, $ionicNavBarDelegate, CONFIG) {
    $scope.location = $stateParams.location
    $scope.data = {};
    $scope.imageUrl = CONFIG.imageUrl2;
    $scope.redeemUser = null
    $ionicNavBarDelegate.showBackButton(true);
    $scope.user = $localStorage.getUser();
    $ionicLoading.show();
    var url = "getVoucherDetails?voucher_no=" + $stateParams.voucher;
    apiManager.customGet(url).then(function (resp) {
      $ionicLoading.hide();
      $scope.redeemUser = resp.data.voucher;
    });
    var url = "getCityPackageList2?location=" + $scope.location;
    apiManager.customGet(url).then(function (resp) {
      $ionicLoading.hide();
      $scope.data.response = resp;
    });

    $scope.saveBooking = function () {
      if (!$scope.data.selected_date || $scope.data.selected_date == null) {
        ionicToast.show('Please select check in date.', 'middle', false, 2000);
      } else {
        $ionicLoading.show();
        var request = {
          firstname: $scope.redeemUser.name.split(' ')[0],
          email: $scope.redeemUser.email,
          phone: $scope.redeemUser.phoneno,
          amount: 3000,
          status: "",
          nid: $stateParams.voucher,
          voucherCode: $stateParams.voucher,
          check_id: $scope.data.selected_date.start_date,
          check_out: $scope.data.selected_date.end_date,
          city: $scope.location
        };
        apiManager.createOrder(request).then(function (resp) {
          $ionicLoading.hide();
          if (!resp.error) {
            onDeviceReadyTest(resp.data.txnid);
          } else {
            ionicToast.show('Some error occured please try again later.', 'middle', false, 2000);
          }
        });
      }
    };
  })

  .controller('CmsCtrl', function ($scope, $stateParams, $rootScope, CONFIG, $ionicLoading, apiManager) {
    $scope.cmsData = {};
    if ($stateParams.title && $stateParams.title != null) {
      $scope.pageTitle = $stateParams.title;
    } else {
      $scope.pageTitle = "About Us";
    }

    $scope.activeTab = 'location';
    $scope.selectTab = function (tab) {
      $scope.activeTab = tab;
    };

    if ($stateParams.cmsId) {
      if (!$rootScope.cmsData) {
        $rootScope.cmsData = {};
      }
      if ($rootScope.cmsData && $rootScope.cmsData[$stateParams.cmsId] && $rootScope.cmsData[$stateParams.cmsId] !== null) {
        $scope.cmsData = $rootScope.cmsData[$stateParams.cmsId];
      } else {
        $ionicLoading.show();
        apiManager.getProfile($stateParams.cmsId).then(function (resp) {
          $ionicLoading.hide();
          if (!resp.error) {
            $scope.cmsData = resp.data;
            $rootScope.cmsData[$stateParams.cmsId] = $scope.cmsData;
          }
        });
      }
    }
  })

  .controller('AppartmentsCtrl', function ($scope, $stateParams, $rootScope, CONFIG, $ionicLoading, apiManager) {
    $scope.cmsData = {};
    $scope.imageUrl = CONFIG.imageUrl;
    if ($rootScope.cmsData5 && $rootScope.cmsData5 !== null) {
      $scope.cmsData = $rootScope.cmsData5;
    } else {
      $ionicLoading.show();
      apiManager.getAppartments($stateParams.cmsId).then(function (resp) {
        $ionicLoading.hide();
        if (!resp.error) {
          $scope.cmsData = resp.data;
          $rootScope.cmsData5 = $scope.cmsData;
        }
      });
    }
  })

  .controller('EditProfileCtrl', function ($scope, $timeout, ionicToast, apiManager, $log, $ionicLoading, $localStorage, CONFIG) {
    $scope.profileData = {};
    $scope.user = $localStorage.getUser();

    $scope.emailValidator = CONFIG.validators.email;
    $scope.passwordValidator = CONFIG.validators.password;
    $scope.phoneValidator = CONFIG.validators.phone;

    $scope.stateList = [];
    $scope.cityList = [];
    apiManager.getProfile($scope.user.id).then(function (resp) {
      if (!resp.code) {
        $scope.profileData = resp.body.data;
        apiManager.getStateList().then(function (resp) {
          if (!resp.code) {
            $scope.stateList = resp.body.data;
            for (var i = 0; i < $scope.stateList.length; i++) {
              var state = $scope.stateList[i];
              if (state.id === $scope.profileData.state_id) {
                $scope.profileData.state = state;
              }
            }
            $scope.updateCityList($scope.profileData.state_id);
          }
        });
      }
    });

    $scope.updateCityList = function ($stateId) {
      $ionicLoading.show();
      apiManager.getCityList($stateId).then(function (resp) {
        if (!resp.code) {
          $scope.cityList = resp.body.data;
          for (var i = 0; i < $scope.cityList.length; i++) {
            var city = $scope.cityList[i];
            if (city.id === $scope.profileData.city_id) {
              $scope.profileData.city = city;
            }
          }
          $ionicLoading.hide();
        }
      });
    };

    $scope.saveProfile = function () {
      $log.log("Indide profile action");
      $scope.submitted = true;
      if (!$scope.profileData.first_name || $scope.profileData.first_name === null) {
        ionicToast.show('Name can not be left blank.', 'middle', false, 1500);
      } else if (!$scope.profileData.phone || $scope.profileData.phone === null) {
        ionicToast.show('Phone can not be left blank.', 'middle', false, 1500);
      } else if ($scope.profileData.phone && !$scope.phoneValidator.test($scope.profileData.phone)) {
        ionicToast.show('Phone enter valid phone.', 'middle', false, 1500);
      } else if (!$scope.profileData.state || $scope.profileData.state === null) {
        ionicToast.show('Please select user state', 'middle', false, 1500);
      } else if (!$scope.profileData.city || $scope.profileData.city === null) {
        ionicToast.show('Please select user city', 'middle', false, 1500);
      } else if (!$scope.profileData.pincode || $scope.profileData.pincode === null) {
        ionicToast.show('Please enter your pincode', 'middle', false, 1500);
      } else if ($scope.profileData.group === 2 && (!$scope.profileData.business_title || $scope.profileData.business_title === null)) {
        ionicToast.show('Please enter your Business title', 'middle', false, 1500);
      } else {
        $ionicLoading.show();
        $log.log("Inside valid details");
        $scope.profileData.city_id = $scope.profileData.city.id;
        $scope.profileData.state_id = $scope.profileData.state.id;
        $scope.profileData.category_id = $scope.profileData.category.id;
        apiManager.saveProfile($scope.profileData).then(function (resp) {
          if (resp.status) {
            ionicToast.show('Your profile has been saved successfully.', 'middle', false, 2000);
          } else {
            ionicToast.show('Some error occured, Please try again.', 'middle', false, 2000);
          }
          $ionicLoading.hide();
        });
      }
    };

    $scope.resetPasswordData = {};
    $scope.changePassword = function () {
      $log.log("Indide profile action");
      $scope.submitted = true;
      if (!$scope.profileData.old_password || $scope.profileData.old_password === null) {
        ionicToast.show('Password can not be left blank.', 'middle', false, 1500);
      } else if ($scope.profileData.old_password && !$scope.passwordValidator.test($scope.old_password.password)) {
        ionicToast.show('Passwords should be 5-12 characters long.', 'middle', false, 1500);
      } else if (!$scope.profileData.new_password || $scope.profileData.new_password === null) {
        ionicToast.show('Password can not be left blank.', 'middle', false, 1500);
      } else if ($scope.profileData.new_password && !$scope.passwordValidator.test($scope.profileData.new_password)) {
        ionicToast.show('Passwords should be 5-12 characters long.', 'middle', false, 1500);
      } else if (!$scope.profileData.repeat_password || $scope.profileData.repeat_password === null) {
        ionicToast.show('Password can not be left blank.', 'middle', false, 1500);
      } else if ($scope.profileData.repeat_password && !$scope.passwordValidator.test($scope.profileData.repeat_password)) {
        ionicToast.show('Passwords should be 5-12 characters long.', 'middle', false, 1500);
      } else if ($scope.profileData.new_password !== $scope.profileData.repeat_password) {
        ionicToast.show('Confirm password did not match.', 'middle', false, 1500);
      } else {
        $ionicLoading.show();
        $log.log("Inside valid details");
        apiManager.changePassword($scope.resetPasswordData).then(function (resp) {
          if (resp.status) {
            ionicToast.show('Your password has been changed successfully.', 'middle', false, 2000);
          } else {
            ionicToast.show('Some error occured, Please try again.', 'middle', false, 2000);
          }
          $ionicLoading.hide();
        });
      }
    };

  })

  /*
   * Feed Controller,
   * @author Kapil Chauhan <kkchauhan019@gmail.com>
   */
  .controller('PropertiesCtrl', function ($scope, $stateParams, CONFIG, apiManager, $state, $ionicLoading, ionicToast, $localStorage, $rootScope) {
    $scope.user = $localStorage.getUser();

    $scope.imageUrl = CONFIG.imageUrl;
    $scope.search = {
      page: 1,
      destination: "",
      upcommingProperty: ""
    };

    $scope.setProperty = function (set, reset) {
      if ($scope.search[set] && $scope.search[set] != "") {
        $scope.search[reset] = "";
      }
      $scope.updateSearchResult();
    };

    $scope.productList = [];
    $scope.updateSearchResult = function () {
      $ionicLoading.show();
      $scope.search.page = 1;
      $scope.pagination = true;
      $scope.productList = [];
      $scope.$broadcast('scroll.infiniteScrollComplete');
      apiManager.searchVendors($scope.search).then(function (resp) {
        if (!resp.error) {
          $scope.search.page = $scope.search.page + 1;
          $scope.productList = resp.products;
        }
        $ionicLoading.hide();
      });
    };

    $scope.updateSearchResult();
    $scope.pagination = true;
    $scope.busy = false;
    $scope.loadMore = function () {
      if ($scope.search.page && $scope.pagination && !$scope.busy) {
        $scope.busy = true;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        apiManager.searchVendors($scope.search).then(function (resp) {
          $scope.busy = false;
          if (!resp.error && resp.products && resp.products.length > 0) {
            $scope.search.page = $scope.search.page + 1;
            resp.products.forEach(function (newItem) {
              $scope.productList.push(newItem);
            });
            $scope.$broadcast('scroll.infiniteScrollComplete');
          } else {
            $scope.pagination = false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        });
      }
    };
  })

  .controller('DetailsCtrl', function ($scope, $stateParams, $timeout, $state, apiManager, CONFIG, $ionicSlideBoxDelegate, $ionicNavBarDelegate, $ionicLoading) {
    // Activate ink for controller

    $ionicNavBarDelegate.showBackButton(true);
    $scope.goToBook = function () {
      $state.go("app.book-now");
    };
    $scope.imageUrl = CONFIG.imageUrl;
    $scope.activeTab = 'location';
    $scope.enableSlide = false;
    $timeout(function () {
      $ionicSlideBoxDelegate.update();
    }, 100);

    $scope.selectTab = function (tab) {
      $scope.activeTab = tab;
    };

    $ionicLoading.show();
    apiManager.getProductDetail($stateParams.productId).then(function (resp) {
      $ionicLoading.hide();
      if (resp.error === false) {
        $scope.product = resp.product;
        $timeout(function () {
          $ionicSlideBoxDelegate.update();
        }, 20);
      }
    });
  })

  .controller('PaymentCallbackCtrl', function ($scope, $ionicNavBarDelegate, apiManager, $stateParams, $rootScope) {
    // Activate ink for controller
    $scope.txnData = null;
    $rootScope.redeemUser = null;
    $ionicNavBarDelegate.showBackButton(false);
    apiManager.getTxnDetails($stateParams.txnId).then(function (resp) {
      if (!resp.error) {
        $scope.txnData = resp.data;
      }
    });
  })

  .controller('BookNowCtrl', function ($scope, $stateParams, $timeout, CONFIG, ionicToast, $ionicLoading, $log, apiManager, $localStorage, $state, $rootScope) {

    $scope.days = CONFIG.days;
    $scope.slots = {};
    $scope.activeDay = "";
    if ($stateParams.day) {
      $scope.activeDay = $stateParams.day;
    } else {
      $scope.activeDay = "SUN";
    }
    apiManager.getWorkingSlots($scope.formData).then(function (resp) {
      $scope.slots = resp;
    });

    $scope.selectSlot = function ($slot_key) {
      angular.forEach($scope.slots, function (value, key) {
        if (key !== $slot_key) {
          $scope.slots[key].active = false;
        } else {
          $scope.slots[key].active = true;
        }
      });
    };
  });
