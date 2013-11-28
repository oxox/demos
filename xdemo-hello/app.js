$(function(){
    var $imgs = $('img'),
        $body = $('body'),
        heredoc = function(fn){return (fn.toString().split('\n').slice(1,-1).join('\n') + '\n');},
        tpl = heredoc(function(){/*
            <div id="xdemoHello" class="xdemo-hello">
                <div class="xdemo-hello-bg"></div>
                <div class="xdemo-hello-bd">
                    <div class="xdemo-hello-hd"><h3>Hello from XDEMO!</h3></div>
                    <div id="xdemoHelloInner" class="xdemo-hello-inner"></div>
                </div>
            </div>
        */}),
        imgHtml = [];

    $imgs.each(function(i,o){
        var src = o.getAttribute('src')||o.getAttribute('_src');
        if(!src) return;
        imgHtml.push('<img src="$"/>'.replace('$',src));
    });

    $body.append(tpl);
    $('#xdemoHelloInner').html(imgHtml.join(''));
});