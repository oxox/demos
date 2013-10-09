/*
 * pageSlide 页面主体切换模块
**/
define(function(require, exports, module) {
	var $ = require('zepto.js');
	
	var pageSlide = {
		init: function(){
			var self = this;
			this.trigger = $('#J_nav').find('[data-page]');
			this.curIndex = 0;
			this.pageWrap = $('#J_content');
			this.bindEvent();
		},

		bindEvent: function(){
			this.trigger.bind('click', function(e){
				e.preventDefault();
				if ($(this).hasClass('xnav_current')) {
					return ;
				}
				if (pageSlide.isSliding) {
					return ;
				}
				var idx = pageSlide.trigger.index($(this));
				pageSlide.slide(idx)
			});
			this.pageWrap.bind('webkitTransitionEnd', function(e){
				pageSlide.isSliding = false;
				console.log('ebd')
				pageSlide.pageWrap.css({
					'width': '',
					'-webkit-transform': '',
					'-webkit-transition': ''
				});
				pageSlide.pageWrap.children().eq(pageSlide.curIndex).css('display','block').siblings().css('display','none');
				pageSlide.trigger.removeClass('xnav_current').eq(pageSlide.curIndex).addClass('xnav_current');
			})
		},

		slide: function(idx){
			var direction = idx > this.curIndex ? 1 : -1;
			var newPage = this.pageWrap.children().eq(idx).css('display','block');
			var pageWidth = $('#J_container').width();
			this.pageWrap.css({
				'width': '200%',
				'-webkit-transform': 'translate('+ (idx > pageSlide.curIndex ? 0 : -pageWidth)+'px)',
			});

			window.setTimeout(function(){
				pageSlide.pageWrap.css({
					'-webkit-transform': 'translate('+ ((idx > pageSlide.curIndex) ? (-pageWidth) : 0)+'px)',
					'-webkit-transition':'-webkit-transform 0.3s linear'
				});
				pageSlide.curIndex = idx;
			}, 10);
			
		}
	}

	pageSlide.init();

});