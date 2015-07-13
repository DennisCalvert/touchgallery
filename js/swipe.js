var app = angular.module('SwipeApp', [])

app.controller('SwipeCtrl', ['$scope', 'FlickrService', function ($scope, FlickrService) {

    FlickrService.get().success(function (data) {         
        $scope.photos = data.photos;
        document.getElementById('swiper').style.width = $scope.photos.length * 100 + '%';
        console.log(document.getElementById('swiper').style.width);
    });

        var swipe = {

        slideWidth: document.body.clientWidth,
        touchstartx: undefined,
        touchmovex: undefined,
        movex: 0,
        longTouch: undefined,
        index: 0,
        //slideCount = document.getElementById('swiper').getElementsByClassName('slide').length,
        currentY: 0,

        init: function () {
            this.bindUIEvents();

            //document.getElementById('swiper').style.width = document.getElementById('swiper').getElementsByClassName('slide').length * 100 + '%';
            //document.getElementById('swiper').style.width = 1000 + '%';
        },

        bindUIEvents: function () {
            var slider = document.getElementById("swiper"),
                self = this;
            slider.addEventListener("touchstart", function (e) { self.start(e) });
            slider.addEventListener("touchmove", function (e) { self.move(e) });
            slider.addEventListener("touchend", function (e) { self.end(e) });
        },

        getCurrentPos: function (){
            if(this.index == 0) return 0 + this.movex;

            return (300 * this.index + this.movex);
        },


        start: function (event) {            
            document.getElementById('swiper').classList.remove('isSliding');
            event.target.classList.add('isTouched');
/*
            this.longTouch = false;
            setTimeout(function () {
                window.slider.longTouch = true;
            }, 250);
*/
            this.touchstartx = event.touches[0].pageX;            
        },

        move: function (event) {
            this.touchmovex = event.touches[0].pageX;

            this.movex = this.touchstartx - this.touchmovex;           

            document.getElementById('swiper').style.transform = 'translate3d(-' + this.getCurrentPos() + 'px,0,0)';
            //event.target.parentNode.style.transform = 'translate3d(-' + this.getCurrentPos() + 'px,0,0)';
        },

        end: function (event) {
            document.getElementById('swiper').classList.add('isSliding');            

            if (Math.abs(this.movex) > (this.slideWidth / 10) && this.index >= 0) {
                (this.movex > 0)? this.index++ : this.index--;
            }

            this.currentY = 300 * this.index;

            document.getElementById('swiper').style.transform = 'translate3d(-' + this.currentY + 'px,0,0)';            
            event.target.classList.remove('isTouched');
            this.movex = 0;            
        }
    };
    swipe.init();

} ]);

app.factory('FlickrService', ['$http', function ($http) {

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
            }
            return this.xmlhttp(req);
        }
    }
} ]);