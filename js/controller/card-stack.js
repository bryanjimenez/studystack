var studystack = angular.module('studystack', ['ui.bootstrap', 'gajus.swing', 'firebase', 'ngRoute'])
    .constant('FIREBASE_URL', 'https://greekcards.firebaseio.com/')
    .constant('TTS_PROXY_URL', 'http://greek.webuda.com/voice.php');

studystack.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: 'views/main.html',
        controller: 'card-stack'
    }).
    when('/:sId', {
        templateUrl: 'views/main.html',
        controller: 'card-stack'
    }).    
    when('/:fl/:bl', {
        templateUrl: 'views/main.html',
        controller: 'card-stack'
    }).
    otherwise({
        redirectTo: '/'
    });
}]);


studystack.factory('myStack', function($firebase, $routeParams, FIREBASE_URL) {
    var s = {};
    var cards = [];
    var sid;

    s.getCards = function(sid) {
        cards = $firebase(new Firebase(FIREBASE_URL + "/" + sid)).$asArray();
        return cards;
    };

    s.addCards = function(card) {
        cards.push(card);
        return cards;
    }

    s.create = function(cards, complete) {
        //console.log('saving stack');

        var rootref = new Firebase(FIREBASE_URL);
        var root = $firebase(rootref);

        root.$push({
            temp: Firebase.ServerValue.TIMESTAMP
        }).then(function(ref) {

            sid = ref.key();
            //fconsole.log(sid);

            var current = $firebase(rootref.child(sid));

            for (var i = 0; i < cards.length; i++) {
                current.$push(angular.copy(cards[i]));
            }
            current.$remove('temp');
        }).then(function() {
            complete(sid);
        });
    }; // create
    return s;
});


studystack.controller('card-stack', function($rootScope, $scope, $firebase, $routeParams, myStack, FIREBASE_URL, TTS_PROXY_URL) {

    var root = new Firebase(FIREBASE_URL);
    var stack = new Firebase(FIREBASE_URL + "/" + $routeParams.sId);
    var cards = $firebase(stack).$asArray();
    
    var top_lang = $routeParams.hl;
    var bottom_lang = $routeParams.tl;
    
    
    if($routeParams.fl){
		$rootScope.fl=$routeParams.fl;
	}
	if($routeParams.bl){
		$rootScope.bl=$routeParams.bl;
	}

    cards.$loaded().then(function(data) {
        $rootScope.cards = cards;
    }); // cards Object Loaded

    $rootScope.emptyStack = ($routeParams.sId ? false : true);

    $scope.addCard = function() {
            // FIX THIS
            var card = {
                front: $scope.front,
                f_audio: TTS_PROXY_URL + "?tl=" + $rootScope.fl + "&q=" + $scope.front,
                f_lang: $rootScope.fl,
                back: $scope.back,
                b_audio: TTS_PROXY_URL + "?tl=" + $rootScope.bl + "&q=" + $scope.back,
                b_lang: $rootScope.bl,
                phonetic: $scope.phonetic === undefined ? '' : $scope.phonetic,
            }

            $rootScope.cards.push(card);

            $scope.front = "";
            $scope.back = "";
            $scope.phonetic = "";
	} //addCard


    // need to move this out of here....
    $scope.flipCard = function(card) {
        $('li.' + card.front + ' > span.front').toggle(200);
        $('li.' + card.front + ' > span.back').toggle(200);
        $('li.' + card.front + ' > span.phonetic').toggleClass('phonetic-show', 200);
    }; // flipCard		


    // very hacky...
    $scope.listen = function(card) {	
            var a = $('li.' + card.front + ' > span.front').is(':visible') ? $('li.' + card.front + ' > audio.front') : $('li.' + card.front + ' > audio.back');
            a[0].play();
	} // listen

    $scope.reset = function() {
            $('input').each(function() {
                $(this).toggle().not('.phonetic').focus();
            });
        } // reset
});


studystack.controller('DropdownCtrl', function($rootScope, $scope, $routeParams, $location, myStack) {
    $scope.saveStack = function() {
            if ($rootScope.cards.length > 0) {
				
				if($rootScope.fl && $rootScope.bl){
					
					
				
                myStack.create($scope.cards,
                    function(key) {						
                        $location.path('/'+ key);
                    });
				}else{
					alert('please set language');
				}
				
            } else {
				//TODO add alert here..
                alert('Please create a card first');
            }
    } //saveStack

    $scope.newStack = function() {
            $location.path('/');
            $rootScope.cards = [];
            $rootScope.front = "";
            $rootScope.back = "";
    } //newStack

});


/* Fix
 * Error: error:insecurl
 * Processing of a Resource from Untrusted Source Blocked
 * 
 **/
studystack.filter('trustUrl', function ($sce) {
    return function(url) {
      return $sce.trustAsResourceUrl(url);
    };
  });
