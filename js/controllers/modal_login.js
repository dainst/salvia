
angular

    .module('controller.login', ['ui.bootstrap'])

    .controller('login', ['$scope', '$uibModalInstance', 'webservice', '$timeout',
        function ($scope, $uibModalInstance, webservice, $timeout) {

            $scope.loginData = {};
            $scope.loginerror = false;

            $scope.login = function () {
                if($scope.loginData.username) {

                    $uibModalInstance.close($scope.loginData);
                }else{
                    $scope.loginerror = true;
                }
                //TODO get auth

            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }]);
