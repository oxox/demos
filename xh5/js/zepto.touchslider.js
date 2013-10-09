/**
	*zepto.touchslide.js
	*触屏版slider插件 
	*支持webkit
	*zepto v1.0
	*@author aronhuang
	*@version 1.0
	*@example : zepto('#demo').touchSlider();
*/


;(function($){
	$.fn.touchSlider = function(options) {
		if(this.length == 0) {
			return this;
		}
		var returnValue, args = arguments;
		this.each(function() {
			var instance = $(this).data('_touchSlider');
			//如果第一个参数是String，则调用相应方法,其他参数作为方法的参数，但必须先生成实例
			if(typeof(options) == 'string'){
				//实例已生成
				if (instance) {
					var methodName = options;
					if(typeof(instance[methodName]) === 'function'){
						args = Array.prototype.slice.call(args, 1 );
						returnValue = instance[methodName].apply(instance, args);
					}
				}
			}
			//如果参数是配置对象，则生成实例
			else {
				//实例未生成
				if(!instance){
					instance = new $.TouchSlider($(this),options);
					$(this).data('_touchSlider', instance);
				}
				//实例已生成 
				else {
					return this;
				}
			}
		});
		//有返回值则返回返回值，无返回值返回调用的对象，保持链式调用
		return returnValue === undefined ? this : returnValue;
	};

	$.fn.getTouchsliderInstance = function(){
		return this.eq(0).data('_touchSlider');
	};

	/**
		CLASS : TouchSlider
	*/
	$.TouchSlider = function(object, options) {
		this.container = object;
		this.options = $.extend(true, {}, $.TouchSlider.defaults, options);
		this._init();
	};


	$.TouchSlider.prototype = {

		constructor: $.TouchSlider,

		_init: function(){
			var opts = this.options, len, totalWidth;
			this._findElement();
			this.index = 0;
			this.support = this._getSupport();
			this.nodeWidth = this.nodes.eq(0).width();
			this.length  = this.nodes.length;
			this.viewport.css({
				'position': 'relative',
				'-webkit-transform': 'translate3d(0,0,0)'
			});
			this.scroller.css({
				'-webkit-backface-visibility': 'hidden',
				'-webkit-transition-timing-function': 'cubic-bezier(0,0,0.25,1)',
				'position': 'absolute',
				'width': this.nodeWidth * this.length,
				'margin-left': (this.viewport.width() - this.nodeWidth)/2 //margin-left使当前图片在viewport里居中
			});		
			this._bindEvent();
			this._createStatus();
			this._loadImg();
		},


		_loadImg: function(){
			var img = this.scroller.find('img');
			var that = this;
			$.each(img, function(index){
				if (!$(this).attr('data-src')) {
					return true;
				}
				if (index == that.index || index == that.index - 1 || index == that.index + 1 || that._inViewport($(this))) {
					var src = $(this).attr('data-src');
					$(this).attr('src', src).removeClass('data-src');
				}
			});

		},


		_inViewport: function(obj){
			var left = $(obj).position().left;
			var viewLeft = this.viewport.position().left;
			var viewRight = viewLeft + this.viewport.width();
			if (left >= viewLeft && left <= viewRight ) {
				return true;
			}
			return false;
		},


		_createStatus: function(){
			var opts = this.options;
			if (this.statusList.length == 0) {
				this.statusList = $('<div />').addClass(opts.statusListCls).appendTo(this.container);
			}
			var statusNodes = [];
			for(var i = 0, length = this.length; i < length; i++){
				statusNodes.push('<i' + (i == this.index ? ' class="' + opts.stasusCurCls +'"' : '') +'></i>');
			}
			this.statusList.append(statusNodes.join(''));
			this.statusNodes = this.statusList.children();
		},

		_updateStatus: function(){
			var curCls = this.options.stasusCurCls;
			this.statusNodes.eq(this.index).addClass(curCls).siblings().removeClass(curCls);
		},

		_setPos: function(left, duration){
			var hasDuration = isNaN(duration) ? false : true, that = this;
			var css = {
				'-webkit-transform': 'translate3d(' + left + 'px,0,0)'
			};
			if (hasDuration) {
				css['-webkit-transition-duration'] = duration + 'ms';
			}
			this.scroller.css(css);
		},


		_getSupport: function(){
			return {
				touch: 'ontouchstart' in window,
				webkitTransition: "webkitTransition" in document.body.style
			};
		},

		_findElement: function(){
			var opts = this.options;
			this.viewport = this.container.find('.' + opts.viewportCls);
			this.scroller = this.viewport.find('.' + opts.scrollerCls);
			this.nodes = this.scroller.children();
			this.statusList = this.container.find('.' + opts.statusListCls);
			this.prevBtn = this.container.find('.' + opts.prevBtnCls);
			this.nextBtn = this.container.find('.' + opts.nextBtnCls);
		},

		_bindEvent: function(){
			var isTouch = this.support.touch, touchstart = 'touchstart', touchmove = 'touchmove', touchend = 'touchend';
			var that = this;
			if (!isTouch) {
				touchstart = 'mousedown';
				touchmove = 'mousemove';
				touchend = 'mouseup';
			}


			this.container.bind(touchstart, function(e){
				that._touchstart(e);
			});
			$(document).bind(touchmove, function(e){
				that._touchmove(e);
			}).bind(touchend, function(e){
				that._touchEnd(e);
			});
			this.scroller.find('img').bind('dragstart', function(e){
				e.preventDefault();
			});

			$(window).bind('resize', function(e){
				that.scroller.css({
					'margin-left': (that.viewport.width() - that.nodeWidth)/2 
				});
				that._loadImg();
			});
			this.scroller.bind('webkitTransitionEnd', function(e){
				that.isSliding = false;
				that._updateStatus();
				that._loadImg()
			});

		},

		_touchstart: function(e){
			//e.preventDefault();
			if (this.isSliding) {
				return ;
			}
			//alert(this.support.touch)
			var point = this.support.touch ? e.touches[0] : e; 
			this.scroller.css({
				'-webkit-transition-duration': 0 + 'ms',
			});
			this.started = true;
			this.isDirectionX = undefined;
			this.startX = this.pointX = point.pageX;
			this.startY = this.pointY = point.pageY;
		},

		_touchmove: function(e){
			if (!this.started) {
				return ;
			}
			if (e.touches && e.touches.length > 1) {
				return ; 
			}
			var point = this.support.touch ? e.touches[0] : e;
			if(typeof this.isDirectionX == 'undefined'){  
				var distanceX = point.pageX - this.startX;		
				var distanceY = point.pageY - this.startY;
				this.isDirectionX = Math.abs(distanceX) > Math.abs(distanceY);
			}
			if (!this.isDirectionX) {
				this.started = false;
				return;
			}
			e.preventDefault();
			var deltaX = point.pageX - this.startX;
			//边界反向移动增加阻力
			if ((this.index == 0 && deltaX > 0) || (this.index == (this.length -1)) && deltaX < 0) {
				deltaX = deltaX / 2;
				deltaX = Math.abs(deltaX) < 100 ? deltaX : deltaX > 0 ? 100 : -100; 
			}
			var left = - this.index * this.nodeWidth + deltaX;	
			this._setPos(left);
		},

		_touchEnd: function(e){
			if (!this.started) { return ; }
			var point = this.support.touch ? e.changedTouches[0] : e;
			var distance = point.pageX - this.startX;
			var deltaIndex = parseInt(distance/this.nodeWidth, 10);
			var residualDistance = distance % this.nodeWidth;
			var index = this.index - deltaIndex;

			if (Math.abs(residualDistance) > 10) {
				index = residualDistance < 0 ? index + 1 : index - 1;
			}
			index = index < 0 ? 0 : index > this.length - 1 ? this.length - 1 : index;
			this.slideTo(index); 
			this.started = false;
		},

		slideTo: function(index){
			var left = -this.nodeWidth * index;
			this._setPos(left, 500);
			this.isSliding = true;
			this.index = index;
		}


	}


	$.TouchSlider.defaults = {
		viewportCls: 'J_slider_wrap',
		scrollerCls: 'J_slider_scroller',
		prevBtnCls: 'J_slider_prev',
		nextBtnCls: 'J_slider_next',
		disabledBtnCls: 'J_slider_disabled',
		statusListCls: 'J_status',
		stasusCurCls: 'current'
	}

	return $.touchSlider;

})(Zepto);
