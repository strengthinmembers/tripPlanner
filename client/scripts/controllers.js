app.controller('loginController', ['$scope', '$location', 'AuthService', function ($scope, $location, AuthService) {

    console.log('user status: ', authservice.getUserStatus());

    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      authservice.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function (data) {
          $scope.disabled = false;
          $scope.loginForm = {};
          $location.path('/');
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid email and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });
    };

}]);

app.controller('homeController', ['$scope', '$http', '$route', 'PlanService', function ($scope, $http, $route, PlanService) {
  $scope.user_id = authservice.getUserStatus();
  console.log($scope);
  $http.get('/activities').success(function (docs) {
    $scope.activities = docs;
    // deferred.resolve(data);
  }).error(function () {
    console.log('error');
    // deferred.reject("Error!");
  });
  if ($scope.user_id) {
    console.log('user is logged in', $scope.user_id);
    $http.get('/plans/' + $scope.user_id).success(function (doc) {
      console.log('this user-s plans', doc);
      $scope.userPlan = doc.plan;
      console.log('userPlan', $scope.userPlan);
    })
  } else {
    console.log('no one is logged in');
  }

  $scope.addToPlan = function (user, activity) {
    planservice.addToPlan(user, activity)
    $route.reload();
  }

  $scope.removeFromPlan = function (user, activity) {
    planservice.removeFromPlan(user, activity);
    $route.reload();
  }

}]);

app.controller('logoutController', ['$scope', '$location', 'AuthService', function ($scope, $location, AuthService) {

    $scope.logout = function () {


      // call logout from service
      authservice.logout()
        .then(function () {
          console.log('user status from logout', authservice.getUserStatus());
          $location.path('/login');
        });

    };

}]);

app.controller('registerController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    console.log(authservice.getUserStatus());

    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      authservice.register($scope.registerForm.username, $scope.registerForm.password)
        // handle success
        .then(function () {
          $scope.disabled = false;
          $scope.registerForm = {};
          $location.path('/login');
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });

    };

}]);

app.controller('activitiesController',
  ['$scope', '$location', '$http', function ($scope, $location, $http) {

    $scope.addActivity = function (activity) {
      console.log('activity in activitiesController', activity);
      //send form data to database here? or from /activities route?
      $http.post('/activities', activity);
      $scope.activity = {};
    }

}]);
