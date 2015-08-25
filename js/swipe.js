var app = angular.module('SwipeApp', []);

app.controller('SwipeCtrl', ['$scope', 'FlickrService', function ($scope, FlickrService) {
'use strict';
    FlickrService.get().success(function (data) {        
        $scope.photos = data.photos;
        document.getElementById('swiper').style.width = $scope.photos.length * 100 + '%';        
    });

    var swipe = {

        slideWidth: document.body.clientWidth,
        touchstartx: undefined,
        touchmovex: undefined,
        movex: 0,        
        index: 0,        
        currentY: 0,
        isWebkit: undefined,

        slideDistance: function(){
            return (window.innerWidth > 660) ? 600 : 300;
        },

        setSwipeTransformX: function (x) {
            if (this.isWebkit) {
                document.getElementById('swiper').style.webkitTransform = 'translate3d(-' + x + 'px,0,0)';
            } else {
                document.getElementById('swiper').style.transform = 'translate3d(-' + x + 'px,0,0)';
            }
        },

        init: function () {
            this.bindUIEvents();

            var testEl = document.createElement('div');
            testEl.style.webkitTransform = 'translate(0)';
            this.isWebkit = Boolean(testEl.getAttribute('style').toLowerCase().indexOf('webkit') !== -1);
        },

        bindUIEvents: function () {
            var slider = document.getElementById("swiper"),
                self = this;
            slider.addEventListener("touchstart", function (e) { self.start(e); });
            slider.addEventListener("touchmove", function (e) { self.move(e); });
            slider.addEventListener("touchend", function (e) { self.end(e); });
        },

        getCurrentPos: function (){
            if(this.index === 0){
                return 0 + this.movex;
            }
            return (this.slideDistance() * this.index + this.movex);
        },


        start: function (event) {            
            document.getElementById('swiper').classList.remove('isSliding');
            event.target.classList.add('isTouched');
            this.touchstartx = event.touches[0].pageX || event.changedTouches[0].pageX;
        },

        move: function (event) {
            event.stopPropagation(); 
            event.stopImmediatePropagation();
            this.touchmovex = event.touches[0].pageX || event.changedTouches[0].pageX;
            this.movex = this.touchstartx - this.touchmovex;           
            this.setSwipeTransformX(this.getCurrentPos());            
        },

        end: function (event) {
            document.getElementById('swiper').classList.add('isSliding');            

            if (Math.abs(this.movex) > (this.slideWidth / 10)) {
                if (this.movex > 0) { this.index += 1; }
                else if (this.index >= 1) { this.index -= 1; }
            }
            this.currentY = this.slideDistance() * this.index;
            this.setSwipeTransformX(this.currentY);            
            event.target.classList.remove('isTouched');
            this.movex = 0;            
        }
    };
    swipe.init();

} ]);

app.factory('FlickrService', ['$http', function ($http) {
'use strict';
    return {
        xmlhttp: function (req) {
            return $http(req)
                .success(function (data) {
                    return data;
                })
                .error(function (err) {
                    return err;
                });
        },

        get: function () {

            var req = {
                method: 'GET',
                url: 'http://denniscalvert.azurewebsites.net/api/flickr/'
            };
            return this.xmlhttp(req);
        }
    };
} ]);