var app = angular.module('app', [ 'ui.bootstrap' , 'ngSanitize']);

app.controller('SpeakersCtrl', ['$scope', '$http', '$timeout', '$modal', function($scope, $http, $timeout, $modal, $log){
	$scope.speakers = [];
	$http.get('/assets/data/speakers.json').success(function(data) {
		$scope.speakers = data;
		$scope.fullList = [];
		var n = 0;
		var array = [];
		while (n < $scope.speakers.length) {
			var index = Math.floor(Math.random()*$scope.speakers.length);
			if ($.inArray(index, array) == -1) {
				array[n+1] = index;
				n++;
			}
		}
		for (n=1; n < $scope.speakers.length+1; n++) {
			$scope.fullList.push(
				$scope.speakers[array[n]]
			);
		};
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

app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, item) {

  $scope.item = $scope.$parent.currentItem;

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
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

