angular.module('InTouch')
.controller('ShowAnnounceAngCtrl', ShowAnnounceAngCtrl);

ShowAnnounceAngCtrl.$inject = ['$injector', '$routeParams', '$rootScope'];

function ShowAnnounceAngCtrl($injector, $routeParams, $rootScope) {
  
  var vm              = this;
  
  var socket          = $injector.get('socket');
  var Announce        = $injector.get('Announce');
  var toaster         = $injector.get('toaster');
  var appLoading      = $injector.get('appLoading');
  var Friends         = $injector.get('Friends');
  var Comments        = $injector.get('Comments');
  
  vm.findOne          = findOne;
  vm.getComments      = getComments;
  vm.postComment      = postComment;
  vm.removeComment    = removeComment;
  vm.initViewAnnounce = initViewAnnounce;
  vm.followUser       = followUser;
  vm.testIfFriend     = testIfFriend;
  vm.countFriends     = countFriends;

  appLoading.ready();

  $localStorage.searchField = null;

  ///////////////////////////////////////////////////////////////////////////

  function testIfFriend(announce) {
    if ($rootScope.currentUser) {
      Friends.testIfFriend({
        idUser: $rootScope.currentUser._id,
        username: announce.creator.username
      }).then(function(response) {

        vm.followStatus = response;
        console.log(vm.followStatus);
        console.log(response);
      });
    }
  }

  function countFriends(announce) {
    Friends.countFriends({
      idUser: announce.creator._id._id
    }).then(function(response) {
      vm.nbFriend = response;
    });
  }

  function findOne() {
    Announce.getAnnounceById($routeParams.announceId).then(function(res) {
      console.log('announce found________');
      console.log(res);
      vm.announce = res;

      if (vm.announce.title.length > 34) {
        vm.announce.title = vm.announce.title.substring(0, 35) + '...';
      }
      if (vm.announce.content.length > 34) {
        console.log(vm.announce.content.length);
        vm.announce.content = vm.announce.content.substring(0, 35) + '...';
      }
      vm.testIfFriend(vm.announce);
      vm.countFriends(vm.announce);
      vm.announceRating = res.rating;
      vm.selectedImages = res.images;
    });
  }

  function followUser(userDes, idUser) {
    console.log('_____follow_____');
    console.log(idUser);
    vm.suggestions = '';
    Friends.postFriend({
      usernameWaitFriendRequest: userDes,
      idUser: idUser
    }).then(function(response) {
      console.log('friend request done');
    });
    console.log('toaster');
    toaster.pop('success', 'Vous avez envoyé une requête d\'amitié');
    if ($rootScope.currentUser) {
      socket.emit('sendFriendRequest', {
        user: $rootScope.currentUser.username,
        userDes: userDes,
        userDesId: idUser,
        id: $rootScope.currentUser._id
      });

      vm.followStatus = 2;
    }
  }

  function getComments() {
    Comments.getAnnounceComments($routeParams.announceId)
    .then(function(res) {
      console.log('GET COMMENTS');
      vm.comments = res;
      console.log(vm.comments);
    });
  }

  function postComment() {

    Comments.postComment({
      content: vm.AnnounceComment,
      rating: vm.rating,
    }, $routeParams.announceId).then(function(res) {
      if (res.newRating !== null) {
        vm.announceRating = res.newRating;
      }
      vm.AnnounceComment = '';
      vm.getComments();
    });
  }

  function removeComment(comment) {
    Comments.deleteComment(comment._id).then(function(res) {
      for (var i in vm.comments) {
        if (vm.comments[i] == comment) {
          vm.comments.splice(i, 1);
        }
      }
    });
  }

  function initViewAnnounce() {
    console.log('__AnnouncesCtrl $scope.initViewAnnounce__');
    vm.findOne();
    vm.getComments();
  }
}
