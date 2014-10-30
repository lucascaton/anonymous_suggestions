angular.module('app', ['ui.router'])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url:         '/home',
        templateUrl: '/home.html',
        controller:  'MainCtrl'
      })

      .state('suggestions', {
        url:         '/suggestions/{id}',
        templateUrl: '/suggestions.html',
        controller:  'SuggestionsCtrl'
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
        upvotes:     0,

        comments: [
          { body: 'Nice suggestion!',                    upvotes: 0 },
          { body: 'Great idea but everything is wrong!', upvotes: 0 }
        ]
      });

      $scope.description = '';
      $scope.link        = '';
    };

    $scope.incrementUpvotes = function(suggestion) {
      suggestion.upvotes += 1;
    };
  }])

  .controller('SuggestionsCtrl', ['$scope', '$stateParams', 'suggestions', function($scope, $stateParams, suggestions) {
    $scope.suggestion = suggestions.suggestions[$stateParams.id];

    $scope.addComment = function() {
      if($scope.body === '') { return; }
      $scope.suggestion.comments.push({
        body:    $scope.body,
        upvotes: 0
      });

      $scope.body = '';
    };
  }]);
