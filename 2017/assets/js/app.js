var app = angular.module('app', [ 'ui.bootstrap' , 'ngSanitize', 'jshor.angular-addtocalendar']);

app.controller('SpeakersCtrl', ['$scope', '$http', '$timeout', '$uibModal', function($scope, $http, $timeout, $modal, $log){
	$scope.speakers = [];
	$http({
    method: 'GET',
    url: '/2017/assets/data/speakers.json'
  }).then(function success(response) {
		$scope.speakers = response.data;
    var n = 0;
    var array = [];
    $scope.randomList = [];
    while (n < $scope.speakers.length) {
      var index = Math.floor(Math.random()*$scope.speakers.length);
      if ($.inArray(index, array) == -1) {
        array[n+1] = index;
        n++;
      }
    }
    for (n=1; n < 5; n++) {
			if ($scope.speakers[array[n]].surname != "Newton" && $scope.speakers[array[n]].surname != "De Meo") {
      	$scope.randomList.push(
        	$scope.speakers[array[n]]
      	);
			}
    };
  });
	$scope.open = function (_speaker) {
		var modalInstance = $modal.open({
			controller: "ModalInstanceCtrl",
			templateUrl: 'SpeakerModalContent.html',
      windowClass: 'app-modal-window',
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

/*app.controller('TalksCtrl', ['$scope', '$http', '$location', '$filter',  '$timeout', '$modal', function($scope, $http, $location, $filter,  $timeout, $modal){
    $scope.talkId = $location.absUrl().split("id=")[1];
    $http.get('/2016/assets/data/talks.json').success(function(data) {
      $scope.talk = $filter('getByProperty')('id', $scope.talkId, data);
      $scope.talks = data;
    })
    $scope.open = function (_speaker) {
    var modalInstance = $modal.open({
      controller: "ModalInstanceCtrl",
      templateUrl: 'SpeakerModalContent.html',
      windowClass: 'app-modal-window',
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

app.controller('AgendaCtrl', ['$scope', '$http', '$location', '$filter',  '$timeout', '$modal', function($scope, $http, $location, $filter,  $timeout, $modal){
  $scope.agenda = [];
  $http.get('/2016/assets/data/agenda.json').success(function(data) {
    var array = data;
    var date, startDate, endDate;
    $.each(array, function(index, day) {
      date = "201604" + day.date.substr(day.date.length - 2) + "T";
      $.each(day.slots, function(index2, slot) {
        var startTime = slot.time.split(' ')[0];
        var hour = slot.time.split(' ')[0].split(':')[0];
        if (hour.length == 1) {
          hour = "0" + hour;
        }
        startDate = date + hour + slot.time.split(' ')[0].split(':')[1];
        var endTime = slot.time.split(' ')[2];
        var hour = slot.time.split(' ')[2].split(':')[0];
        if (hour.length == 1) {
          hour = "0" + hour;
        }
        endDate = date + hour + slot.time.split(' ')[2].split(':')[1];
        $.each(slot.sessions, function(index3, session) {
          session.startDate = startDate + "00";
          if (session["length"] == 2) {
            var hour = day.slots[index2+1].time.split(' ')[2].split(':')[0]
            if (hour.length == 1) {
              hour = "0" + hour;
            }
            var endDate2 = date + hour + day.slots[index2+1].time.split(' ')[2].split(':')[1] + "00";
            session.endDate = endDate2;
            session.time = startTime + " - " + day.slots[index2+1].time.split(' ')[2];
          } else {
            session.endDate = endDate + "00";
            session.time = startTime + " - " + endTime;
          }
          session.date = day.date;
        });
      });
    });


    $http.get('/2016/assets/data/talks.json').success(function(data) {
      var talks = data;
      $.each(array, function(index, day) {
        $.each(day.slots, function(index2, slot) {
          $.each(slot.sessions, function(index3, session) {
            if (session.id[0] == "2") {
              var i = talks.filter(function(e) { return e.id == session.id; });
              session.title = i[0].title;
              session.type = i[0].type;
              session.speakers = [];
              session.speakers = i[0].speakers.slice(0);
              session.abstract = i[0].abstract;
              if (i[0].topic[0] != "2") {
                session.topic = i[0].topic;
              }
              session.files = i[0].files;
            } else {
              session.title = session.id;
            }
          })
        })
      })
    });
    $http.get('/2016/assets/data/speakers.json').success(function(data) {
      var speakers = data;
      $.each(array, function(index, day) {
        $.each(day.slots, function(index2, slot) {
          $.each(slot.sessions, function(index3, session) {
            if (session.id[0] == "2" && session.speakers) {
              $.each(session.speakers, function(index4, speaker) {
                var i = speakers.filter(function(e) { return e.surname == speaker.surname; });
                speaker.talks = i[0].talks.slice(0);
              });
            }
          });
        });
      });
    });
    $scope.agenda = array;

  });
  $scope.open = function (_session) {
    var modalInstance = $modal.open({
      controller: "ModalInstanceCtrl",
      templateUrl: 'SessionModalContent.html',
      windowClass: 'app-modal-window',
      scope: $scope,
      resolve: {
        item: function()
        {
          $scope.currentItem = _session;
        }
      }
    });
  };
  $scope.open2 = function (_speaker) {
    var modalInstance = $modal.open({
      controller: "ModalInstanceCtrl",
      templateUrl: 'SpeakerModalContent.html',
      windowClass: 'app-modal-window',
      scope: $scope,
      resolve: {
        item: function()
        {
          $scope.currentItem = _speaker;
        }
      }
    });
  };
}]);*/

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, item) {

  $scope.item = $scope.$parent.currentItem;

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
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

app.directive('twitter', [
    function() {
        return {
            link: function(scope, element, attr) {
                setTimeout(function() {
                        twttr.widgets.createShareButton(
                            attr.url,
                            element[0],
                            function(el) {}, {
                                count: 'none',
                                text: attr.text
                            }
                        );
                });
            }
        }
    }
]);
