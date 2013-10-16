/*
 * picView 商品图片浏览模块
**/
define(function(require, exports, module) {
	var $ = require('zepto.js');
	var Slider = require('zepto.touchslider');
	var gallery;
<<<<<<< HEAD
	var bigGallery;
=======
>>>>>>> undate
	var picView = {
		imagesData: DETAIL_DATA.images,

		placeholderSrc: 'img/space.png',//空白占位图地址

		init: function(){
			this.render();
			this.bindEvent();
		},

		render: function(){
			var listObj = $('#J_gallery .xgallery_list');
			var galleryHtml = [];
			var pagesHtml = [];
			for(var i = 0, length = this.imagesData.length; i < length; i++){
<<<<<<< HEAD
				galleryHtml.push('<li><img lazy-src="'+ this.imagesData[i] +'" src="'+ this.placeholderSrc +'" /></li>');
				pagesHtml.push('<i></i>');
			}
			$('#J_gallery .xgallery_list').append(galleryHtml.join(''));
			$('#J_bigGallery .xbiggallery_list').append(galleryHtml.join('').replace(/\/mm\//g, '/mpic/'));
			$('#J_gallery .xgallery_status').append(pagesHtml.join(''));
			$('#J_bigGallery .xbiggallery_status').append(pagesHtml.join(''));
			gallery = new Slider('#J_gallery', {
				center: true,
=======
				galleryHtml.push('<li><img src="'+ this.imagesData[i] +'" data-src="'+ this.placeholderSrc +'" /></li>');
			}
			$('#J_gallery .xgallery_list').append(galleryHtml.join(''));
			$('#J_bigGallery .xbiggallery_list').append(galleryHtml.join('').replace(/\/mm\//g, '/mpic/'));

			gallery = new Slider('#J_gallery', {
>>>>>>> undate
				viewportCls: 'xgallery_wrap',
				scrollerCls: 'xgallery_list',
				paginationCls: 'xgallery_status'
			});
		},

		bindEvent: function(){
			var self = this, resize = 'ontouchstart' in window ? 'orientationchange' : 'resize';
			$('#J_gallery .xgallery_list li').bind('click', function(e){
<<<<<<< HEAD
				self.showBigGallery();
=======
				//picView.showBigGallery();
>>>>>>> undate
			});
			$('#J_mask').bind('click', function(){
<<<<<<< HEAD
				self.hideBigGallery();
			});
			$('#J_bigGallery').bind('click', function(){
				self.hideBigGallery();
			});
			$(window).bind(resize, function(e){
				if (bigGallery) {
					var bigGlleryWidth = Math.min($(window).width(), 600);
					$('#J_bigGallery .xbiggallery_list').children().width(bigGlleryWidth).height(bigGlleryWidth);
					bigGallery.adaptWidth(bigGlleryWidth);
				}
=======
				//picView.hideBigGallery();
>>>>>>> undate
			});
		},

		showBigGallery: function(){
			$('#J_mask').show();
			$('#J_bigGallery').show();
			var index = gallery.getIndex();
			if (!bigGallery) {
				var bigGlleryWidth = Math.min($(window).width(), 600);
				$('#J_bigGallery .xbiggallery_list').children().width(bigGlleryWidth).height(bigGlleryWidth);
				bigGallery = new Slider('#J_bigGallery', {
					index: index,
					viewportCls: 'xbiggallery_wrap',
					scrollerCls: 'xbiggallery_list',
					paginationCls: 'xbiggallery_status'
				});
			} else {
				gallery.slideTo(index, 0);
			}
		},

		hideBigGallery: function(){
			var index =  bigGallery.getIndex();
			gallery.slideTo(index, 0);
			$('#J_mask').hide();
			$('#J_bigGallery').hide();
		}
	}

	return picView;

});