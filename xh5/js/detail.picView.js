/*
 * picView 商品图片浏览模块
**/
define(function(require, exports, module) {
	var $ = require('zepto.js');
	var Slider = require('zepto.touchslider');
	var gallery;
	var picView = {
		imagesData: DETAIL_DATA.images,

		placeholderSrc: '',

		init: function(){
			this.render();
			this.bindEvent();
		},

		render: function(){
			var listObj = $('#J_gallery .xgallery_list');
			var galleryHtml = [];
			var bigGalleryHtml = [];
			for(var i = 0, length = this.imagesData.length; i < length; i++){
				galleryHtml.push('<li><img src="'+ this.imagesData[i] +'" data-src="'+ this.placeholderSrc +'" /></li>');
			}
			$('#J_gallery .xgallery_list').append(galleryHtml.join(''));
			$('#J_bigGallery .xbiggallery_list').append(galleryHtml.join('').replace(/\/mm\//g, '/mpic/'));

			gallery = new Slider('#J_gallery', {
				viewportCls: 'xgallery_wrap',
				scrollerCls: 'xgallery_list',
				statusListCls: 'xgallery_status',
				stasusCurCls: 'current'
			});
		},

		bindEvent: function(){
			$('#J_gallery .xgallery_list li').bind('click', function(e){
				//picView.showBigGallery();
			});


			$('#J_mask').bind('click', function(){
				//picView.hideBigGallery();
			});
		},

		showBigGallery: function(){
			$('#J_mask').show();
			$('#J_bigGallery').show();
			if (!$('#J_bigGallery').data('_toucheSlide')) {
				var bigGlleryWidth = Math.min($(window).width(), 600);
				$('#J_bigGallery .xbiggallery_wrap').width(bigGlleryWidth).height(bigGlleryWidth);
				$('#J_bigGallery .xbiggallery_list').children().width(bigGlleryWidth).height(bigGlleryWidth);
				$('#J_bigGallery').touchSlider({
					viewportCls: 'xbiggallery_wrap',
					scrollerCls: 'xbiggallery_list',
					statusListCls: 'xbiggallery_status',
					stasusCurCls: 'current'
				});
			}
		},

		hideBigGallery: function(){
			$('#J_mask').hide();
			$('#J_bigGallery').hide();
		}
	}

	picView.init();

});