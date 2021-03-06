angular.module('InTouch')

.factory('Comments', Comments);

Comments.$inject = ['$q', '$http'];

function Comments($q, $http) {

  var commentsFnct = {
    postComment: postComment,
    getAnnounceComments: getAnnounceComments,
    deleteComment: deleteComment
  };

  return commentsFnct;

  function postComment(comment, id) {
    var deferred = $q.defer();
    $http.post('/api/announceComment/' + id, comment).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function getAnnounceComments(id) {
    var deferred = $q.defer();
    $http.get('/api/announceComment/' + id).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function deleteComment(id) {
    var deferred = $q.defer();
    $http.delete('/api/announceComment/' + id).success(function(data) {
      deferred.resolve(data);
    }).error(function() {
      deferred.reject();
    });
    return deferred.promise;
  }

}
