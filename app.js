angular.module('app', ['ui.router'])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
      url:         '/home',
      templateUrl: '/home.html',
      controller:  'MainCtrl'
    });

    $urlRouterProvider.otherwise('home');
  }])

  .factory('suggestions', [function() {
    var o = {
      suggestions: []
    };

    return o;
  }])

  .controller('MainCtrl', ['$scope', 'suggestions', function($scope, suggestions) {
    $scope.description = '';
    $scope.link        = '';

    $scope.suggestions = suggestions.suggestions;

    $scope.addSuggestion = function() {
      if ($scope.description === '') { return; }

      $scope.suggestions.push({
        description: $scope.description,
        link:        $scope.link,
        upvotes: 0
      });

      $scope.description = '';
      $scope.link        = '';
    };

    $scope.incrementUpvotes = function(suggestion) {
      suggestion.upvotes += 1;
    };
  }]);
