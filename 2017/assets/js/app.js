var app = angular.module('app', ['ui.bootstrap', 'ngSanitize', 'angular-atc']);

app.controller('SpeakersCtrl', ['$scope', '$http', '$timeout', '$uibModal', function($scope, $http, $timeout, $modal, $log) {
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
            var index = Math.floor(Math.random() * $scope.speakers.length);
            if ($.inArray(index, array) == -1) {
                array[n + 1] = index;
                n++;
            }
        }
        for (n = 1; n < 8; n++) {
            if ($scope.speakers[array[n]].surname != "Newton") {
                $scope.randomList.push(
                    $scope.speakers[array[n]]
                );
            }
        };
    });
    $scope.open = function(_speaker) {
        var modalInstance = $modal.open({
            controller: "ModalInstanceCtrl",
            templateUrl: 'SpeakerModalContent.html',
            windowClass: 'app-modal-window',
            scope: $scope,
            resolve: {
                item: function() {
                    $scope.currentItem = _speaker;
                }
            }
        });
    };
}]);

app.controller('TalksCtrl', ['$scope', '$http', '$location', '$filter', '$timeout', '$uibModal', function($scope, $http, $location, $filter, $timeout, $modal) {
    $scope.talkId = $location.absUrl().split("id=")[1];
    $http({
        method: 'GET',
        url: '/2017/assets/data/talks.json'
    }).then(function success(response) {
        $scope.talk = $filter('getByProperty')('id', $scope.talkId, response.data);
        $scope.talks = response.data;
    })
    $scope.open = function(_speaker) {
        var modalInstance = $modal.open({
            controller: "ModalInstanceCtrl",
            templateUrl: 'SpeakerModalContent.html',
            windowClass: 'app-modal-window',
            scope: $scope,
            resolve: {
                item: function() {
                    $scope.currentItem = _speaker;
                }
            }
        });
    };
}]);

app.controller('AgendaCtrl', ['$scope', '$http', '$filter', '$timeout', '$uibModal', function($scope, $http, $filter, $timeout, $modal) {
    $scope.agenda = [];
    $http({
        method: 'GET',
        url: '/2017/assets/data/agenda.json'
    }).then(function success(response) {
        var array = response.data;
        $.each(array, function(index, day) {
            number = index + 1;
            day.id = "day" + number;
            day.label = "Day " + number;
            day.class = "";
            day.tabClass = "tab-pane";
            if (number == 1) {
                day.class = "active";
                day.tabClass = "tab-pane fade active in";
            }
        });


        $http({
            method: 'GET',
            url: '/2017/assets/data/talks.json'
        }).then(function success(response) {
            var talks = response.data;
            var date, startDate, endDate;
            $.each(array, function(index, day) {
                number = index + 1;
                day.id = "day" + number;
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
                        if (session.id[0] == "F" || session.id[0] == "E") {
                            var i = talks.filter(function(e) {
                                return e.id == session.id;
                            });
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

                        session.startDate = startDate + "00+0100";
                        if (session["length"] == 2) {
                            var hour = day.slots[index2 + 1].time.split(' ')[2].split(':')[0]
                            if (hour.length == 1) {
                                hour = "0" + hour;
                            }
                            var endDate2 = date + hour + day.slots[index2 + 1].time.split(' ')[2].split(':')[1] + "00";
                            session.endDate = endDate2;
                            session.time = startTime + " - " + day.slots[index2 + 1].time.split(' ')[2];
                        } else {
                            session.endDate = endDate + "00";
                            session.time = startTime + " - " + endTime;
                        }
                        session.date = day.date;
                    })
                })
            })
        });
        $http({
            method: 'GET',
            url: '/2017/assets/data/speakers.json'
        }).then(function success(response) {
            var speakers = response.data;
            $.each(array, function(index, day) {
                $.each(day.slots, function(index2, slot) {
                    $.each(slot.sessions, function(index3, session) {
                        if (session.speakers) {
                            $.each(session.speakers, function(index4, speaker) {
                                var i = speakers.filter(function(e) {
                                    return e.surname == speaker.surname;
                                });
                                speaker.talks = i[0].talks.slice(0);
                            });
                        }
                    });
                });
            });
        });
        $scope.agenda = array;

    });
    $scope.open = function(_session) {
        var modalInstance = $modal.open({
            controller: "ModalInstanceCtrl",
            templateUrl: 'SessionModalContent.html',
            windowClass: 'app-modal-window',
            scope: $scope,
            resolve: {
                item: function() {
                    $scope.currentItem = _session;
                }
            }
        });
    };
    $scope.open2 = function(_speaker) {
        var modalInstance = $modal.open({
            controller: "ModalInstanceCtrl",
            templateUrl: 'SpeakerModalContent.html',
            windowClass: 'app-modal-window',
            scope: $scope,
            resolve: {
                item: function() {
                    $scope.currentItem = _speaker;
                }
            }
        });
    };
}]);

app.controller('ModalInstanceCtrl', function($scope, $uibModalInstance, item) {

    $scope.item = $scope.$parent.currentItem;

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});

app.filter('getByProperty', function() {  
    return function(propertyName, propertyValue, collection) {   
        var i = 0,
            len = collection.length;   
        for (; i < len; i++) {    
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

app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
}]);
