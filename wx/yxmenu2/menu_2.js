(function($){

    var loader = {
        $el:$('#J_mask'),
        timer:null,
        show:function(duration,cbk){
            this.$el.removeClass('hide');
            clearTimeout(this.timer);
            if(typeof(duration)!=='undefined'&&duration>0){
                this.timer = setTimeout(function(){
                    cbk&&cbk();
                },duration);
            }else{
                cbk&&cbk();
            }
            
        },
        hide:function(){
            this.$el.addClass('hide');
        }
    };


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
        this._idx = 0;
        

        this._initData();
        this._bind_event();
        this._get_status();
        this._reset();
    }

    Menu.fn._initData = function(){
        this.menuOffsetLeft = parseFloat(this.$inner.css('margin-left').replace('px',''))||0;
        this.menuOffsetRight = parseFloat(this.$inner.css('margin-right').replace('px',''))||0;
        this.menuParentWidth = this.$menu.width();
        this.totalItemWidth = 0;
        this.totalMenuWidth = 0;
        this.itemOuterWidths = [];
        var tempItemWidth = 0;
        this._translateX = 0;
        var me = this;
        $.each(this.$items, function(){
            tempItemWidth = $(this).outerWidth();
            me.itemOuterWidths.push(tempItemWidth);
            me.totalItemWidth += tempItemWidth;
        });

        this.$inner.width(this.totalItemWidth);
        this.totalMenuWidth=this.totalItemWidth + this.menuOffsetLeft + this.menuOffsetRight;

        this.noTouchMove = this.menuParentWidth>=this.totalMenuWidth;

    }

    var log = function(arr){
        $("#log").html(arr.join(' | '));
    }

    Menu.fn._bind_event = function(){
        var me = this;
        var isDrag = false, 
            sX, eX, touch, dis,
            resizeEvtName = 'onorientationchange' in window ? 'orientationchange' : 'resize';
        var url ='';
        this.$menu.on('tap', this._opts['cssItem'], function(){
            var $t = $(this);
            if($t.hasClass(me._opts['clActive'])){
                return false;
            }
            me.$items.removeClass(me._opts['clActive']);
            $t.addClass(me._opts['clActive']);
            url = this.getAttribute('data-href');
            loader.show(500,function(){
                loader.hide();
                location.href = url;
            });
            me._adjust_pos( $t.index() );

        }).on('touchstart', this._opts['cssInner'], function(e){
            if(me.noTouchMove){
                return;
            }
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
            //e.preventDefault();
        });
        /*window.addEventListener(resizeEvtName, function(){        
            setTimeout(function(){
                me._initData();
                //log([me._idx, me.menuParentWidth, me.totalItemWidth, me.totalMenuWidth]);
                me._adjust_pos( me._idx );
            },500)
            

        })*/
        
    }

    Menu.fn._fixed_pos = function(translateX){
        var tx = translateX || this._translateX;
        if(this.totalMenuWidth + tx < this.menuParentWidth){
            this.set_animate(this.$inner, this.menuParentWidth - this.totalMenuWidth, 0, 0);
            this._translateX = this.menuParentWidth - this.totalMenuWidth;
        }
        if(-tx < 0){
            this.set_animate(this.$inner, 0, 0, 0);
            this._translateX = 0;
        }
        this._set_status();
    }

    Menu.fn._adjust_pos = function(idx){
        var pidx = ('undefined' === typeof idx) ? this._idx : idx;
        var $curr = this.$items.eq(idx);
        var c_offset = $curr.offset();
        var _currLeft = c_offset.left + this.itemOuterWidths[idx];
        var s_l = _currLeft - this.menuParentWidth + (this.itemOuterWidths[idx + 1]||0) * this._opts.showEl;
        var s_x = 0;
        var elmenuParentWidth = 0;
        this._idx = pidx;
        if(s_l > 0){
            if(!this.itemOuterWidths[idx + 1]){
                elmenuParentWidth = this.menuOffsetRight;
            }
            s_x = this._translateX - s_l - elmenuParentWidth;
            //this.set_animate(this.$inner, s_x, 0, 0);
            this._translateX = s_x;
            this._set_status();
            return;
        }
        
        s_l = c_offset.left - (this.itemOuterWidths[idx - 1]||0) * this._opts.showEl;
        if(s_l < 0){
            if(!this.itemOuterWidths[idx - 1]){
                elmenuParentWidth = this.menuOffsetLeft;
            }     
            s_x = this._translateX - s_l + elmenuParentWidth;
            //this.set_animate(this.$inner, s_x, 0, 0);
            this._translateX = s_x;
            this._set_status();
            return;
        }
        this._set_status();
        
    }
    Menu.fn._get_status = function(){
        var status = localStorage.getItem("yx_menu_status") || '{}';
        var o = JSON.parse(status);
        this._idx = this.$items.filter(this._opts['clActive']).index();//o.idx || 0;
        this._translateX = o.left || 0;
    }
    Menu.fn._reset = function(){
        this.set_animate(this.$inner, this._translateX, 0, 0, 0);
    }

    Menu.fn._set_status = function(){
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