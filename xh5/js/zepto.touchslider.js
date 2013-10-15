/**
	*zepto.touchslide.js
	*触屏版slider插件 
	*支持webkit
	*zepto v1.0
	*@author aronhuang
	*@version 1.0
	*@example : zepto('#demo').touchSlider();
*/


define(function(require,exports,module){
	var $ = require('zepto.js');

	$.TouchSlider = function(container, options) {
		this.container = $(container);
		this.options = $.extend(true, {}, $.TouchSlider.defaults, options);
		this._init();
	}

	$.TouchSlider.prototype = {
		constructor: '$.TouchSlider',

		_init: function(){
			var opts = this.options;
			this.viewport = this.container.find('.' + opts.viewportCls);
			this.slider = this.viewport.children();
			this.slides = this.slider.children();
			this.statusList = this.container.find('.' + opts.statusListCls);
			this.slideWidth = this.slides.eq(0).width();
			this.length = this.slides.length;
			this.index = isNaN(parseInt(opts.index, 10)) ? 0 : parseInt(opts.index, 10);
			this.maxIndex = this.length - 1;
			this.speed = isNaN(parseInt(opts.speed, 10)) ? 0 : parseInt(opts.speed, 10);
			this.isTouch = 'ontouchstart' in window;
			this.slider.css({
				'-webkit-backface-visibility': 'hidden',
				'-webkit-transition-timing-function': 'cubic-bezier(0,0,0.25,1)',
				'width': this.slideWidth * this.length
			});
			this._bindEvent();
		},

		_bindEvent: function(){
			var opts = this.opts, self = this, 
				isTouch = this.isTouch, 
				touchstart = isTouch ? 'touchstart' : 'mousedown',
				touchmove = isTouch ? 'touchmove' : 'mousemove',
				touchend = isTouch ? 'touchend' : 'mouseup';
			this.slider.bind(touchstart, function(e){
				self._touchstart(e);
			});

			$(document).bind(touchmove, function(e){
				self._touchmove(e);
			}).bind(touchend, function(e){
				self._touchend(e);
			});
			this.slides.find('img').bind('dragstart', function(e){
				e.preventDefault();
			});
		},

		_setPos: function(x, duration){
			this.slider.css({
				'-webkit-transform': 'translate3d(' + x + 'px,0,0)',
				'-webkit-transition-duration': isNaN(duration) ? '' : duration + 'ms'
			});
		},

		slideTo: function(index, duration){
			var x = -this.slideWidth * index;
			this._setPos(x, 500);
			this.isSliding = true;
			this.index = index;
		},

		_touchstart: function(e){
			var point = this.isTouch ? e.touches[0] : e;
			this.started = true;
			this.startX = point.pageX;
			this.startY = point.pageY;

		},

		_touchmove: function(e){
			
			if ( e.touches && e.touches.length > 1 || e.scale && e.scale !== 1) {
				return ;
			}
			if (!this.started) {
				return ;
			}
			var point = this.isTouch ? e.touches[0] : e,
				deltaX , newX;
			this.deltaX = deltaX = point.pageX - this.startX;
			if(typeof this.isScrolling == 'undefined'){ 
				this.isScrolling = Math.abs(deltaX) < Math.abs(point.pageY - this.startY);
			}
			if (this.isScrolling) {
				this.started = false;
				return ;
			}
			e.preventDefault();
			if (this.index == 0 && deltaX > 0 || this.index == this.maxIndex && deltaX < 0) {
				deltaX = deltaX / 2;
			}
			var newX = -this.index * this.slideWidth + deltaX;
			this._setPos(newX);
		},

		_touchend: function(e){
			if (!this.started) { 
				return ; 
			}
			var deltaX = this.deltaX;
			var isValidSlide = Math.abs(deltaX) > 20 || Math.abs(deltaX) > this.slideWidth * 0.3;
			var index = this.index;
			if (isValidSlide) {
				index = deltaX < 0 ? this.index + 1 : this.index - 1;
				index = index < 0 ? 0 : index > this.maxIndex ? this.maxIndex : index;
			} 
			this.slideTo(index);
			this.started = false;
		}

	}

	$.TouchSlider.defaults = {
		viewportCls: 'viewport',
		statusListCls: 'statusList',
		speed: 300,
		index: 0

	}

	return $.TouchSlider;
});

