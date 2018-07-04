/**
 * this will be the successor of journalmaster and stuff
 * it will have analyzer (fileHandler) (may be journal specific)
 * it will also have a datasource : folder or pdf


*/
angular

.module('controller.view_documents', [])

.controller('view_documents', ['$scope', 'file_handler_manager', 'staging_dir', 'pdf_file_manager',
    function($scope, file_handler_manager, staging_dir, pdf_file_manager) {

        $scope.fileHandlers = file_handler_manager.fileHandlers;
        $scope.getSelectedFileHandler = file_handler_manager.getFileHandler;
        $scope.selectFileHandler = file_handler_manager.selectFileHandler;
        $scope.staging_dir = staging_dir;
        $scope.filesListSelected = null;

        $scope.loadFiles = function() {
            pdf_file_manager.getDocuments($scope.filesListSelected);
        }

    }
]);