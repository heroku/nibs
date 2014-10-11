// Enable journeybuilder endpoints in server.js to use this
angular.module('nibs.journeybuilder', [])

.factory('JourneyBuilder', function ($http, $rootScope) {
    return {
        trigger_journey: function(data) {
            return $http.post($rootScope.server.url + '/journeybuilder/trigger_journey', data);
        },
        load_survey: function() {
            return $http.get($rootScope.server.url + '/journeybuilder/load_survey');
        },

        start_survey_poller: function() {
          $rootScope.poller = setInterval(function() {
            if ($window.localStorage.getItem('token')) {
                this.load_survey()
                    .success(function(survey) {
                        if (survey != "false") {
                            console.log('load_survey success');
                            console.log(survey);
                            $rootScope.openSurveyDialog(survey);
                            //JBSurvey(survey, $rootScope);
                        }
                    }).catch(function() {});
            }
          }, 10000);
        }
    };
})

.controller('SurveyCtrl', function($rootScope, $ionicModal) {
    $ionicModal.fromTemplateUrl('templates/journey_builder_survey.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openSurveyDialog = function(survey) {
        $scope.questions = [{question: survey.q1_text, choices:survey.q1_choices.split(',')},
                            {question: survey.q2_text, choices:survey.q2_choices.split(',')}];
        $scope.modal.show();
    };

    $rootScope.openSurveyDialog = $scope.openSurveyDialog;
})
