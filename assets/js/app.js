var app = angular.module('app', [ 'ui.bootstrap' , 'ngSanitize']);

/*app.controller('MembersCtrl', ['$scope', '$http', '$timeout', '$modal', function($scope, $http, $timeout, $modal, $log){
	$scope.members = [];
	$http.get('/assets/data/members.json').success(function(data) {
		$scope.members = data;
		$scope.fullList = [];
		var n = 0;
		var array = [];
		while (n < $scope.members.length) {
			var index = Math.floor(Math.random()*$scope.members.length);
			if ($.inArray(index, array) == -1) {
				array[n+1] = index;
				n++;
			}
		}
		for (n=1; n < $scope.members.length+1; n++) {
			$scope.fullList.push(
				$scope.members[array[n]]
			);
		};
	});
	$scope.open = function (_member) {
		var modalInstance = $modal.open({
			controller: "ModalInstanceCtrl",
			templateUrl: 'MemberModalContent.html',
			scope: $scope,
			resolve: {
				item: function()
				{
					$scope.currentItem = _member;
				}
			}
		});
	};
}]);*/

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

