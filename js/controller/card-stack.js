var studystack = angular.module('studystack', ['ui.bootstrap', 'gajus.swing', 'firebase', 'ngRoute'])
    .constant('FIREBASE_URL', 'https://greekcards.firebaseio.com/')
    .constant('TTS_PROXY_URL', 'http://greek.webuda.com/voice.php');

studystack.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: 'views/main.html',
        controller: 'card-stack'
    }).
    when('/:hl/:tl/:sId', {
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


    cards.$loaded().then(function(data) {
        $rootScope.cards = cards;
    }); // cards Object Loaded

    $rootScope.emptyStack = ($routeParams.sId ? false : true);

    $scope.addCard = function() {
            // FIX THIS
            var card = {
                front: $scope.front,
                back: $scope.back,
                phonetic: $scope.phonetic === undefined ? '' : $scope.phonetic
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

            var l = $('li.' + card.front + ' > span.front').is(':visible') ? 'english' : 'greek';

            languages = {
                Afrikaans: 'af',
                Albanian: 'sq',
                Arabic: 'ar',
                Azerbaijani: 'az',
                Basque: 'eu',
                Bengali: 'bn',
                Belarusian: 'be',
                Bulgarian: 'bg',
                Catalan: 'ca',
                Chinese: 'zh-CN',
                Croatian: 'hr',
                Czech: 'cs',
                Danish: 'da',
                Dutch: 'nl',
                english: 'en',
                Esperanto: 'eo',
                Estonian: 'et',
                Filipino: 'tl',
                Finnish: 'fi',
                French: 'fr',
                Galician: 'gl',
                Georgian: 'ka',
                German: 'de',
                greek: 'el',
                Gujarati: 'gu',
                Haitian: 'ht',
                Creole: 'ht',
                Hebrew: 'iw',
                Hindi: 'hi',
                Hungarian: 'hu',
                Icelandic: 'is',
                Indonesian: 'id',
                Irish: 'ga',
                Italian: 'it',
                Japanese: 'ja',
                Kannada: 'kn',
                Korean: 'ko',
                Latin: 'la',
                Latvian: 'lv',
                Lithuanian: 'lt',
                Macedonian: 'mk',
                Malay: 'ms',
                Maltese: 'mt',
                Norwegian: 'no',
                Persian: 'fa',
                Polish: 'pl',
                Portuguese: 'pt',
                Romanian: 'ro',
                Russian: 'ru',
                Serbian: 'sr',
                Slovak: 'sk',
                Slovenian: 'sl',
                Spanish: 'es',
                Swahili: 'sw',
                Swedish: 'sv',
                Tamil: 'ta',
                Telugu: 'te',
                Thai: 'th',
                Turkish: 'tr',
                Ukrainian: 'uk',
                Urdu: 'ur',
                Vietnamese: 'vi',
                Welsh: 'cy',
                Yiddish: 'yi'
            };

            var url = TTS_PROXY_URL + "?tl=" + languages[l] + "&q=" + card[l == 'english' ? 'front' : 'back'];

            $('#player').attr('src', url)[0].play();


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
                myStack.create($scope.cards,
                    function(key) {
                        $location.path('/s/' + key);
                    });
            } else {
				//TODO add alert here..
                //AlertCtrl.addAlert('danger', 'Please create a card first');
            }
    } //saveStack

    $scope.newStack = function() {
            $location.path('/');
            $rootScope.cards = [];
            $rootScope.front = "";
            $rootScope.back = "";
    } //newStack

});
