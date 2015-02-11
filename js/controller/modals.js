studystack.controller('Modals', function($scope, $modal, $log, $location) {

	//this is the standard location javascript global
    //$scope.link = location.origin+location.hash;
    //$scope.link = $location.host()+$location.url();
    $scope.link = $location.absUrl();
    
    $scope.languages =  {
				Afrikaans : 'af',
				Albanian : 'sq',
				Arabic : 'ar',
				Azerbaijani : 'az',
				Basque : 'eu',
				Bengali : 'bn',
				Belarusian : 'be',
				Bulgarian : 'bg',
				Catalan : 'ca',
				Chinese : 'zh-CN',
				Croatian : 'hr',
				Czech : 'cs',
				Danish : 'da',
				Dutch : 'nl',
				English : 'en',
				Esperanto : 'eo',
				Estonian : 'et',
				Filipino : 'tl',
				Finnish : 'fi',
				French : 'fr',
				Galician : 'gl',
				Georgian : 'ka',
				German : 'de',
				Greek : 'el',
				Gujarati : 'gu',
				Haitian : 'ht',
				Creole : 'ht',
				Hebrew : 'iw',
				Hindi : 'hi',
				Hungarian : 'hu',
				Icelandic : 'is',
				Indonesian : 'id',
				Irish : 'ga',
				Italian : 'it',
				Japanese : 'ja',
				Kannada : 'kn',
				Korean : 'ko',
				Latin : 'la',
				Latvian : 'lv',
				Lithuanian : 'lt',
				Macedonian : 'mk',
				Malay : 'ms',
				Maltese : 'mt',
				Norwegian : 'no',
				Persian : 'fa',
				Polish : 'pl',
				Portuguese : 'pt',
				Romanian : 'ro',
				Russian : 'ru',
				Serbian : 'sr',
				Slovak : 'sk',
				Slovenian : 'sl',
				Spanish : 'es',
				Swahili : 'sw',
				Swedish : 'sv',
				Tamil : 'ta',
				Telugu : 'te',
				Thai : 'th',
				Turkish : 'tr',
				Ukrainian : 'uk',
				Urdu : 'ur',
				Vietnamese : 'vi',
				Welsh : 'cy',
				Yiddish : 'yi'
			};

    $scope.showAbout = function(size) {

        var modalInstance = $modal.open({
            templateUrl: 'views/about.html',
            controller: 'ModalGeneric',
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
				languages: function (){
					return $scope.languages;
				},
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
            controller: 'ModalGeneric',
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

studystack.controller('ModalGeneric', function($scope, $modalInstance, msg) {

    $scope.link = msg;
    
    $scope.close = function() {
        $modalInstance.close();
    };

});

studystack.controller('ModalInstanceCtrl', function($scope, $modalInstance, msg, languages) {

    $scope.link = msg;
    $scope.languages = languages;

    $scope.close = function() {
        $modalInstance.close();
    };

});
