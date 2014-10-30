angular.module('app', [])
  .controller('MainCtrl', ['$scope', function($scope) {
    $scope.description = '';

    $scope.suggestions = [
      { description: 'suggestion 1', upvotes: 5 },
      { description: 'suggestion 2', upvotes: 2 },
      { description: 'suggestion 3', upvotes: 15 },
      { description: 'suggestion 4', upvotes: 9 },
      { description: 'suggestion 5', upvotes:  4}
    ];

    $scope.addSuggestion = function() {
      if ($scope.description === '') { return; }

      $scope.suggestions.push({
        description: $scope.description,
        upvotes: 0
      });

      $scope.description = '';
    };

    $scope.incrementUpvotes = function(suggestion) {
      suggestion.upvotes += 1;
    };
  }]);
