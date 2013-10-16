/**
	*zepto.touchslide.js
	*触屏版slider插件 AMD
	*支持webkit
	*zepto v1.0
	*@author aronhuang
	*@version 1.0
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
<<<<<<< HEAD
			this.slider = this.viewport.children().eq(0) || this.viewport.width(); 
			this.slides = this.slider.children();
			this.pagination = this.container.find('.' + opts.paginationCls).children();
			this.prevBtn = this.container.find('.' + opts.prevCls);
			this.nextBtn = this.container.find('.' + opts.nextCls);
=======
			this.slider = this.viewport.children();
			this.slides = this.slider.children();
			this.statusList = this.container.find('.' + opts.statusListCls);
>>>>>>> undate
			this.slideWidth = this.slides.eq(0).width();
			this.length = this.slides.length;
			this.index = isNaN(parseInt(opts.index, 10)) ? 0 : parseInt(opts.index, 10);
			this.maxIndex = this.length - 1;
			this.speed = isNaN(parseInt(opts.speed, 10)) ? 0 : parseInt(opts.speed, 10);
			this.isTouch = 'ontouchstart' in window;
<<<<<<< HEAD
			this.initialX = opts.center ? (this.viewport.width() - this.slideWidth)/2 : 0; //居中调整
=======
>>>>>>> undate
			this.slider.css({
				'-webkit-backface-visibility': 'hidden',
				'-webkit-transition-timing-function': 'cubic-bezier(0,0,0.25,1)',
				'width': this.slideWidth * this.length
			});
<<<<<<< HEAD
			this.slideTo(this.index, 0);
			this._updateStatus();
			this._bindEvent();
			var self = this;
			if (opts.lazyload) {
				this._loadImg();
			}
		},

		_bindEvent: function(){
			var opts = this.options, self = this, 
				isTouch = this.isTouch, 
				touchstart = isTouch ? 'touchstart' : 'mousedown',
				touchmove = isTouch ? 'touchmove' : 'mousemove',
				touchend = isTouch ? 'touchend' : 'mouseup',
				resize = isTouch ? 'orientationchange' : 'resize';
			this.slider.on(touchstart, function(e){
				self._touchstart(e);
			}).on('webkitTransitionEnd', function(e){
				self._transitionEnd();
			});

			$(document).on(touchmove, function(e){
				self._touchmove(e);
			}).on(touchend, function(e){
				self._touchend(e);
			});

			this.slides.find('img').on('dragstart', function(e){
				e.preventDefault();
			});

			this.prevBtn.on('click', function(e){
				self.prev();
			});
			this.nextBtn.on('click', function(e){
				self.next();
			});

			$(window).on(resize, function(e){
				if (opts.center) {
					self.initialX = (self.viewport.width() - self.slideWidth)/2;
					self.slideTo(self.index, 0);
				}
			});
		},

		_updateStatus: function(){
			var opts = this.options;
			this.pagination.eq(this.index).addClass(opts.curPageCls).siblings().removeClass(opts.curPageCls);
			if (this.index == 0) {
				this.prevBtn.addClass(opts.prevDisabledCls);
			} else if (this.index == this.maxIndex) {
				this.nextBtn.addClass(opts.nextDisabledCls);
			} else {
				this.prevBtn.removeClass(opts.prevDisabledCls);
				this.nextBtn.removeClass(opts.nextDisabledCls);
			}
		},

		_loadImg: function(){
			var img = this.slider.find('img'), self = this, opts = this.options, slideIndex = this.index, lazyAttr = opts.lazyload;
			$.each(img, function(index){
				if (!$(this).attr(lazyAttr)) {
					return true;
				}
				if (index == slideIndex || index == slideIndex -1 || index == slideIndex + 1 || self._inViewport(this,index)) {
					var src = $(this).attr(lazyAttr);
					$(this).attr('src', src).removeAttr(lazyAttr);
				}
			});
		},


		getIndex: function(){
			return this.index;
		},

		_inViewport: function(img,index){
			var left = $(img).position().left;
			var viewLeft = this.viewport.position().left;
			var viewRight = viewLeft + this.viewport.width();
			if (left >= viewLeft && left <= viewRight ) {
				return true;
			}
		},

		adaptWidth: function(width){
			this.slideWidth = width;
			this.slider.css({
				'width': this.slideWidth * this.length
			});
			this.slideTo(this.index, 0);
		},

		_setPos: function(x, duration){
			this.slider.css({
				'-webkit-transform': 'translate3d(' + x + 'px,0,0)',
				'-webkit-transition-duration': isNaN(duration) ? '' : duration + 'ms'
			});
		},

		slideTo: function(index, duration){
			var x = this.initialX - this.slideWidth * index, duration = isNaN(duration) ? this.options.speed : duration; 
			this._setPos(x, duration);
			this.isSliding = true;
			this.index = index;
			if (duration == 0) {
				this._transitionEnd();
			}
		},

		prev: function(){
			var index = this.index - 1;
			if (index >= 0) {
				this.slideTo(index);
			}
		},

		next: function(){
			var index = this.index + 1;
			if (index <= this.maxIndex) {
				this.slideTo(index);
			}
		},

		_transitionEnd: function(){
			var opts = this.options;
			this._updateStatus();
			if (opts.lazyload) {
				this._loadImg();
			}
=======
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
>>>>>>> undate
		},

		_touchstart: function(e){
			var point = this.isTouch ? e.touches[0] : e;
			this.started = true;
			this.startX = point.pageX;
			this.startY = point.pageY;
<<<<<<< HEAD
			this.deltaX = 0;
		},

		_touchmove: function(e){
=======

		},

		_touchmove: function(e){
			
>>>>>>> undate
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
<<<<<<< HEAD
			var newX = -this.index * this.slideWidth + deltaX + this.initialX;
=======
			var newX = -this.index * this.slideWidth + deltaX;
>>>>>>> undate
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
<<<<<<< HEAD
		center: false,
		viewportCls: 'viewport',
		paginationCls: 'pagination',
		curPageCls: 'current',
		prevCls: 'prev',
		prevDisabledCls: 'prev_disabled',
		nextCls: 'next',
		nextDisabledCls: 'next_disabled',
		speed: 500,
		index: 0,
		lazyload: 'lazy-src',
		isAdaptive: false
=======
		viewportCls: 'viewport',
		statusListCls: 'statusList',
		speed: 300,
		index: 0

>>>>>>> undate
	}

	return $.TouchSlider;
});

