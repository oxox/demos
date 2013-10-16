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
			var self = this;
			this.trigger.bind('click', function(e){
				e.preventDefault();
				if ($(this).hasClass('xnav_current')) {
					return ;
				}
				if (self.isSliding) {
					return ;
				}
				var idx = self.trigger.index($(this));
				self.slide(idx)
			});
			this.pageWrap.bind('webkitTransitionEnd', function(e){
				self.isSliding = false;
				self.pageWrap.css({
					'width': '',
					'-webkit-transform': '',
					'-webkit-transition': ''
				});
				self.pageWrap.children().eq(self.curIndex).css('display','block').siblings().css('display','none');
				self.trigger.removeClass('xnav_current').eq(self.curIndex).addClass('xnav_current');
			})
		},

		slide: function(idx){
			var direction = idx > this.curIndex ? 1 : -1;
			var newPage = this.pageWrap.children().eq(idx).css('display','block');
			var pageWidth = $('#J_container').width();
			var self = this;
			this.pageWrap.css({
				'width': '200%',
				'-webkit-transform': 'translate('+ (idx > self.curIndex ? 0 : -pageWidth)+'px)',
			});

			window.setTimeout(function(){
				self.pageWrap.css({
					'-webkit-transform': 'translate('+ ((idx > self.curIndex) ? (-pageWidth) : 0)+'px)',
					'-webkit-transition':'-webkit-transform 0.3s linear'
				});
				self.curIndex = idx;
			}, 10);
			
		}
	}

	return pageSlide;

});