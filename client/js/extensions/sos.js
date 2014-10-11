// To enable SOS, you need to build the Cordova wrapper with the SOS SDK, and then
// add this function to the CaseCtrl in case.js. Then uncomment the button in case.html.
$scope.sos = function() {
    var user = JSON.parse($window.localStorage.getItem('user'));
    $window.location = 'sos://' + user.email;
}
