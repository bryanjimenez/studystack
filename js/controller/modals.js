studystack.controller('Modals', function($scope, $modal, $log, $location) {

	//this is the standard location javascript global
    //$scope.link = location.origin+location.hash;
    //$scope.link = $location.host()+$location.url();
    $scope.link = $location.absUrl();

    $scope.showAbout = function(size) {

        var modalInstance = $modal.open({
            templateUrl: 'views/about.html',
            controller: 'ModalInstanceCtrl',
            size: size,
			resolve: {
				msg: null
			}
        });

        modalInstance.result.then(function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }; // showAbout

    $scope.setLanguage = function(size) {
        var modalInstance = $modal.open({
            templateUrl: 'views/language.html',
            controller: 'ModalInstanceCtrl',
            size: size,
			resolve: {
				msg: null
			}
			
			});

        modalInstance.result.then(function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }; // setLanguage
    
	$scope.showShareLink = function(size) {
        var modalInstance = $modal.open({
            templateUrl: 'views/share.html',
            controller: 'ModalInstanceCtrl',
            size: size,
			resolve: {
				msg: function () {
					return $scope.link;
					}
			}
        });

        modalInstance.result.then(function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }; // showShareLink
    
});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

studystack.controller('ModalInstanceCtrl', function($scope, $modalInstance, msg) {

    $scope.link = msg;

    $scope.close = function() {
        $modalInstance.close();
    };

});
