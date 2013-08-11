$(function(){
    (function(){

        var $warp = $('.mod_logo_extra:eq(0)'),
            $logo = $('<img />',{
                src:'http://oxox.io/demos/yxlogo/logo_sprites.png'
            }),
            $h1 = $('h1'),
            index = 0,
            TOTAL = 197,    //总共帧数
            SPEED = 30;     //帧速度
        //确保图片已加载完成 
        $logo.appendTo($warp).one('load',function(){
            $warp.attr('style','display: block; position: absolute; width: 270px; height: 100px; overflow: hidden; margin: -66px 0 0 -10px;')
            // $h1.css('visibility','hidden');
            // $warp.show();
            var timer1 = setInterval(function(){
                index++;
                if(index >= TOTAL){
                    clearInterval(timer1);
                    //延迟2秒淡出
                    // $warp.delay(2000).fadeOut(800);
                }
                $logo.css('margin-top','-' + (index*100) + 'px');
            },SPEED);
        })
    })()
    
})