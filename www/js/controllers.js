'use strict';
angular.module('starter.controllers', [])
  .controller('AppCtrl', function ($scope, $ionicModal, $ionicPopover, $timeout, apiManager, $localStorage, CONFIG, $rootScope, $state, $ionicLoading, ionicToast, $log) {

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
      navIcons.addEventListener('click', function () {
        this.classList.toggle('active');
      });
    }

    $scope.hideHeader = function () {
      $scope.hideNavBar();
      $scope.noHeader();
    };

    $scope.showHeader = function () {
//      $scope.showNavBar();
//      $scope.hasHeader();
    };

    $scope.isUserLoggedIn = false;
    $rootScope.user = $localStorage.getUser();
    if ($localStorage.getUserId() !== null) {
      $scope.isUserLoggedIn = true;
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
      $ionicLoading.show();
      var $requestData = {user_id: $localStorage.getUserId(), device_id: $localStorage.getDeviceId()};
      apiManager.logout($requestData).then(function (resp) {
        $ionicLoading.hide();
      });
      var details = {id: null, name: null, phone: null, email: null};
      $localStorage.setUser(details);
      $scope.isUserLoggedIn = false;
      $scope.$broadcast('logout');
      $state.go('app.home');
      $timeout(function () {
        $scope.isUserLoggedIn = false;
      }, 2);
    };


    $scope.categoryList = [];
    $scope.stateList = [];
    $scope.cityList = [];
    apiManager.getCategoryList($scope.signupData).then(function (resp) {
      if (!resp.code) {
        $scope.categoryList = resp.body.data;
      }
      apiManager.getStateList().then(function (resp) {
        if (!resp.code) {
          $scope.stateList = resp.body.data;
          $scope.updateCityList($scope.stateList[0].id);
        }
      });
    });

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

  .controller('LoginCtrl', function ($scope, $state, $rootScope, $localStorage, apiManager, $ionicLoading, ionicToast, $log, CONFIG) {
    // Perform the login action when the user submits the login form
    $scope.loginData = {};
    $scope.emailValidator = CONFIG.validators.email;
    $scope.passwordValidator = CONFIG.validators.password;
    $scope.phoneValidator = CONFIG.validators.phone;

    $scope.doLogin = function () {
      if (!$scope.formData.email || $scope.formData.email === null) {
        ionicToast.show('Email can not be left blank.', 'middle', false, 1500);
      } else if ($scope.formData.email && !$scope.emailValidator.test($scope.formData.email)) {
        ionicToast.show('Please enter valid email.', 'middle', false, 1500);
      } else if (!$scope.formData.password || $scope.formData.password === null) {
        ionicToast.show('Password can not be left blank.', 'middle', false, 1500);
      } else if ($scope.formData.password && !$scope.passwordValidator.test($scope.formData.password)) {
        ionicToast.show('Passwords should be 6-12 characters long.', 'middle', false, 1500);
      } else {
        if ($scope.formData.email && $scope.formData.password) {
          $ionicLoading.show();
          $log.log("Inside valid details");
          apiManager.login($scope.formData).then(function (resp) {

            if (!resp.status) {
              $localStorage.setUser({
                id: resp.body.id,
                first_name: resp.body.first_name,
                last_name: resp.body.last_name,
                profile_image: resp.body.profile_image,
                email: resp.body.email,
                phone: resp.body.phone
              }).then(function (resp) {
                $rootScope.isUserLoggedIn = true;
                $rootScope.isUserLoggedInn();
                $ionicLoading.hide();
                $scope.$broadcast('logedin');
                $scope.closeModal();
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

  .controller('SignupCtrl', function ($scope, $state, $rootScope, $localStorage, apiManager, $ionicLoading, ionicToast, $log, CONFIG) {
    $scope.signupData = {};
    $scope.emailValidator = CONFIG.validators.email;
    $scope.passwordValidator = CONFIG.validators.password;
    $scope.phoneValidator = CONFIG.validators.phone;

    $scope.signupData.group = 3;
    $scope.doSignup = function () {
      $log.log("Indide signup action");
      $scope.submitted = true;
      if (!$scope.signupData.first_name || $scope.signupData.first_name === null) {
        ionicToast.show('Name can not be left blank.', 'middle', false, 1500);
      } else if (!$scope.signupData.email || $scope.signupData.email === null) {
        ionicToast.show('Email can not be left blank.', 'middle', false, 1500);
      } else if ($scope.signupData.email && !$scope.emailValidator.test($scope.signupData.email)) {
        ionicToast.show('Please enter valid email.', 'middle', false, 1500);
      } else if (!$scope.signupData.phone || $scope.signupData.phone === null) {
        ionicToast.show('Phone can not be left blank.', 'middle', false, 1500);
      } else if ($scope.signupData.phone && !$scope.phoneValidator.test($scope.signupData.phone)) {
        ionicToast.show('Phone enter valid phone.', 'middle', false, 1500);
      } else if (!$scope.signupData.password || $scope.signupData.password === null) {
        ionicToast.show('Password can not be left blank.', 'middle', false, 1500);
      } else if ($scope.signupData.password && !$scope.passwordValidator.test($scope.signupData.password)) {
        ionicToast.show('Passwords should be 6-12 characters long.', 'middle', false, 1500);
      } else {
        $ionicLoading.show();
        $log.log("Inside valid details");
        $scope.signupData.city_id = $scope.signupData.city.id;
        $scope.signupData.state_id = $scope.signupData.state.id;
        $scope.signupData.category_id = $scope.signupData.category.id;
        apiManager.signup($scope.signupData).then(function (resp) {
          if (resp.status) {
            $localStorage.setUser({
              id: resp.body.id,
              name: resp.body.name,
              first_name: resp.body.first_name,
              last_name: resp.body.last_name,
              profile_image: resp.body.profile_image,
              email: resp.body.email,
              phone: resp.body.phone
            }).then(function (resp) {
              $rootScope.isUserLoggedIn = true;
              $rootScope.isUserLoggedInn();
              $ionicLoading.hide();
              $scope.$broadcast('logedin');
              $scope.closeModal();
              $state.go('app.home');
            });
          } else {
            ionicToast.show('Could not match Email/Password, Please try with correct details.', 'middle', false, 2000);
            $ionicLoading.hide();
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
  .controller('HomeCtrl', function ($scope, $timeout, apiManager, $ionicLoading) {
    $scope.categoryList = [];
    $ionicLoading.show();
    apiManager.getCategoryList().then(function (resp) {
      if (!resp.code) {
        $scope.categoryList = resp.body.data;
        $ionicLoading.hide();
      }
    });
  })

  .controller('ProfileCtrl', function ($scope, $localStorage, $timeout, CONFIG, $ionicLoading, apiManager) {
    // Set Motion
    $scope.profileData = {};
    $scope.user = $localStorage.getUser();

    $scope.emailValidator = CONFIG.validators.email;
    $scope.passwordValidator = CONFIG.validators.password;
    $scope.phoneValidator = CONFIG.validators.phone;

    $scope.stateList = [];
    $scope.cityList = [];
    $ionicLoading.show();
    apiManager.getProfile($scope.user.id).then(function (resp) {
      if (!resp.code) {
        $scope.profileData = resp.body.data;
        apiManager.getStateList().then(function (resp) {
          var resp = {"status": "200", "body": {"data": [{"id": "1", "name": "Andaman and Nicobar Islands"}, {"id": "2", "name": "Andhra Pradesh"}, {"id": "3", "name": "Arunachal Pradesh"}, {"id": "4", "name": "Assam"}, {"id": "5", "name": "Bihar"}, {"id": "6", "name": "Chandigarh"}, {"id": "7", "name": "Chhattisgarh"}, {"id": "8", "name": "Dadra and Nagar Haveli"}, {"id": "9", "name": "Daman and Diu"}, {"id": "10", "name": "Delhi"}, {"id": "11", "name": "Goa"}, {"id": "12", "name": "Gujarat"}, {"id": "13", "name": "Haryana"}, {"id": "14", "name": "Himachal Pradesh"}, {"id": "15", "name": "Jammu and Kashmir"}, {"id": "16", "name": "Jharkhand"}, {"id": "17", "name": "Karnataka"}, {"id": "18", "name": "Kenmore"}, {"id": "19", "name": "Kerala"}, {"id": "20", "name": "Lakshadweep"}, {"id": "21", "name": "Madhya Pradesh"}, {"id": "22", "name": "Maharashtra"}, {"id": "23", "name": "Manipur"}, {"id": "24", "name": "Meghalaya"}, {"id": "25", "name": "Mizoram"}, {"id": "26", "name": "Nagaland"}, {"id": "27", "name": "Narora"}, {"id": "28", "name": "Natwar"}, {"id": "29", "name": "Odisha"}, {"id": "30", "name": "Paschim Medinipur"}, {"id": "31", "name": "Pondicherry"}, {"id": "32", "name": "Punjab"}, {"id": "33", "name": "Rajasthan"}, {"id": "34", "name": "Sikkim"}, {"id": "35", "name": "Tamil Nadu"}, {"id": "36", "name": "Telangana"}, {"id": "37", "name": "Tripura"}, {"id": "38", "name": "Uttar Pradesh"}, {"id": "39", "name": "Uttarakhand"}, {"id": "40", "name": "Vaishali"}, {"id": "41", "name": "West Bengal"}], "code": 0}};
          if (!resp.code) {
            $scope.stateList = resp.body.data;
            for (var i = 0; i < $scope.stateList.length; i++) {
              var state = $scope.stateList[i];
              if (state.id === $scope.profileData.state_id) {
                $scope.profileData.state = state;
              }
            }
            apiManager.getCityList($scope.profileData.state.id).then(function (resp) {
              var resp = {"status": "200", "body": {"data": [{"id": "1", "name": "Bombuflat"}, {"id": "2", "name": "Garacharma"}, {"id": "3", "name": "Port Blair"}, {"id": "4", "name": "Rangat"}], "code": 0}};
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
          }
        });
      }
    });

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
        ionicToast.show('Passwords should be 6-12 characters long.', 'middle', false, 1500);
      } else if (!$scope.profileData.new_password || $scope.profileData.new_password === null) {
        ionicToast.show('Password can not be left blank.', 'middle', false, 1500);
      } else if ($scope.profileData.new_password && !$scope.passwordValidator.test($scope.profileData.new_password)) {
        ionicToast.show('Passwords should be 6-12 characters long.', 'middle', false, 1500);
      } else if (!$scope.profileData.repeat_password || $scope.profileData.repeat_password === null) {
        ionicToast.show('Password can not be left blank.', 'middle', false, 1500);
      } else if ($scope.profileData.repeat_password && !$scope.passwordValidator.test($scope.profileData.repeat_password)) {
        ionicToast.show('Passwords should be 6-12 characters long.', 'middle', false, 1500);
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
   * @param {type} $scope
   * @param {type} $stateParams
   * @param {type} $timeout
   * @param {type} apiManager
   * @param {type} $state
   * @returns {undefined}
   */
  .controller('FeedCtrl', function ($scope, $stateParams, $timeout, apiManager, $state, $ionicLoading, ionicToast, $localStorage, $rootScope) {
    $scope.user = $localStorage.getUser();

    /*
     * SEARCH
     */
    $scope.searchResults = [];
    $scope.updateSearchResult = function () {
      $ionicLoading.show();
      $scope.search.page = 1;
      $scope.$broadcast('scroll.infiniteScrollComplete');
      apiManager.searchVendors($scope.search).then(function (resp) {
        if (!resp.code) {
          $scope.search.page = $scope.search.page + 1;
          $scope.searchResults = resp.body.data;
        }
        $ionicLoading.hide();
      });
    };

    /*
     * CATEGORY LIST
     */
    $scope.categoryList = [];
    $scope.baseSlotList = [];
    $scope.distanceList = [];
    apiManager.getCategoryList().then(function (resp) {
      if (!resp.code) {
        $scope.categoryList = resp.body.data;
        if ($stateParams.cateId && $stateParams.cateId !== null) {
          $scope.categoryList.forEach(function (category) {
            if (category.id === $stateParams.cateId) {
              $scope.search.category = category;
            }
          });
        }
      }
    });

    $scope.loadMore = function () {
      if ($scope.search.page) {
        $scope.$broadcast('scroll.infiniteScrollComplete');
        apiManager.searchVendors($scope.search).then(function (resp) {
          if (resp && !resp.code) {
            if (resp.body && resp.body.data) {
              $scope.search.page = $scope.search.page + 1;
              resp.body.data.forEach(function (newItem) {
                $scope.searchResults.push(newItem);
              });
              $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
              $scope.search.page = false;
              $scope.$broadcast('scroll.infiniteScrollComplete');
            }
          }
        });
      }
    };

    $scope.search = {
      datefor: new Date(),
      category: null,
      longitude: null,
      latitude: null,
      range: null,
      schedule: null,
      page: 1
    };

  })

  .controller('DetailsCtrl', function ($scope, $stateParams, $timeout, $state, apiManager, CONFIG) {
    // Activate ink for controller
    $scope.goToBook = function () {
      $state.go("app.book-now");
    };

    $scope.days = CONFIG.days;
    $scope.slots = {};
    $scope.activeDay = "";
    if ($stateParams.day) {
      $scope.activeDay = $stateParams.day;
    } else {
      $scope.activeDay = "SUN";
    }
    apiManager.getBaseSlotList($scope.formData).then(function (resp) {
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
  })

  .controller('BookingSuccessCtrl', function ($scope, $timeout, $ionicActionSheet, $state) {
    // Activate ink for controller
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
