(function($){
    $.fn.outerWidth = $.fn.outerWidth || function(){
        var val = this.width();
        val+=parseFloat(this.css('margin-left').replace('px',''))||0;
        val+=parseFloat(this.css('margin-right').replace('px',''))||0;
        val+=parseFloat(this.css('padding-left').replace('px',''))||0;
        val+=parseFloat(this.css('padding-right').replace('px',''))||0;
        return val;
    };
    
    var defualt_opts = {
        delay : 300,
        is3D : true,
        showEl : 0.5,
        cssInner: '.mod_nav_inner',
        cssItem:'.J_scrollY',
        clActive: 'current'
    }

    var Menu = function($el, options){
        var _opts = $.extend({}, defualt_opts, options);
        this._init($el ,_opts);
    }

    Menu.fn = Menu.prototype;

    Menu.fn._init = function($el, opts){

        this._opts = opts;
        this.$menu = $el;
        this.$inner = $el.find(this._opts.cssInner);
        this.$items = $el.find(this._opts.cssItem);
        this.menuOffsetLeft = parseFloat(this.$inner.css('margin-left').replace('px',''))||0;
        this.menuOffsetRight = parseFloat(this.$inner.css('margin-right').replace('px',''))||0;
        this._w = this.$menu.width();
        this._bw = 0;
        this._bw1 = 0;
        this._idx = 0;
        this._translateX = 0;
        this.itemOuterWidths = [];
        var tempItemWidth = 0;
        var me = this;
        $.each(this.$items, function(){
            tempItemWidth = $(this).outerWidth();
            me.itemOuterWidths.push(tempItemWidth);
            me._bw += tempItemWidth;
        });

        this.$inner.width(this._bw);
        this._bw1=this._bw + this.menuOffsetLeft + this.menuOffsetRight;
        this._bind_event();
        this._get_status();
        this._reset();
    }

    Menu.fn._bind_event = function(){
        var me = this;
        var isDrag = false, 
            sX, eX, touch, dis;
        this.$menu.on('tap', this._opts['cssItem'], function(){
            var $t = $(this);
            me.$items.removeClass(me._opts['clActive']);
            $t.addClass(me._opts['clActive']);
            me._adjust_pos( $t.index() );
        }).on('touchstart', this._opts['cssInner'], function(e){
            isDrag = true;
            touch = e.touches[0];
            sX = touch.pageX;
            dis = me._translateX;
        }).on('touchmove', this._opts['cssInner'], function(e){
            if(!isDrag) return;
            touch = e.touches[0];
            eX = touch.pageX;
            me._translateX = (eX - sX) + dis;
            me.set_animate(me.$inner, me._translateX, 0, 0, 0);
            e.preventDefault();
        }).on('touchend', this._opts['cssInner'], function(e){
            if(!isDrag) return;
            touch = e.changedTouches[0];
            eX = touch.pageX;
            isDrag = false;
            me._fixed_pos(me._translateX);
            e.preventDefault();
        });
    }
    Menu.fn._fixed_pos = function(translateX){
        var tx = translateX || this._translateX;
        if(this._bw1 + tx < this._w){
            this.set_animate(this.$inner, this._w - this._bw1, 0, 0);
            this._translateX = this._w - this._bw1;
        }
        if(-tx < 0){
            this.set_animate(this.$inner, 0, 0, 0);
            this._translateX = 0;
        }
        this._set_status();
    }

    Menu.fn._adjust_pos = function(idx){
        var pidx = idx || this._idx;
        var $curr = this.$items.eq(idx);
        var c_offset = $curr.offset();
        var _currLeft = c_offset.left + this.itemOuterWidths[idx];
        var s_l = _currLeft - this._w + (this.itemOuterWidths[idx + 1]||0) * this._opts.showEl;
        var s_x = 0;
        var el_w = 0;
        this._idx = pidx;

        if(s_l > 0){
            if(!this.itemOuterWidths[idx + 1]){
                el_w = this.menuOffsetRight;
            }
            s_x = this._translateX - s_l - el_w;
            this.set_animate(this.$inner, s_x, 0, 0);
            this._translateX = s_x;
            this._set_status();
            return;
        }
        
        s_l = c_offset.left - (this.itemOuterWidths[idx - 1]||0) * this._opts.showEl;
        if(s_l < 0){
            if(!this.itemOuterWidths[idx - 1]){
                el_w = this.menuOffsetLeft;
            }     
            s_x = this._translateX - s_l + el_w;
            this.set_animate(this.$inner, s_x, 0, 0);
            this._translateX = s_x;
            this._set_status();
            return;
        }
        this._set_status();
        
    }
    Menu.fn._get_status = function(){
        return;
        var status = localStorage.getItem("yx_menu_status") || '{}';
        var o = JSON.parse(status);
        this._idx = o.idx || 0;
        this._translateX = o.left || 0;
    }
    Menu.fn._reset = function(){
        return;
        this.$items.removeClass(this._opts['clActive']);
        this.$items.eq(this._idx).addClass(this._opts['clActive']);
        this.set_animate(this.$inner, this._translateX, 0, 0, 0);
    }

    Menu.fn._set_status = function(){
        return;
        localStorage.setItem("yx_menu_status",'{"idx":' + this._idx + ', "left": ' + this._translateX + '}');
    }

    Menu.fn.set_animate = function($el, x, y, z, delay, cb){
        var d;
        if(undefined == delay){
            d = this._opts.delay;
        }else{
            d = delay;
        }
        var obj = {};
        if(defualt_opts.is3D){
            obj = {'translate3d': x + 'px,' + y + 'px,' + z + 'px'};
        }else{
            obj = {'-webkit-transform': 'translate(' + x + 'px, ' + y + 'px) translateZ(' + z + 'px)'};
        }
        $el.animate(obj, d, 'ease-out', function(){
            if(cb && typeof cb === 'function') cb();
        });
    }

    $.fn.Menu = function(opts) {
        if(this.length == 0) {
            return this;
        }
        this.each(function() {
            new Menu($(this),opts);
        });
    };
    
})($);