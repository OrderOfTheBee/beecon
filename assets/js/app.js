var app = angular.module('app', [ 'ui.bootstrap' , 'ngSanitize']);

app.controller('SpeakersCtrl', ['$scope', '$http', '$timeout', '$modal', function($scope, $http, $timeout, $modal, $log){
	$scope.speakers = [];
	$http.get('/assets/data/speakers.json').success(function(data) {
		$scope.speakers = data;
	});
	$scope.open = function (_speaker) {
		var modalInstance = $modal.open({
			controller: "ModalInstanceCtrl",
			templateUrl: 'SpeakerModalContent.html',
			scope: $scope,
			resolve: {
				item: function()
				{
					$scope.currentItem = _speaker;
				}
			}
		});
	};
}]);

app.controller('TalksCtrl', ['$scope', '$http', '$location', '$filter', function($scope, $http, $location, $filter){
    $scope.talkId = $location.absUrl().split("id=")[1];
    $http.get('/assets/data/talks.json').success(function(data) {
      $scope.talk = $filter('getByProperty')('id', $scope.talkId, data);
    })
}]);

app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, item) {

  $scope.item = $scope.$parent.currentItem;

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

app.filter('getByProperty', function() {
    return function(propertyName, propertyValue, collection) {
      var i=0, len=collection.length;
      for (; i<len; i++) {
        if (collection[i][propertyName] == propertyValue) {
          return collection[i];
        }
      }
      return null;
    }
  });

function NavBarCtrl($scope) {
    $scope.navbarCollapsed = true;
}

app.directive("header", function() {
    return {
       restrict: 'E',
       templateUrl: "/elements/header.html"
    };
});

app.directive("footer", function() {
    return {
       restrict: 'E',
       templateUrl: "/elements/footer.html"
    };
});

