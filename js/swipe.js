// TODO
// remove angular
// allow photos to 
//        1) be inject via JSON
//        2) scrape the DOM

var app = angular.module('SwipeApp', []);

app.controller('SwipeCtrl', ['$scope', function ($scope) {
'use strict';
    
    $scope.photos = [
        'https://denniscalvert.s3.us-east-2.amazonaws.com/ui-demos/touch-gallery/0.jpg',
        'https://denniscalvert.s3.us-east-2.amazonaws.com/ui-demos/touch-gallery/1.jpg',
        'https://denniscalvert.s3.us-east-2.amazonaws.com/ui-demos/touch-gallery/2.jpg',
        'https://denniscalvert.s3.us-east-2.amazonaws.com/ui-demos/touch-gallery/3.jpg',
        'https://denniscalvert.s3.us-east-2.amazonaws.com/ui-demos/touch-gallery/4.jpg',
        'https://denniscalvert.s3.us-east-2.amazonaws.com/ui-demos/touch-gallery/5.jpg',
        'https://denniscalvert.s3.us-east-2.amazonaws.com/ui-demos/touch-gallery/6.jpg',
    ];
    
    document.getElementById('swiper').style.width = $scope.photos.length * 100 + '%';

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
