/*
 * Grid Sizer - jQuery Plugin
 * UI to compare data quartered, side-by-side, stacked, or one-at-a-time
 *
 * Examples and documentation at: []
 *
 * No Copyright or Licensing yet - Ray Holland raymondaholland@gmail.com
 *
 * Version: 0.0.27 (1/17/2014)
 * Requires: jQuery v[]
 *
 * licenced under []:
 *   []
 */

(function ( $ ) {

    var obj;

    var gs = function(element, options) {
        obj = this;

        /**
         * quadrants -accepts 4 values or 1 for all
         * @type { array }
         * droppable -options to pass to droppable function
         * @type { object }
         */
        obj.options = $.extend({
            "quadrants" : [null, null, null, null],
            "droppable" : false
        }, options || {});

        $(element).append(
            '<div class="gs-sizer-container">'+
                '<div class="gs-view-container">'+
                    '<div class="gs-snap-container">'+
                        '<div class="gs-snap-top"></div>'+
                        '<div class="gs-snap-bottom"></div>'+
                        '<div class="gs-snap-left"></div>'+
                        '<div class="gs-snap-right"></div>'+
                        '<div class="gs-snap-center"></div>'+
                    '</div>'+
                    '<div class="gs-sizer-guide">'+
                        '<div class="gs-guide-y gs-guide-crosshair"></div>'+
                        '<div class="gs-guide-x gs-guide-crosshair"></div>'+
                        '<div class="gs-guide-center gs-guide-circle"></div>'+
                    '</div>'+
                    '<div class="gs-inactive">'+
                        '<div class="gs-crosshair-y gs-crosshair"></div>'+
                        '<div class="gs-crosshair-x gs-crosshair"></div>'+
                    '</div>'+
                    '<div class="gs-quadrant-sizer"><div class="gs-move-icon"></div></div>'+
                    '<div class="gs-q1 gs-quadrant"></div>'+
                    '<div class="gs-q2 gs-quadrant"></div>'+
                    '<div class="gs-q3 gs-quadrant"></div>'+
                    '<div class="gs-q4 gs-quadrant"></div>'+
                '</div>'+
            '</div>');

        //sending a value to setQuadrant without an index will place it in the old
        /*obj.quadrants = {
            "1" : {
                "id" : 1,
                "selector" : $(element).find('.gs-view-container > .gs-q1'),
                "age" : 0
            },
            "2" : {
                "id" : 2,
                "selector" : $(element).find('.gs-view-container > .gs-q2'),
                "age" : 0
            },
            "3" : {
                "id" : 3,
                "selector" : $(element).find('.gs-view-container > .gs-q3'),
                "age" : 0
            },
            "4" : {
                "id" : 4,
                "selector" : $(element).find('.gs-view-container > .gs-q4'),
                "age" : 0
            }
        };
        */
        //set quadrant content, set droppable options object
        
        //initialize all -identical
        if(obj.options.quadrants instanceof jQuery || typeof obj.options.quadrants === "string" || (typeof obj.options.quadrants === "object" && obj.options.quadrants.length === 1)) {
                $(element).find('.gs-view-container > .gs-quadrant').append(obj.options.quadrants);
                if(obj.options.droppable)
                    $(element).find('.gs-view-container > .gs-quadrant').droppable(obj.options.droppable);
            }
        //initialize all -different
        else {
            for(var i=0; i<4; i++) {
                var $currquad = $(element).find('.gs-view-container > .gs-q' + eval(i+1));
                $currquad.append(obj.options.quadrants[i]);
                if(obj.options.droppable)
                    $currquad.droppable(obj.options.droppable);
            }
        }

        obj.resize_quadrants = function(x, y) {
            //x & y relative to top-left corner of view-container
            var $viewcontainer = $(element).find('.gs-view-container');
            var height = y / parseInt($viewcontainer.css('height').split('px')[0], 10);
            var width = x / parseInt($viewcontainer.css('width').split('px')[0], 10);
            $(element).find('.gs-view-container > .gs-q1, .gs-view-container > .gs-q2').css('height', 100*(height)+'%');
            $(element).find('.gs-view-container > .gs-q1, .gs-view-container > .gs-q3').css('width', 100*(width)+'%');
            //fix display for when circle on top left edge
            if(x === 0) {
                $(element).find('.gs-view-container > .gs-q3').css('height', '0%');
                $(element).find('.gs-view-container > .gs-q4').css('height', 100*(1-height)+'%');
            }
            else {
                $(element).find('.gs-view-container > .gs-q3, .gs-view-container > .gs-q4').css('height', 100*(1-height)+'%');
            }
            $(element).find('.gs-view-container > .gs-q2, .gs-view-container > .gs-q4').css('width', 100*(1-width)+'%');
            console.log(height);
            console.log(width);
        };
        obj.inactive_crosshair = function(x, y) {
            $(element).find('.gs-inactive > .gs-crosshair-x').css('left', x+'px');
            $(element).find('.gs-inactive > .gs-crosshair-y').css('top', y+'px');
        };
        $(element).find('.gs-quadrant-sizer').draggable({
            drag: function(){
                //do the black crosshair here
                console.log($(element).find('.gs-quadrant-sizer').css('left'));
                console.log($(element).find('.gs-quadrant-sizer').css('top'));
                $(element).find('.gs-inactive, .gs-sizer-guide').css('display', 'block');
                var $dot = $(element).find('.gs-quadrant-sizer');
                var $q1 = $(element).find('.gs-quadrant-sizer > .gs-q1');
                var x = parseInt($dot.css('left').split('px')[0], 10) + 22;
                var y = parseInt($dot.css('top').split('px')[0], 10) + 22;
                obj.inactive_crosshair(x, y);
            },
            stop: function(){
                $(element).find('.gs-inactive, .gs-sizer-guide').css('display', 'none');
                var $dot = $(element).find('.gs-quadrant-sizer');
                var $q1 = $(element).find('.gs-view-container > .gs-q1');
                var x = parseInt($dot.css('left').split('px')[0], 10) + 22;
                var y = parseInt($dot.css('top').split('px')[0], 10) + 22;
                console.log(x + ', ' + y);
                obj.resize_quadrants(x, y);
                //convert top and left of quadrant-sizer to percentage (so it will auto-position when container is resized)
                //$(this).css("left",parseInt($(this).css("left")) / ($(element).width() / 100)+"%");
                //$(this).css("top",parseInt($(this).css("top")) / ($(element).height() / 100)+"%");
            },
            containment: $(element).find('.gs-sizer-container'),
            snap: '.gs-snap-container > div, .gs-sizer-container',//this will also snap to other gridsizers that are right next to it :/
            snapMode: 'inner',
            snapTolerance: 45
        });
        /** possible function signatures:
         * sContent, iQuadrant, oOptions
         * sContent, iQuadrant
         * sContent, oOptions
         * sContent
         */
        obj.setQuadrant = function(content) {
            console.log('setQuadrant', this, arguments);
            var options = { "loading" : false },
                quadrant = obj.getOldest();
            if(typeof arguments[1] === 'number') {
                quadrant = arguments[1];
            }
            else if(typeof arguments[1] === 'object') {
                options = arguments[1];
            }
            if(typeof arguments[2] === 'object') {
                options = arguments[2];
            }

            obj.quadrants[quadrant].selector.html(content);

            if(!options.loading) {//age non-loading content
                obj.quadrants[quadrant].age++;
            }
            /*if(typeof arguments[1] === 'number') {//quadrant number
                if(typeof arguments[2] === 'object') {//options
                    var qOptions = $.extend({
                        "loading" : false
                    }, arguments[2] || {});
                    if(!qOptions.loading) {
                        obj.getOldest().age++;//not loading so make it older
                    }
                    obj.quadrants[arguments[1]].selector.html(content);
                }
            }
            else {
                obj.getOldest().selector.html(content);
                obj.getOldest().age++;
            }*/
        };
        obj.getOldest = function(){
            //get the oldest quadrant, or the first one
            var ages = [];
            var i;
            for (i = 1; i < 5; i++) {
                ages.push([i, obj.quadrants[i].age]);
            }
            var oldest = ages.sort(function(a,b){return b[1] - a[1];});
            for (i = 1; i < 5; i++) {
                if(obj.quadrants[i].age == oldest[3][1]){
                    oldest = i;
                    //obj.quadrants[i].age++;
                    break;
                }
            }
            console.log('getOldest obj', obj.quadrants[oldest]);
            return obj.quadrants[oldest].id;
        };
        obj.getAll = function(){
            if(typeof arguments[0] === 'number') {
                return obj.quadrants[arguments[0]];
            }
            else {
                return obj.quadrants;
            }
        };
    };

    $.fn.gridsizer = function(options) {
        var fnName = arguments[0];
        var args = [].slice.call(arguments,1);
        return this.each(function () {
            var element = $(this), gridsizer;
            if (gridsizer = element.data('gridsizer')) {
                if(typeof fnName === 'string' && typeof gridsizer[fnName] === 'function') {
                   gridsizer[fnName].apply(gridsizer,args);
                }
            } else {
                var fooClass = new gs(this, options);
                element.data('gridsizer', fooClass);
            }
        });
    };
}( jQuery ));
