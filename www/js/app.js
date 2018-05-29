angular.module("cars_wallpaper", ["ngCordova","ionic","ionMdInput","ionic-material","ion-datetime-picker","ionic.rating","utf8-base64","angular-md5","chart.js","pascalprecht.translate","tmh.dynamicLocale","ionicLazyLoad","cars_wallpaper.controllers", "cars_wallpaper.services"])
	.run(function($ionicPlatform,$window,$interval,$timeout,$ionicHistory,$ionicPopup,$state,$rootScope){

		$rootScope.appName = "Cars Wallpaper" ;
		$rootScope.appLogo = "data/images/avatar/pic0.jpg" ;
		$rootScope.appVersion = "1.0" ;
		$rootScope.headerShrink = true ;

		$ionicPlatform.ready(function() {
			//required: cordova plugin add ionic-plugin-keyboard --save
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}

			//required: cordova plugin add cordova-plugin-statusbar --save
			if(window.StatusBar) {
				StatusBar.styleDefault();
			}
			// this will create a banner on startup
			//required: cordova plugin add cordova-plugin-admobpro --save
			if (typeof AdMob !== "undefined"){
				var admobid = {};
				admobid = {
					banner: "ca-app-pub-9611876822926668/9592814649",
					interstitial: "ca-app-pub-9611876822926668/1038734879",
					rewardvideo: ""
				};
				$timeout(function(){
					
					AdMob.createBanner({
						adId: admobid.banner,
						overlap: false,
						autoShow: true,
						offsetTopBar: false,
						position: AdMob.AD_POSITION.BOTTOM_CENTER,
						bgColor: "black"
					});
					
					AdMob.prepareInterstitial({
						adId: admobid.interstitial,
						autoShow: true,
					});
					
				}, 1000);
			
			
				$timeout(function(){
				}, 30000);
			}

			localforage.config({
				driver : [localforage.WEBSQL,localforage.INDEXEDDB,localforage.LOCALSTORAGE],
				name : "cars_wallpaper",
				storeName : "cars_wallpaper",
				description : "The offline datastore for Cars Wallpaper app"
			});



			//required: cordova plugin add onesignal-cordova-plugin --save
			if(window.plugins && window.plugins.OneSignal){
				window.plugins.OneSignal.enableNotificationsWhenActive(true);
				var notificationOpenedCallback = function(jsonData){
					try {
						$timeout(function(){
							$window.location = "#/cars_wallpaper/" + jsonData.notification.payload.additionalData.page ;
						},200);
					} catch(e){
						console.log("onesignal:" + e);
					}
				}
				window.plugins.OneSignal.startInit("5e93c633-3af3-4d6e-b9ea-7943eda1a931").handleNotificationOpened(notificationOpenedCallback).endInit();
			}    


		});
		$ionicPlatform.registerBackButtonAction(function (e){
			if($ionicHistory.backView()){
				$ionicHistory.goBack();
			}else{
				$state.go("cars_wallpaper.dashboard");
			}
			e.preventDefault();
			return false;
		},101);
	})


	.filter("to_trusted", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])

	.filter("trustUrl", function($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	})

	.filter("trustJs", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsJs(text);
		};
	}])

	.filter("strExplode", function() {
		return function($string,$delimiter) {
			if(!$string.length ) return;
			var $_delimiter = $delimiter || "|";
			return $string.split($_delimiter);
		};
	})

	.filter("strDate", function(){
		return function (input) {
			return new Date(input);
		}
	})
	.filter("strHTML", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.filter("strEscape",function(){
		return window.encodeURIComponent;
	})
	.filter("strUnscape", ["$sce", function($sce) {
		var div = document.createElement("div");
		return function(text) {
			div.innerHTML = text;
			return $sce.trustAsHtml(div.textContent);
		};
	}])

	.filter("objLabel", function(){
		return function (obj) {
			var new_item = [];
			angular.forEach(obj, function(child) {
				new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v,l) {
					if (indeks !== 0) {
					new_item.push(l);
				}
				indeks++;
				});
			});
			return new_item;
		}
	})
	.filter("objArray", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if (indeks !== 0){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})


