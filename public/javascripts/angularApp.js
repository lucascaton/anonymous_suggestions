angular.module('app', ['ui.router'])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url:         '/home',
        templateUrl: '/home.html',
        controller:  'MainCtrl',

        resolve: {
          suggestionsPromise: ['suggestions', function(suggestions) {
            return suggestions.getAll();
          }]
        }
      })

      .state('suggestions', {
        url:         '/suggestions/{id}',
        templateUrl: '/suggestions.html',
        controller:  'SuggestionsCtrl',

        resolve: {
          suggestion: ['$stateParams', 'suggestions', function($stateParams, suggestions) {
            return suggestions.get($stateParams.id);
          }]
        }
      });

    $urlRouterProvider.otherwise('home');
  }])

  .factory('suggestions', ['$http', function($http) {
    var o = {
      suggestions: []
    };

    o.getAll = function() {
      return $http.get('/suggestions').success(function(data) {
        angular.copy(data, o.suggestions);
      });
    };

    o.create = function(suggestion) {
      return $http.post('/suggestions', suggestion).success(function(data) {
        o.suggestions.push(data);
      });
    };

    o.upvote = function(suggestion) {
      return $http.put('/suggestions/' + suggestion._id + '/upvote').success(function(data) {
        suggestion.upvotes += 1;
      });
    };

    o.get = function(id) {
      return $http.get('/suggestions/' + id).then(function(res) {
        var foundSuggestion;
        var result;

        for (var i = 0; i < o.suggestions.length; i++) {
          if (o.suggestions[i]._id === id) {
            foundSuggestion = o.suggestions[i];
          }
        }

        if (foundSuggestion) {
          angular.extend(foundSuggestion, res.data);
          result = foundSuggestion;
        } else {
          o.suggestions.push(res.data);
          result = res.data;
        }

        return result;
      });
    };

    o.addComment = function(id, comment) {
      return $http.post('/suggestions/' + id + '/comments', comment);
    };

    o.upvoteComment = function(suggestion, comment) {
      return $http.put('/suggestions/' + suggestion._id + '/comments/'+ comment._id + '/upvote').success(function(data) {
        comment.upvotes += 1;
      });
    };

    return o;
  }])

  .controller('MainCtrl', ['$scope', 'suggestions', function($scope, suggestions) {
    $scope.description = '';
    $scope.link        = '';

    $scope.suggestions = suggestions.suggestions;

    $scope.addSuggestion = function() {
      if ($scope.description === '') { return; }

      suggestions.create({
        description: $scope.description,
        link:        $scope.link
      });

      $scope.description = '';
      $scope.link        = '';
    };

    $scope.incrementUpvotes = function(suggestion) {
      suggestions.upvote(suggestion);
    };
  }])

  .controller('SuggestionsCtrl', ['$scope', '$stateParams', 'suggestions', 'suggestion', function($scope, $stateParams, suggestions, suggestion) {
    $scope.suggestion = suggestion;

    $scope.addComment = function() {
      if ($scope.body === '') { return; }

      suggestions.addComment(suggestion._id, { body: $scope.body, }).success(function(comment) {
        $scope.suggestion.comments.push(comment);
      });

      $scope.body = '';
    };

    $scope.incrementUpvotes = function(comment) {
      suggestions.upvoteComment(suggestion, comment);
    };
  }])

  .service('Notifications', ['$rootScope', '$stateParams', 'suggestions', function Notification($rootScope, $stateParams, suggestions) {
    var listen = function listen() {
      var client = new Faye.Client('/faye', {
        timeout: 120
      });

      client.subscribe('/notifications/suggestions', function() {
        suggestions.getAll();
      });

      client.subscribe('/notifications/suggestions/messages', function(suggestionId) {
        var currentId = $stateParams.id;

        if (currentId === suggestionId) {
          suggestions.get(currentId);
        }
      });
    };

    return {
      listen: listen
    };
  }])

  .run(function(Notifications) {
    Notifications.listen();
  });
