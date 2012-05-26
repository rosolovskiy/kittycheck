jQuery.noConflict();
(function($){
    
//    var IFRAME_URL = 'http://ec2-79-125-81-156.eu-west-1.compute.amazonaws.com:5000/iframe';
    var IFRAME_URL = 'index.html';
    
    $(function(){
        var $wrp = $('<div>')
            .css({left: $(document).width() - 600})
            .addClass('kittycheck-wrp');
        var $close = $('<a>')
            .attr('href', 'javascript:void(0)')
            .attr('title', 'Закрыть')
            .addClass('kittycheck-close')
            .text('×');
        var $title = $('<div>')
            .addClass('kittycheck-title')
            .html('Kittycheck');
        var $iframeWrp = $('<div>')
            .addClass('kittycheck-iframe-wrp');
        var $iframe = $('<iframe>')
            .addClass('kittycheck-iframe');
        var $iframeFix = $('<div>')
            .addClass('kittycheck-iframefix');
        var $cat = $('<div>')
            .addClass('kittycheck-cat');
            
        $('body').append($cat, $wrp);
        $wrp.append($title, $iframeWrp);
        $iframeWrp.append($iframe, $iframeFix);
        $title.append($close);
        
        $cat.checkin($wrp, function () {
            $wrp.show();
            $iframe.attr('src', IFRAME_URL);
        });
        
        $close.click(function(){
            $wrp.hide();
            return false;
        });
        
        $wrp.draggable({
            handle: $title,
            start: function () {
                $iframeFix.show();
            },
            stop: function () {
                $iframeFix.hide();
            }
        });
    });
    
    $.fn.checkin = function($wrp, callback){
        var pressTimer,
            milkTimer,
            timeout = 1400;
            
        $(this).mousedown(function(e){
            if (!$wrp.is(':visible')) {
                addracker(e);
                pressTimer = setTimeout(function() {
                    callback();
                }, timeout);
            }
            return false; 
        });
        
        $('body').mouseup(function() {
            clearTimeout(pressTimer)
            delracker();
        });
        
        function draw( color, size ) {
            var milk = $('#kittychek-milk');
            var a = 1.0 * milk.attr('value')

            var sa = 1.5*Math.PI, ea = sa+a, r = size/2, lw = r* 0.3;

            ctx = milk[0].getContext("2d")
            ctx.clearRect(0, 0, size, size);

            ctx.lineWidth = lw;

            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.arc( r, r, r-lw, sa, ea, false);
            ctx.stroke();

            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.arc( r, r, r-lw+1+lw*2/3, 0, 2*Math.PI, false);
            ctx.stroke();
        }

        function raker() {
            $('#kittychek-milk').value();
        }
        
        function addracker(e) {
            $('body').append(
                "<canvas id='kittychek-milk' "+
                " width=75 height=75 " +
                "style='position: absolute; " +
                "left: " + (e.clientX-35) + "px; " +
                "top: "  + (e.clientY-35) +  "px;' value='0'/>");
            timer();
        }
        
        function delracker() {
            $('#kittychek-milk').remove();
            clearTimeout(milkTimer);
        }
        
        function YouHooo() {
            delracker();
        }
        
        var timer = function () {
            var milk = $('#kittychek-milk');
            var a = 1.0 * milk.attr('value');
            if (a < 6.2) {
                a = a + 0.1;
                milk.attr('value', '' + a);
                draw('#87CEEB', 75);
                milkTimer = setTimeout(timer, 20);
            } else {
                YouHooo();
            };
        }
    };
    
    $.fn.draggable = function(options) {
        var defaults = {
                handle: false,
                start: function(){},
                stop: function(){}
            },
            options = $.extend({}, defaults, options),
            $document = $(document), 
            mouse = {
                update: function(e) {
                    this.x = e.pageX;
                    this.y = e.pageY;
            }
        };
    
        return this.each(function(){
            var $elem = $(this),
                $handle = options.handle || $elem;
            $handle.bind('mousedown.drag', function(e) {
                mouse.update(e);
                if (typeof options.start == 'function') {
                    options.start(e);
                }
                $document.bind('mousemove.drag', function(e) {
                    $elem.css({
                        left: (parseInt($elem.css('left'))||0) + (e.pageX - mouse.x) + 'px',
                        top: (parseInt($elem.css('top'))||0) +  (e.pageY - mouse.y) + 'px'
                    });
                    mouse.update(e);
                    e.preventDefault();
                });
                $document.one('mouseup.drag', function(e) {
                    if (typeof options.stop == 'function') {
                        options.stop(e);
                    }
                    $document.unbind('mousemove.drag');
                });
                e.preventDefault();
            });  
        });
    }
    
}(jQuery));