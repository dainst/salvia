angular
.module('module.pdf_file_manager', ['module.messenger', 'module.webservice'])
.factory('pdf_file_manager', ['$rootScope', 'settings', 'webservice', 'messenger', 'dataset', 'editables', 'file_manager',
    function($rootScope, settings, webservice, messenger, dataset, editables, file_manager) {

    const pdf_file_manager = {};

    const requirePdfJs = new Promise(function(resolve) {
        // include pdf.js (& require) with npm as well and replace this stuff
        require.config({paths: {'pdfjs': 'inc/pdf.js'}});
        require(['pdfjs/display/api', 'pdfjs/display/global'], function(pdfjs_api, pdfjs_global) {
            console.log('2. required pdf.js');
            pdf_file_manager.status  = 'pdf.js loaded';

            pdf_file_manager.PDF = {
                "api": pdfjs_api,
                "global": pdfjs_global,
                "data": null,
                'object': null
            };

            pdf_file_manager.PDF.global.PDFJS.workerSrc = 'js/other/pdfjs_worker_loader.js';
            resolve();
        });
    });

    const loadFiles = function(filesToLoad) {
        pdf_file_manager.ready = false;

        const loadFilePromises = [];

        for (let fileid in filesToLoad) {

            let url = settings.files_url + filesToLoad[fileid].path;

            let promise = new Promise(
                function documentPromiseResolve(resolve, fail) {

                    pdf_file_manager.PDF.api.getDocument(url).then(
                        function onGotDocument(pdf) {
                            let fileInfo = {
                                pdf: pdf,
                                filename: filesToLoad[fileid].name,
                                url: this.url,
                                pagecontext: new editables.types.Pagecontext({maximum: pdf.pdfInfo.numPages, path: this.url})
                            };

                            let promise1 = pdf.getMetadata().then(function(meta) {
                                console.log(meta);
                                this.meta = meta.info
                            }.bind(fileInfo));
                            let promise2 = pdf.getDownloadInfo().then(function(dil) {
                                function fileSize(b) {
                                    let u = 0, s = 1024;
                                    while (b >= s || -b >= s) {
                                        b /= s;//
                                        u++;
                                    }
                                    return (u ? b.toFixed(1) + ' ' : b) + ' KMGTPEZY'[u] + 'B';
                                }

                                this.size = fileSize(dil.length);
                            }.bind(fileInfo));

                            file_manager.loadedFiles[this.url] = fileInfo;

                            let metadataLoaded = function () {
                                dataset.loadedFiles[this.url] = {
                                    size: this.size,
                                    url: this.url,
                                    pagecontext: this.pagecontext
                                };
                                messenger.info('document: ' + this.url + ' loaded');
                                file_manager.stats.loaded += 1;
                                refreshView();
                                resolve();
                            }.bind(fileInfo);


                            Promise.all([promise1, promise2]).then(metadataLoaded, metadataLoaded);
                            // if metadata could not be loaded, it's no reason not to continue, therefore we don't fail


                        }.bind(
                            {
                                filename: filesToLoad[fileid].name,
                                url: filesToLoad[fileid].path
                            }
                        ),

                        function onFailDocument(reason) {
                            messenger.warning("get document " + url + " failed: " + reason, true);
                            resolve(); //!
                        }
                    )
                }
            );
            loadFilePromises.push(promise);
        }
        return loadFilePromises;
    };

    pdf_file_manager.loadFiles = function(file) {
        //  TODO make recursive!
        console.log("Load File: ", file);

        const filesToLoad = (file.type === 'directory') ? file.contents : [file];
        file_manager.ready = false;
        file_manager.stats.files += filesToLoad.length;

        return new Promise((resolve, reject) => {
            requirePdfJs.then(function() {
                Promise.all(loadFiles(filesToLoad)).then(function() {
                    if (filesToLoad.length > 1) {
                        messenger.success("All Files loaded");
                    }
                    file_manager.ready = true;
                    refreshView();
                    resolve(filesToLoad);
                }).catch(reject);
            });
        });

    };

    /**
     *
     * @param article
     * @returns {*}
     */
    pdf_file_manager.getFileInfo = function(article) {

        if (article.filepath.value.value === 'none') {
            return {}
        }
        let file = file_manager.loadedFiles[article.filepath.value.value];
        if (angular.isUndefined(file)) {
            return {'alert': 'file not known'}
        }

        return {
            'pages': file.pagecontext.maximum,
            'page offset': file.pagecontext.offset,
            'size': file.size
        }

    };

    /**
     * trigger trumbnail recreation (on page or filepath change)
     */
    $rootScope.$on('thumbnaildataChanged', function($event, article) {
        if (article.pages.value.startPdf === 0) { // while creation
            return;
        }
        if (angular.isUndefined(article.filepath)) {
            return;
        }
        if (!angular.isUndefined(file_manager.loadedFiles[article.filepath.value.value])) {
            article.pages.context = file_manager.loadedFiles[article.filepath.value.value].pagecontext;
            pdf_file_manager.updateThumbnail(article);
        } else {
            article.pages.resetContext();
            pdf_file_manager.removeThumbnail(article._.id);
        }
    });


    /**
     * call this from a button or something ...
     * @param article
     */
    pdf_file_manager.updateThumbnail = function(article) {
        console.log("recreate thumbnail for", article._.id, article.pages.value.startPdf, article.filepath.value.value);
        file_manager.loadedFiles[article.filepath.value.value].pdf.getPage(article.pages.value.startPdf).then(
            function updateThumbnailGotPageSuccess(page) {
                pdf_file_manager.createThumbnail(page, article._.id)
            },
            function updateThumbnailGotPageFail(page) {
                messenger.error("Page " + article.pages.value.startPdf + " not found");
                console.log('page not found', article.pages.value.startPdf, article._.id);
                pdf_file_manager.removeThumbnail(article._.id)
            }
        );
    };


    /**
     * ... or this from inside a getPage promise
     * @param page
     * @param containerId
     */
    pdf_file_manager.createThumbnail = function(page, containerId) {
        let container = angular.element(document.querySelector('#thumbnail-container-' + containerId));
        let img = container.find('img');

        let viewport = page.getViewport(1.5); // scale 1.5
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.height = viewport.height; // 626.16 * 1.5
        canvas.width = viewport.width; // 399.84 * 1.5

        let renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        container.addClass('loader');
        img.unbind('load');
        img.on("load", function() {
            container.removeClass('loader');
        });

        page.render(renderContext).then(function(){
            console.log("thumbnail created");
            ctx.globalCompositeOperation = "destination-over";
            ctx.fillStyle = "#123456";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            dataset.thumbnails[containerId] = canvas.toDataURL();
            file_manager.stats.thumbnails = Object.keys(dataset.thumbnails).length;
            refreshView()
        });

    };

    pdf_file_manager.removeThumbnail = function(containerId) {
        console.log("thumbnail removed", containerId);
        delete dataset.thumbnails[containerId];
        file_manager.stats.thumbnails = Object.keys(dataset.thumbnails).length;
    };

    /**
     * since the pdf.js stuff is happening outside angular is is ansync we need this shit here
     *
     */
    function refreshView() {
        $rootScope.$broadcast('refreshView');
    }

    return pdf_file_manager;


}]);