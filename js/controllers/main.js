'use strict';

angular

.module('controller.main', [])

.controller('main',	['$scope', 'editables', 'webservice', 'settings', 'messenger', 'protocolregistry', 'documentsource', 'journal',
	function ($scope, editables, webservice, settings, messenger, protocolregistry, documentsource, journal) {

		
		/* debug */
		$scope.cacheKiller = '?nd=' + Date.now();

		/* protocols */
		function getLastProtocol() {
			try {
				var p = localStorage.getItem('protocol');
				if (angular.isFunction(protocolregistry.protocols[p].onSelect)) {
					protocolregistry.protocols[p].onSelect()
				}
				return p;
			} catch (e) {}
			return ''
		}
		$scope.protocols = {
			list: protocolregistry.protocols,
			current: getLastProtocol()
		}
		$scope.protocol = {
			id: "none",
			ready: false
		}

		/* journal */
		$scope.journal = journal;

		/* backendData */
		$scope.backendData = {} //some backend specific data.. will be a far more complex object when there are different backends

		/* step control */
		$scope.steps = {
			list: {
				"home": 	{
					"template": "partials/view_home.html",
					"title": "Start",
					"condition": function() {return !$scope.isStarted}
				},
				"restart": 	{
					"template": "partials/view_restart.html",
					"title": "Restart",
					"condition": function() {return $scope.isStarted}
				},
				"overview": {
					"template": "partials/view_overview.html",
					"title": "Overview",
					"condition": function() {return documentsource.ready}
				},
				"articles": {
					"template": "partials/view_articles.html",
					"title": "Articles",
					"condition": function() {return documentsource.ready}
				},
				"publish": 	{
					"template": "partials/view_finish.html",
					"title": "Publish",
					"condition": function() {return $scope.isStarted && documentsource.ready && journal.isReadyToUpload()}}
			},
			current:"home",
			change: function(to) {

				if (typeof $scope.steps.list[to] === "undefined") {
					console.warn('view ' + to + ' does not exist');
					return;
				}

				if (to == $scope.steps.current) {
					return;
				}

				console.log('Tab change to: ', to);
				//$scope.message.reset();
				$scope.steps.current = to;
			}
		}




		/* initialize */
		$scope.isInitialized = false;

		$scope.init = function() {
			webservice.get('getRepository', {}, function(r) {
				if ((r.success === false) && (r.message === "Session locked")) { // @ TODO  do this in webservice!
					$scope.sessionLocked = true;
				} else if (r.success === true) {
					$scope.repository.update(r.repository);
				}

				// this will be at a different place for the folowing,
				// when there are actually different backends to choose
				webservice.get('getBackendData', {backend: 'ojs2'}, function(r) {
					if (r.success === true) {
						journal.setConstraints(r.backendData.journals);
					}
					$scope.isInitialized = true;
					messenger.alert("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Commodo odio aenean sed adipiscing diam. Orci ac auctor augue mauris augue. Amet justo donec enim diam vulputate. Consequat semper viverra nam libero. Eget aliquet nibh praesent tristique. Tristique senectus et netus et malesuada fames. Duis ut diam quam nulla porttitor massa. Leo vel orci porta non pulvinar neque laoreet. Eu turpis egestas pretium aenean pharetra magna ac. Viverra maecenas accumsan lacus vel facilisis volutpat est."+
						"Sed libero enim sed faucibus turpis in. In eu mi bibendum neque egestas congue quisque egestas. Mollis nunc sed id semper risus in hendrerit gravida rutrum. At augue eget arcu dictum. Sollicitudin ac orci phasellus egestas. Enim facilisis gravida neque convallis a cras semper. In ante metus dictum at tempor. Risus nec feugiat in fermentum. Ultricies tristique nulla aliquet enim tortor at. Nunc scelerisque viverra mauris in. Nibh tellus molestie nunc non blandit massa enim nec. Pulvinar proin gravida hendrerit lectus a. Aliquam purus sit amet luctus venenatis lectus. Arcu non odio euismod lacinia at. Congue quisque egestas diam in arcu. Curabitur vitae nunc sed velit dignissim sodales. Vel eros donec ac odio tempor orci dapibus."+
						"Turpis cursus in hac habitasse platea dictumst quisque. Bibendum neque egestas congue quisque egestas. Velit ut tortor pretium viverra suspendisse. Arcu dui vivamus arcu felis bibendum. Egestas erat imperdiet sed euismod nisi porta lorem. Malesuada nunc vel risus commodo viverra maecenas accumsan. Diam quis enim lobortis scelerisque fermentum dui faucibus in. Pellentesque dignissim enim sit amet venenatis urna cursus. Phasellus faucibus scelerisque eleifend donec. Velit aliquet sagittis id consectetur purus ut faucibus pulvinar. Nibh tellus molestie nunc non blandit massa enim nec. Dignissim suspendisse in est ante in nibh. Quam nulla porttitor massa id neque aliquam vestibulum morbi."+
						"Nisl condimentum id venenatis a condimentum vitae sapien pellentesque habitant. Tellus in metus vulputate eu. Ac turpis egestas integer eget aliquet. Nunc sed augue lacus viverra vitae. Varius duis at consectetur lorem donec massa. Eu volutpat odio facilisis mauris sit amet massa vitae tortor. Etiam dignissim diam quis enim lobortis. A iaculis at erat pellentesque adipiscing commodo elit at imperdiet. Amet consectetur adipiscing elit pellentesque habitant morbi tristique. Purus in mollis nunc sed. Tempus egestas sed sed risus pretium quam vulputate dignissim. At urna condimentum mattis pellentesque id nibh tortor id aliquet. Aliquam eleifend mi in nulla posuere."+
						"Vitae ultricies leo integer malesuada. Hendrerit gravida rutrum quisque non tellus orci ac auctor. Et malesuada fames ac turpis egestas maecenas pharetra. Sed nisi lacus sed viverra tellus in hac habitasse platea. Viverra suspendisse potenti nullam ac tortor vitae. Ipsum dolor sit amet consectetur adipiscing. Quis enim lobortis scelerisque fermentum dui faucibus in. Commodo elit at imperdiet dui accumsan. Suspendisse ultrices gravida dictum fusce. Libero id faucibus nisl tincidunt eget nullam non nisi. Risus viverra adipiscing at in tellus integer feugiat scelerisque. Mauris nunc congue nisi vitae suscipit tellus mauris a diam. Arcu non sodales neque sodales ut etiam sit."+
						"Pellentesque diam volutpat commodo sed egestas egestas. Eget egestas purus viverra accumsan. Fringilla est ullamcorper eget nulla facilisi etiam. Adipiscing elit ut aliquam purus sit. Scelerisque eleifend donec pretium vulputate sapien nec sagittis aliquam. Quis vel eros donec ac odio tempor orci dapibus. Blandit cursus risus at ultrices mi tempus imperdiet nulla malesuada. Aliquam vestibulum morbi blandit cursus risus at. Sit amet venenatis urna cursus eget nunc scelerisque viverra mauris. Aenean vel elit scelerisque mauris pellentesque. Facilisis sed odio morbi quis commodo odio. Vel facilisis volutpat est velit egestas dui. Bibendum at varius vel pharetra vel turpis nunc. Suspendisse potenti nullam ac tortor vitae purus faucibus ornare. In egestas erat imperdiet sed euismod nisi porta lorem. Adipiscing at in tellus integer feugiat. Odio facilisis mauris sit amet massa vitae. Porta nibh venenatis cras sed felis eget. Mattis nunc sed blandit libero volutpat. Tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada."+
						"Faucibus a pellentesque sit amet porttitor eget dolor morbi non. Dui accumsan sit amet nulla facilisi morbi tempus iaculis urna. Sollicitudin ac orci phasellus egestas. Donec enim diam vulputate ut pharetra. Volutpat diam ut venenatis tellus in metus vulputate eu scelerisque. At lectus urna duis convallis convallis. Gravida quis blandit turpis cursus in hac. At risus viverra adipiscing at in tellus. Nibh tellus molestie nunc non blandit massa enim nec. Cursus risus at ultrices mi tempus imperdiet nulla malesuada pellentesque. Ut etiam sit amet nisl purus in. Aliquam ultrices sagittis orci a. Elit sed vulputate mi sit amet mauris commodo quis. Ullamcorper malesuada proin libero nunc."+
						"Cras pulvinar mattis nunc sed blandit libero volutpat. Quisque egestas diam in arcu cursus euismod quis viverra nibh. Viverra orci sagittis eu volutpat odio facilisis mauris. Urna porttitor rhoncus dolor purus non enim praesent. Malesuada nunc vel risus commodo viverra maecenas accumsan lacus vel. Tellus rutrum tellus pellentesque eu tincidunt tortor. Dolor magna eget est lorem ipsum. Enim ut sem viverra aliquet. Nibh cras pulvinar mattis nunc. Odio facilisis mauris sit amet massa vitae tortor condimentum lacinia. Magna etiam tempor orci eu lobortis elementum nibh tellus molestie."+
						"Et odio pellentesque diam volutpat commodo sed egestas egestas. In nulla posuere sollicitudin aliquam ultrices sagittis orci. Sit amet commodo nulla facilisi nullam vehicula ipsum a. Nunc sed augue lacus viverra vitae congue eu. Sit amet dictum sit amet justo donec. Sit amet commodo nulla facilisi nullam vehicula. Etiam tempor orci eu lobortis elementum nibh tellus. Lectus magna fringilla urna porttitor. Praesent elementum facilisis leo vel fringilla est. Pretium viverra suspendisse potenti nullam ac tortor vitae. Ac felis donec et odio pellentesque. Enim facilisis gravida neque convallis a cras semper auctor. Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue."+
						"Tellus pellentesque eu tincidunt tortor. Mus mauris vitae ultricies leo integer malesuada. Interdum consectetur libero id faucibus. Lectus quam id leo in vitae turpis massa sed elementum. Ac turpis egestas maecenas pharetra convallis posuere morbi leo. Diam quis enim lobortis scelerisque. Pellentesque habitant morbi tristique senectus et. Purus in mollis nunc sed id semper risus in hendrerit. Enim ut sem viverra aliquet eget sit. Imperdiet nulla malesuada pellentesque elit eget gravida cum sociis. Et tortor at risus viverra adipiscing at. Egestas diam in arcu cursus euismod quis viverra nibh cras. Ut sem nulla pharetra diam sit. Mus mauris vitae ultricies leo integer malesuada nunc vel risus."
					);
				});
			});
		}


		/* restart */
		$scope.restart = function() {
			$scope.isInitialized = false;
			$scope.isStarted = false;
			messenger.content.stats = {}
			documentsource.reset();
			journal.reset();
			$scope.init();
			$scope.protocol.onInit();
			messenger.alert('Restart Importer', false);
			$scope.steps.change('home');
		}


		/* document repository */
		$scope.repository = {
			list: [],
			update: function (repository, selected) {
				$scope.repository.list = webservice.repository = repository;
				if (typeof selected !== "undefined") {
					$scope.journal.data.importFilePath = selected;
				}
			}
		}

		/* security */
		$scope.sec = webservice.sec;

		/* ctrl */

		$scope.isStarted = false;

		$scope.selectProtocol = function() {
			var toBeSelected = $scope.protocols.list[$scope.protocols.current];
			journal.reset();
			if (angular.isFunction(toBeSelected.onSelect)) {
				toBeSelected.onSelect();
			}
		}

		$scope.start = function() {
			//checkPW
			webservice.get('checkStart', {'file': $scope.journal.data.importFilePath, 'unlock': true, 'journal': $scope.journal.data}, function(response) {
				if (response.success) {
					$scope.protocol = $scope.protocols.list[$scope.protocols.current];
					localStorage.setItem('protocol', $scope.protocol.id);
					$scope.steps.change($scope.protocol.startView || 'overview');
					$scope.isStarted = true;
					if (angular.isFunction($scope.protocol.onInit)) {
						$scope.protocol.onInit();
					} else {

					}
				} else {
					$scope.sec.password = '';
				}
			});
		}


		/* some pdf things happen outside angular and need this */
		$scope.$on('refreshView', function() {
			if(!$scope.$$phase) {
				$scope.$apply();
			}
		})

		/* forward events to current protocol */
		$scope.$on('gotFile', function($event, data) {
			if (angular.isFunction($scope.protocol.onGotFile)) {
				$scope.protocol.onGotFile(data)
			}
		})
		$scope.$on('gotAll', function($event, data) {
			if (angular.isFunction($scope.protocol.onAll)) {
				$scope.protocol.onAll(data)
			}
		})




		/*
		$scope.test = editables.multilingualtext('anything', true, journal.locales);
		$scope.test.value.some = "data"
		//*/
	}
]);