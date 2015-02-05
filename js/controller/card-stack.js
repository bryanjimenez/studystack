var studystack = angular.module('studystack', ['ui.bootstrap','gajus.swing','firebase','ngRoute'])
    .constant('FIREBASE_URL', 'https://greekcards.firebaseio.com/');
    
	studystack.config(['$routeProvider', function($routeProvider) {
	  $routeProvider.
		when('/', {
		  templateUrl: 'views/main.html',
		  controller:  'card-stack'
		}).		
		when('/s/:sId', {
		  templateUrl: 'views/main.html',
		  controller:  'card-stack'
		}).
		otherwise({
		  redirectTo: '/'
		});
	}]);
	
	studystack.factory('myStack', function($firebase, $routeParams, FIREBASE_URL) {		
		var s = {};
		var cards = [];
		var sid;
				
		s.getCards = function(sid){
			cards = $firebase(new Firebase(FIREBASE_URL+"/"+sid)).$asArray();
			return cards;
		};
		
		s.addCards = function(card){
			cards.push(card);
			return cards;
		}
		
		s.create = function (cards,complete){
			//console.log('saving stack');
			
			var rootref = new Firebase(FIREBASE_URL);
			var root = $firebase(rootref);
        
			root.$push({temp: Firebase.ServerValue.TIMESTAMP}).then(function(ref) {
												
				sid = ref.key();
				//fconsole.log(sid);
				
				var current = $firebase(rootref.child(sid));
				
				for (var i = 0; i < cards.length; i++) {
					current.$push(angular.copy(cards[i]));
				}
				current.$remove('temp');
			}).then(function(){
				complete(sid);
				});
		}; // create
		return s;
	});
	
	
	
    studystack.controller('card-stack', function ($rootScope, $scope, $firebase, $routeParams, myStack, FIREBASE_URL) {
		
		var root =  new Firebase(FIREBASE_URL);
		var stack =  new Firebase(FIREBASE_URL+"/"+$routeParams.sId);
		var cards = $firebase(stack).$asArray();

		
		cards.$loaded().then(function(data) {
			$rootScope.cards = cards;
			//console.log(cards);
        }); // cards Object Loaded
		
		$rootScope.emptyStack = ($routeParams.sId?false:true);
  
		$scope.addCard = function() {
			
																					// FIX THIS
			var card = {front: $scope.front, back: $scope.back, phonetic: $scope.phonetic===undefined?'':$scope.phonetic}
				
			$rootScope.cards.push(card);
			
			$scope.front="";
			$scope.back="";
			$scope.phonetic="";
			
		} //addCard
		
		
		// need to move this out of here....
        $scope.flipCard = function (card) {
			$('li.'+card.front+' > span.front').toggle(200);
			$('li.'+card.front+' > span.back').toggle(200);		
			$('li.'+card.front+' > span.phonetic').toggleClass('phonetic-show',200);			
		}; // flipCard		
		
		
		// very hacky...
		$scope.listen = function(card) {
			
			var l = $('li.'+card.front+' > span.front').is(':visible') ? 'english' : 'greek';
			
			languages = {
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
				english : 'en',
				Esperanto : 'eo',
				Estonian : 'et',
				Filipino : 'tl',
				Finnish : 'fi',
				French : 'fr',
				Galician : 'gl',
				Georgian : 'ka',
				German : 'de',
				greek : 'el',
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

			var url = "http://translate.google.com/translate_tts?tl="+languages[l]+"&q="+card[l=='english'?'front':'back'];
		
			var $iframe = $('<iframe src="'+url+'" rel="noreferrer"></iframe>');
			$('body').append($iframe);
			$iframe.hide();	
			
			setTimeout(function() {
				$iframe.remove();
			}, 5000);

		} // listen
		
		$scope.reset = function () {
			$('input').each(function (){
				$(this).toggle().not('.phonetic').focus();
			});
		} // reset
    });


studystack.controller('DropdownCtrl', function($rootScope, $scope, $routeParams, $location, myStack, AlertCtrl) {
 

 
	$scope.setLanguage = function(){
			AlertCtrl.addAlert('danger','Under Development');		
	}// setLanguage
	
	$scope.saveStack = function() {
		if($rootScope.cards.length>0){
			
			myStack.create($scope.cards, 
							function(key){
								$location.path('/s/'+key);
							});
			
		
		}else{
			AlertCtrl.addAlert('danger','Please create a card first');
		}
	} //saveStack


	$scope.newStack = function (){
		$location.path('/');
		$rootScope.cards=[];
		$rootScope.front="";
		$rootScope.back="";
		
	} //newStack
	
	$scope.shareStack = function (){
		if(!$rootScope.emptyStack){
			AlertCtrl.addAlert('success',location.origin+location.hash);
		}else{
			AlertCtrl.addAlert('danger','Please save first');
		}
		
	};// shareStack
	
	$scope.showAbout = function (){
		var msg = 'Created and maintained by Bryan. '
				+'Hosted by github. '
				+'Special thanks to Alex and Andrew. '
					
		
		
			AlertCtrl.addAlert('success',msg,5000);
	}
});



studystack.factory('AlertCtrl', function($timeout) {
    var alerts = [];
    var itemsService = {};

	itemsService.addAlert = function(type, message, time) {
		if(time===undefined){
			var time = 3000;
		}
		alerts.push({type: type, msg: message});
		$timeout(function(){
			alerts.splice(alerts.length-1, 1);
		},time);
	};

	itemsService.closeAlert = function(index) {
		alerts.splice(index, 1);
	};
	
	itemsService.alerts = alerts;

    return itemsService;
});


studystack.controller('AlertDemoCtrl', function ($scope, AlertCtrl) {
  $scope.alerts = AlertCtrl.alerts;
  $scope.addAlert = AlertCtrl.addAlert;
  $scope.closeAlert = AlertCtrl.closeAlert;
});
