/*
 * js入口
**/
define(function(require, exports, module) {
	var picView = require('detail.picView.js');
	var sku = require('detail.sku.js');
	var pageSlide = require('detail.pageSlide.js');

	picView.init();
	sku.init();
	pageSlide.init();
});