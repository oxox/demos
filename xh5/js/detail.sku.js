/*
 * SKU模块
**/
define(function(require, exports, module) {
	var $ = require('zepto.js');
	var skuData = '';
	var sku = {
		init: function(){
			this.reader();
			this.bindEvent();
		},

		reader: function(){

		},

		getSelectedSku: function(){

		},

		bindEvent: function(){
			$('.xoption_val').on('click', function(e){
				e.preventDefault();
				if ($(this).hasClass('xoption_val_disabled')) {
					return ;
				}
				if ($(this).hasClass('xoption_val_selected')) {
					$(this).removeClass('xoption_val_selected');
				} else {
					$(this).addClass('xoption_val_selected').siblings().removeClass('xoption_val_selected');
				}
			});
		}
	};
	sku.init();

	return sku;
});