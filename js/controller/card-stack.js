var studystack = angular.module('studystack', ['ui.bootstrap', 'gajus.swing', 'firebase', 'ngRoute']).constant('FIREBASE_URL', 'https://greekcards.firebaseio.com/').constant('TTS_PROXY_URL', 'http://greek.webuda.com/voice.php');

studystack.config(['$routeProvider', function ($routeProvider) {
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


studystack.factory('myStack', function ($firebase, $routeParams, FIREBASE_URL) {
  var s = {};
  var cards = [];
  var sid;

  s.getCards = function (sid) {
    cards = $firebase(new Firebase(FIREBASE_URL + "/" + sid)).$asArray();
    return cards;
  };

  s.addCards = function (card) {
    cards.push(card);
    return cards;
  }

  s.create = function (cards, complete) {
    //console.log('saving stack');
    var rootref = new Firebase(FIREBASE_URL);
    var root = $firebase(rootref);

    root.$push({
      temp: Firebase.ServerValue.TIMESTAMP
    }).then(function (ref) {

      sid = ref.key();
      //fconsole.log(sid);
      var current = $firebase(rootref.child(sid));

      for (var i = 0; i < cards.length; i++) {
        current.$push(angular.copy(cards[i]));
      }
      current.$remove('temp');
    }).then(function () {
      complete(sid);
    });
  }; // create
  return s;
});


studystack.controller('card-stack', function ($rootScope, $scope, $firebase, $location, $routeParams, myStack, FIREBASE_URL, TTS_PROXY_URL) {


  if ($routeParams.sId === undefined && $routeParams.fl === undefined && $routeParams.bl === undefined) {
    no_params();
  } else if ($routeParams.sId) {
    one_params();
  } else if ($routeParams.fl && $routeParams.bl) {
    two_params();
  }



  function no_params() {
    console.log('0 params');

    set_languages('en', 'el');
    empty_stack();
  }

  function one_params() {
    console.log('1 params');

    load_stack();
  }

  function two_params() {
    console.log('2 params');

    if (is_language($routeParams.fl) && is_language($routeParams.bl)) {
      set_languages($routeParams.fl, $routeParams.bl);
      empty_stack();
    } else {
      alert('wrong parameters');
    }
  }


  function set_languages(fl, bl) {
    $rootScope.fl = fl;
    $rootScope.bl = bl;
  }

  function is_language(language) {
    return true;
  }

  function empty_stack() {
    $rootScope.cards = [];
    $rootScope.haveStack = false;
  }

  function full_stack(cards) {
    $rootScope.cards = cards;
    $rootScope.haveStack = true;
  }

  function load_stack() {
    var root = new Firebase(FIREBASE_URL);
    var stack = new Firebase(FIREBASE_URL + "/" + $routeParams.sId);
    var cards = $firebase(stack).$asArray();

    cards.$loaded().then(function (data) {
      if (cards.length > 0) {
        full_stack(cards);
      } else {
        alert('no stack found with this id');
        set_languages('en', 'el');
        empty_stack();
      }
    });
  }

  $scope.addCard = function () {
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

  $scope.listen = function (index) {
     $('li.card_' + index + ' > audio:not(.ng-hide)')[0].play();
  } // listen

  $scope.reset = function () {
    $('input').each(function () {
      $(this).toggle().not('.phonetic').focus();
    });
  } // reset
});


studystack.controller('DropdownCtrl', function ($rootScope, $scope, $routeParams, $location, myStack) {
  $scope.saveStack = function () {
    if ($rootScope.cards.length > 0) {
      myStack.create($scope.cards, function (key) {
        $location.path('/' + key);
      });
    } else {
      alert('Please create a card first');
    }
  } //saveStack
  $scope.newStack = function () {
    $location.path('/');
    $rootScope.cards = [];
    $rootScope.front = "";
    $rootScope.back = "";
  } //newStack
});


/* Fix for
 * Error: error:insecurl
 * Processing of a Resource from Untrusted Source Blocked
 * 
 **/
studystack.filter('trustUrl', function ($sce) {
  return function (url) {
    return $sce.trustAsResourceUrl(url);
  };
});
