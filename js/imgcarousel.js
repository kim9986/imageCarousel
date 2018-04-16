;(function ( $, window, document) {
    var pluginName = "imageCarousel",
    
    //默认配置参数  default settings
    defaults = {
        speed:300,    //滑动速度 slide speed
        autoSlide:true,    //是否主动滑动 slide automatically
        holdTime:4000,      //主动滑动时图片停留时间 the time to hold image between two slidings
        alwaysShowTitle:true, //是否一直显示图片标题 
        color:"#000",   //字体颜色 font color
        clickImage:function(element,index){}, //点击图片时回调函数,参数：element：图片元素，index：图片在图片数组中的序号
    };
    
    // The actual plugin constructor
    function Plugin ( element, images,options ) {
            this.element = element;
            this.images = images;
            this.settings = $.extend( {}, defaults, options );
            this._defaults = defaults;
            this._name = pluginName;
            this.init();
    };
    
    Plugin.prototype = {
            init: function () {   //初始化
                var e = this;
                e.width = $(e.element).width();
                e.height = $(e.element).height();
                $(e.element).addClass("imageCarouselBox");
                $(e.element).css("color",e.settings.color);
                e.picTimer;
                e.setImages(e.images);
            },
                        
            setImages:function(images){  //设置图片数组，可以用于修改当前播放的图片数组
                var e = this;
                e.dataLength = e.images.length;
                $(e.element).html("");
                e.index = 0;
                var ulText = "<ul>"
                var btnText = "<div class='btnBg'><div class='btn'>";
                for(var i=0; i < e.dataLength; i++) {
                    btnText += "<span></span>";
                    ulText += "<li ><img src='"+images[i].path+"' alt='' ><div class='text-box'>"+images[i].title+"</div></li>"; //插入图片
                }
                btnText += "</div></div><div class='preNext pre'></div><div class='preNext next'></div>";
                ulText += "</ul>";
                
                $(e.element).append(ulText);
                $(e.element).append(btnText);
                
                $(e.element).find("ul").css("width",e.width * e.dataLength);
                $(e.element).find("ul li").css("width",e.width).click(function(){
                    e.settings.clickImage(this,e.index);
                });
                if(e.settings.alwaysShowTitle){
                    $(e.element).find("ul li .text-box").fadeIn();
                } else{
                    $(e.element).find("ul li").mouseenter(function(){
                        $(this).find(".text-box").fadeIn();
                    }).mouseleave(function(){
                        $(this).find(".text-box").fadeOut();
                    });
                }
                
                $(e.element).find(".btn span").css("opacity",0.4).mouseenter(function() {
                    e.index = $(e.element).find(".btn span").index(this);
                    e.showImage(e.index);
                }).eq(0).trigger("mouseenter");
                
                $(e.element).find(" .preNext").css("opacity",0.2).hover(function() {
                    $(this).stop(true,false).animate({"opacity":"0.5"},e.settings.speed);
                },function() {
                    $(this).stop(true,false).animate({"opacity":"0.2"},e.settings.speed);
                });
                
                $(e.element).find(" .pre").click(function() {
                    e.index -= 1;
                    if(e.index == -1) {e.index = e.dataLength - 1;}
                    e.showImage(e.index);
                });
                $(e.element).find(" .next").click(function() {
                    e.index += 1;
                    if(e.index == e.dataLength) {e.index = 0;}
                    e.showImage(e.index);
                });
                
                if(e.settings.autoSlide){
                    $(e.element).hover(function() {
                        clearInterval(e.picTimer);
                    },function() {
                        e.picTimer = setInterval(function() {
                            e.showImage(e.index);
                            e.index++;
                            if(e.index == e.dataLength) {e.index = 0;}
                        },e.settings.holdTime); 
                    }).trigger("mouseleave");
                }
            },
        
            showImage: function(index){  //切换当前显示的图片
                var e = this;
                var nowLeft = -index*e.width;
                $(e.element).find("ul").stop(true,false).animate({"left":nowLeft},e.settings.speed);
                $(e.element).find(" .btn span").stop(true,false).animate({"opacity":"0.4"},e.settings.speed)
                  .eq(index).stop(true,false).animate({"opacity":"0.8"},e.settings.speed);
            }
        };

    $.fn[ pluginName ] = function ( images,options) {   //向jQuery注册插件
        var e = this;
        e.each(function() {
            $.data( e, "plugin_" + pluginName, new Plugin( this,images, options ) );
        });
        return e;
    };
    
})(jQuery, window, document)
