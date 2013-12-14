/*(function($){

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
        cssMenu:'.mod_nav',
        cssInner: '.mod_nav_inner',
        cssItme:'.J_scrollY'
    }

    var $menu = $(defualt_opts.cssMenu),
        $inner = $menu.find(defualt_opts.cssInner),
        $items = $(defualt_opts.cssItme),
        menuOffsetLeft = parseFloat($inner.css('margin-left').replace('px',''))||0,
        menuOffsetRight = parseFloat($inner.css('margin-right').replace('px',''))||0
        _w = $('body').width(),
        _bw = 0,
        _bw1 = 0,
        _idx = 0,
        _translateX = 0,
        strAnimate = '';
        itemOuterWidths = [],
        tempItemWidth = 0;

    $.each($items, function(){
        tempItemWidth = $(this).outerWidth();
        itemOuterWidths.push(tempItemWidth);
        _bw += tempItemWidth;
    });

    $inner.width(_bw);

    _bw1=_bw+menuOffsetLeft+menuOffsetRight;

    if(defualt_opts.is3D){
        strAnimate = 'translate3d';
    }else{
        strAnimate = '-webkit-transform';
    }


    var get_status = function(){
        var status = localStorage.getItem("yx_menu_status");
        var o = eval('(' + status + ')');
        _idx = o.idx || 0;
        _translateX = o.left || 0;
    }
    var reset = function(){
        $items.removeClass('current');
        $items.eq(_idx).addClass('current');
        set_animate($inner, _translateX, 0, 0, 0);
    }

    var set_status = function(){
        localStorage.setItem("yx_menu_status",'{idx:' + _idx + ', left: ' + _translateX + '}');
    }

    var set_animate = function($el, x, y, z, delay, cb){
        var d;
        if(undefined == delay){
            d = defualt_opts.delay;
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

    var _bind_event = function(){
        $menu.on('tap', '.J_scrollY', function(){
            $items.removeClass('current');
            $(this).addClass('current');
            _adjust_pos($(this).index());
        });

        var isDrag = false,
                startTime, endTime, sX, sY, eX, eY, touch, dis, endis, isStopEvent = false, endidx; this.cdis = 0;
        $menu.on('touchstart', '.mod_nav_inner', function(e){
            isDrag = true;
            if (e.touches){
                touch = e.touches[0];
                sX = touch.pageX;
                sY = touch.pageY;
            }else{
                sX = e.pageX;
                sY = e.pageY;
            }
            dis = _translateX;
            startTime = Date.parse(new Date());
        });

        $menu.on('touchmove', '.mod_nav_inner', function(e){
            if(!isDrag) return;
            if (e.touches) {
                touch = e.touches[0];
                eX = touch.pageX;
                eY = touch.pageY;
            }else{
                eX = e.pageX;
                eY = e.pageY;
            }
            _translateX = (eX - sX) + dis;
            set_animate($inner, _translateX, 0, 0, 0);
            e.preventDefault();
        });
       
        $menu.on('touchend', '.mod_nav_inner', function(e){
            if(!isDrag) return;
            if (e.changedTouches) {
                touch = e.changedTouches[0];
                eX = touch.pageX;
                eY = touch.pageY;
            }else{
                eX = e.pageX;
                eY = e.pageY;
            }
            isDrag = false;
            fixed_pos(_translateX);
            e.preventDefault();
        });    
    }

    var fixed_pos = function(translateX){
        var tx = translateX || _translateX;
        if(_bw1 + tx < _w){
            set_animate($inner, _w - _bw1, 0, 0);
            _translateX = _w - _bw1;
        }
        if(-tx < 0){
            set_animate($inner, 0, 0, 0);
            _translateX = 0;
        }
        set_status();
    }

    var _adjust_pos = function(idx){
        var pidx = idx || _idx;
        var $curr = $items.eq(idx);
        var c_offset = $curr.offset();
        var _currLeft = c_offset.left + itemOuterWidths[idx];
        var s_l = _currLeft - _w;
        var s_x = 0;
        var el_w = 0;
        _idx = pidx;
        if(s_l > 0){
            if(itemOuterWidths[idx + 1]){
                el_w = itemOuterWidths[idx + 1] * defualt_opts.showEl;
            }else{
                el_w = menuOffsetRight;
            }  
            s_x = _translateX - s_l - el_w;
            set_animate($inner, s_x, 0, 0);
            _translateX = s_x;
            set_status();
            return;
        }
        s_l = -c_offset.left + _translateX;
        if(s_l < 0 && c_offset.left < 0){
            if(itemOuterWidths[idx - 1]){
                el_w = itemOuterWidths[idx - 1] * defualt_opts.showEl;
            }else{
                el_w = menuOffsetLeft;
            }       
            s_x = _translateX - c_offset.left + el_w;
            set_animate($inner, s_x, 0, 0);
            _translateX = s_x;
            set_status();
            return;
        }
        set_status();

    }
    _bind_event();
    get_status();
    reset();
})($);*/