.config(["$translateProvider", function ($translateProvider){
	$translateProvider.preferredLanguage("en");
	$translateProvider.useStaticFilesLoader({
		prefix: "translations/",
		suffix: ".json"
	});
}])


.config(function(tmhDynamicLocaleProvider){
	tmhDynamicLocaleProvider.localeLocationPattern("lib/ionic/js/i18n/angular-locale_{{locale}}.js");
	tmhDynamicLocaleProvider.defaultLocale("en");
})


.config(function($stateProvider, $urlRouterProvider,$sceDelegateProvider,$httpProvider,$ionicConfigProvider){
	try{
		// Domain Whitelist
		$sceDelegateProvider.resourceUrlWhitelist([
			"self",
			new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?w3schools\.com/.+$'),
		]);
	}catch(err){
		console.log("%cerror: %cdomain whitelist","color:blue;font-size:16px;","color:red;font-size:16px;");
	}
	$stateProvider
	.state("cars_wallpaper",{
		url: "/cars_wallpaper",
			abstract: true,
			templateUrl: "templates/cars_wallpaper-side_menus.html",
			controller: "side_menusCtrl",
	})

	.state("cars_wallpaper.about_us", {
		url: "/about_us",
		cache:false,
		views: {
			"cars_wallpaper-side_menus" : {
						templateUrl:"templates/cars_wallpaper-about_us.html",
						controller: "about_usCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("cars_wallpaper.bookmarks", {
		url: "/bookmarks",
		views: {
			"cars_wallpaper-side_menus" : {
						templateUrl:"templates/cars_wallpaper-bookmarks.html",
						controller: "bookmarksCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("cars_wallpaper.categories", {
		url: "/categories",
		cache:true,
		views: {
			"cars_wallpaper-side_menus" : {
						templateUrl:"templates/cars_wallpaper-categories.html",
						controller: "categoriesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("cars_wallpaper.dashboard", {
		url: "/dashboard",
		cache:true,
		views: {
			"cars_wallpaper-side_menus" : {
						templateUrl:"templates/cars_wallpaper-dashboard.html",
						controller: "dashboardCtrl"
					},
			"fabButtonUp" : {
						template: '<button id="fab-up-button" ng-click="scrollTop()" class="button button-fab button-fab-bottom-right button-energized-900 spin"><i class="icon ion-arrow-up-a"></i></button>',
						controller: function ($timeout) {
							$timeout(function () {
								document.getElementById("fab-up-button").classList.toggle("on");
							}, 900);
						}
					},
		}
	})

	.state("cars_wallpaper.faqs", {
		url: "/faqs",
		views: {
			"cars_wallpaper-side_menus" : {
						templateUrl:"templates/cars_wallpaper-faqs.html",
						controller: "faqsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("cars_wallpaper.language", {
		url: "/language",
		views: {
			"cars_wallpaper-side_menus" : {
						templateUrl:"templates/cars_wallpaper-language.html",
						controller: "languageCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("cars_wallpaper.post_bookmark", {
		url: "/post_bookmark",
		cache:false,
		views: {
			"cars_wallpaper-side_menus" : {
						templateUrl:"templates/cars_wallpaper-post_bookmark.html",
						controller: "post_bookmarkCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("cars_wallpaper.post_singles", {
		url: "/post_singles/:id",
		cache:false,
		views: {
			"cars_wallpaper-side_menus" : {
						templateUrl:"templates/cars_wallpaper-post_singles.html",
						controller: "post_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("cars_wallpaper.posts", {
		url: "/posts",
		cache:false,
		views: {
			"cars_wallpaper-side_menus" : {
						templateUrl:"templates/cars_wallpaper-posts.html",
						controller: "postsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("cars_wallpaper.slide_tab_menu", {
		url: "/slide_tab_menu",
		views: {
			"cars_wallpaper-side_menus" : {
						templateUrl:"templates/cars_wallpaper-slide_tab_menu.html",
						controller: "slide_tab_menuCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("cars_wallpaper.users", {
		url: "/users",
		cache:false,
		views: {
			"cars_wallpaper-side_menus" : {
						templateUrl:"templates/cars_wallpaper-users.html",
						controller: "usersCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	$urlRouterProvider.otherwise("/cars_wallpaper/dashboard");
});
