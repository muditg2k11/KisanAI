( function( $ ) {
    function donalfarm_animation_handler($scope){   
        
        elementorFrontend.waypoint($scope.find('.pxl-elementor-animate'), function () {
            var $animate_el = $(this);
            if( $animate_el.closest('.pxl-slider-item:not(.swiper-slide-active)').length > 0 ){
                var data = $animate_el.data('settings'); 
                if(typeof data != 'undefined' && typeof data['_animation'] != 'undefined'){ 
                    setTimeout(function () {
                        $animate_el.removeClass('animated '+data['_animation']).addClass('elementor-invisible');
                    }, 1800);
                }        
            }  
        }); 

        elementorFrontend.waypoint($scope.find('.pxl-animate'), function () {
            var $animate_el = $(this);
            if( $animate_el.closest('.animation-off-scroll').length > 0 ){
                if( $animate_el.hasClass('pxl-slider-arrow-wrap') ){
                    var data = $animate_el.data('settings');
                    if(typeof data != 'undefined' && typeof data['animation'] != 'undefined'){
                        setTimeout(function () {
                            $animate_el.removeClass('pxl-invisible').addClass('animated ' + data['animation']);
                        }, data['animation_delay']);
                    }else{
                        setTimeout(function () {
                            $animate_el.removeClass('pxl-invisible').addClass('animated fadeInUp');
                        }, 300);
                    }
                }
                return;
            }
            
            var data = $animate_el.data('settings');
            if(typeof data != 'undefined' && typeof data['animation'] != 'undefined'){
                setTimeout(function () {
                    $animate_el.removeClass('pxl-invisible').addClass('animated ' + data['animation']);
                }, data['animation_delay']);
            }else{
                setTimeout(function () {
                    $animate_el.removeClass('pxl-invisible').addClass('animated fadeInUp');
                }, 300);
            }
        });

        elementorFrontend.waypoint($scope.find('.pxl-border-animated'), function () {
            $(this).addClass('pxl-animated');
        });

        elementorFrontend.waypoint($scope.find('.elementor-widget-divider'), function () {
            $(this).addClass('pxl-animated');
        });
        elementorFrontend.waypoint($scope.find('.pxl-divider.animated'), function () {
            $(this).addClass('pxl-animated');
        }); 
        elementorFrontend.waypoint($scope.find('.pxl-bd-anm'), function () {
            $(this).addClass('pxl-animated');
        });
        elementorFrontend.waypoint($scope.find('.pxl-hd-bd-left'), function () {  
            $(this).addClass('pxl-animated');
        });
        elementorFrontend.waypoint($scope.find('.pxl-hd-bd-right'), function () {
            $(this).addClass('pxl-animated');
        });
        
        elementorFrontend.waypoint($scope.find('.pxl-draw-from-top'), function () { 
            if( $(this).closest('.pxl-slider-item').length > 0 ) return;
            var $el = $(this),
                data = $el.data('setting-custom');
             
            if(typeof data != 'undefined'){
                setTimeout(function () {
                    $el.addClass('pxl-animated');
                }, data['custom_animation_delay']);
            }else{
                $el.addClass('pxl-animated');
            }
        });
        elementorFrontend.waypoint($scope.find('.pxl-draw-from-left'), function () {
            if( $(this).closest('.pxl-slider-item').length > 0 ) return;
            var $el = $(this),
                data = $el.data('setting-custom');
             
            if(typeof data != 'undefined'){
                setTimeout(function () {
                    $el.addClass('pxl-animated');
                }, data['custom_animation_delay']);
            }else{
                $el.addClass('pxl-animated');
            }
        });
        elementorFrontend.waypoint($scope.find('.pxl-draw-from-right'), function () {
            if( $(this).closest('.pxl-slider-item').length > 0 ) return;
            var $el = $(this),
                data = $el.data('setting-custom');
             
            if(typeof data != 'undefined'){
                setTimeout(function () {
                    $el.addClass('pxl-animated');
                }, data['custom_animation_delay']);
            }else{
                $el.addClass('pxl-animated');
            }
        });
        elementorFrontend.waypoint($scope.find('.pxl-move-from-left'), function () {
            if( $(this).closest('.pxl-slider-item').length > 0 ) return;
            var $el = $(this),
                data = $el.data('setting-custom');
             
            if(typeof data != 'undefined'){
                setTimeout(function () {
                    $el.addClass('pxl-animated');
                }, data['custom_animation_delay']);
            }else{
                $el.addClass('pxl-animated');
            }
        });
        elementorFrontend.waypoint($scope.find('.pxl-move-from-right'), function () {
            if( $(this).closest('.pxl-slider-item').length > 0 ) return;
            var $el = $(this),
                data = $el.data('setting-custom');
             
            if(typeof data != 'undefined'){
                setTimeout(function () {
                    $el.addClass('pxl-animated');
                }, data['custom_animation_delay']);
            }else{
                $el.addClass('pxl-animated');
            }
        }); 
        elementorFrontend.waypoint($scope.find('.pxl-skew-in'), function () {
            if( $(this).closest('.pxl-slider-item').length > 0 ) return;
            var $el = $(this),
                data = $el.data('setting-custom');
             
            if(typeof data != 'undefined'){
                setTimeout(function () {
                    $el.addClass('pxl-animated');
                }, data['custom_animation_delay']);
            }else{
                $el.addClass('pxl-animated');
            }
        });
        elementorFrontend.waypoint($scope.find('.pxl-skew-in-right'), function () {
            if( $(this).closest('.pxl-slider-item').length > 0 ) return;
            var $el = $(this),
                data = $el.data('setting-custom');
             
            if(typeof data != 'undefined'){
                setTimeout(function () {
                    $el.addClass('pxl-animated');
                }, data['custom_animation_delay']);
            }else{
                $el.addClass('pxl-animated');
            }
        });
        elementorFrontend.waypoint($scope.find('.pxl-zoom-in'), function () {
            if( $(this).closest('.pxl-slider-item').length > 0 ) return;
            var $el = $(this),
                data = $el.data('setting-custom');
             
            if(typeof data != 'undefined'){
                setTimeout(function () {
                    $el.addClass('pxl-animated');
                }, data['custom_animation_delay']);
            }else{
                $el.addClass('pxl-animated');
            }

        });
        elementorFrontend.waypoint($scope.find('.pxl-zoom-out'), function () {
            if( $(this).closest('.pxl-slider-item').length > 0 ) return;
            var $el = $(this),
                data = $el.data('setting-custom');
             
            if(typeof data != 'undefined'){
                setTimeout(function () {
                    $el.addClass('pxl-animated');
                }, data['custom_animation_delay']);
            }else{
                $el.addClass('pxl-animated');
            }
        });
        
        if( $scope.hasClass('bg-pll-slide-down-delay')){ 
            setTimeout(function () {
                $scope.find('.pxl-section-bg-parallax').addClass('pxl-animated');
            }, 300);
        }
        if( $scope.hasClass('pxl-scroll-bottom')){ 
            gsap.registerPlugin(ScrollTrigger); 
            ScrollTrigger.create({
                trigger: $scope,
                start: "bottom bottom",
                end: "+=" + innerHeight,
                snap: {
                    snapTo: 1,
                    duration: 0,
                    delay: 0,
                    ease: "power4.out"
                }
            }); 
        }

        if( $(window).outerWidth() > 767){
            if( $scope.find('.pxl-rotate-left').length > 0 ){
                var $this_rotate_left = $scope.find('.pxl-rotate-left');
                var rotate_value = $this_rotate_left.attr('data-rotate');
                gsap.to($this_rotate_left, {
                    scrollTrigger: {
                        trigger: $this_rotate_left,
                        toggleActions: "play reverse play reverse", //play reset play reset 
                        start: "top 86%",
                    },
                    rotation: parseInt(rotate_value) * -1,
                    duration: 1.8, 
                    stagger: 0.02,
                    ease: "power3.out",
                });
            }
            if( $scope.find('.pxl-rotate-right').length > 0 ){
                var $this_rotate_right = $scope.find('.pxl-rotate-right');
                var rotate_value = $this_rotate_right.attr('data-rotate'); console.log(rotate_value);
                gsap.to($this_rotate_right, {
                    scrollTrigger: {
                        trigger: $this_rotate_right,
                        toggleActions: "play reverse play reverse", //play reset play reset 
                        start: "top 86%",
                    },
                    rotation: rotate_value,
                    duration: 1.8, 
                    stagger: 0.02,
                    ease: "power3.out",
                });
            }
             
        }
        if( $scope.find('.pxl-border-radius-in').length > 0 ){
            gsap.to($scope.find('.pxl-border-radius-in'), {
                scrollTrigger: {
                    trigger: $scope.find('.pxl-border-radius-in'),
                    toggleActions: "play reverse play reverse", //play reset play reset 
                    start: "top 86%",
                },
                borderRadius: "50%",
                scale: 1,
                opacity: 1,
                duration: 1.8, 
                stagger: 0.02,
                ease: "power3.out",
            });
            gsap.to($scope.find('.pxl-border-radius-in img'), {
                scrollTrigger: {
                    trigger: $scope.find('.pxl-border-radius-in img'),
                    toggleActions: "play reverse play reverse", //play reset play reset 
                    start: "top 86%",
                },
                scale: 1,
                duration: 2.8, 
                stagger: 0.02,
                ease: "power3.out",
            });
        }
          
    }
 
    function donalfarm_split_text($scope){
         
        if( $scope.closest('.split-text-off-scroll').length > 0) return false;

        var st = $scope.find(".pxl-split-text");
        if(st.length == 0) return;

        gsap.registerPlugin(SplitText);
        
        st.each(function(index, el) {
           var els = $(el).find('p').length > 0 ? $(el).find('p')[0] : el;
            const pxl_split = new SplitText(els, { 
                type: "lines, words, chars",
                lineThreshold: 0.5,
                linesClass: "split-line"
            });
            var split_type_set = pxl_split.chars;
           
            gsap.set(els, { perspective: 400 });
 
            var settings = {
                scrollTrigger: {
                    trigger: els,
                    toggleActions: "play reverse play reverse", //play reset play reset 
                    start: "top 86%",
                },
                duration: 0.8, 
                stagger: 0.02,
                ease: "power3.out",
            };
            if( $(el).hasClass('split-in-fade') ){
                settings.opacity = 0;
            }
            if( $(el).hasClass('split-in-right') ){
                settings.opacity = 0;
                settings.x = "50";
            }
            if( $(el).hasClass('split-in-left') ){
                settings.opacity = 0;
                settings.x = "-50";
            }
            if( $(el).hasClass('split-in-up') ){
                settings.opacity = 0;
                settings.y = "80";
            }
            if( $(el).hasClass('split-in-down') ){
                settings.opacity = 0;
                settings.y = "-80";
            }
            if( $(el).hasClass('split-in-rotate') ){
                settings.opacity = 0;
                settings.rotateX = "50deg";
            }
            if( $(el).hasClass('split-in-scale') ){
                settings.opacity = 0;
                settings.scale = "0.5";
            }
 
            if( $(el).hasClass('split-lines-transform') ){
                pxl_split.split({
                    type:"lines",
                    lineThreshold: 0.5,
                    linesClass: "split-line"
                }); 
                split_type_set = pxl_split.lines;
                settings.opacity = 0;
                settings.yPercent = 100;
                settings.autoAlpha = 0;
                settings.stagger = 0.1;
            }
            if( $(el).hasClass('split-lines-rotation-x') ){
                pxl_split.split({
                    type:"lines",
                    lineThreshold: 0.5,
                    linesClass: "split-line"
                }); 
                split_type_set = pxl_split.lines;
                settings.opacity = 0;
                settings.rotationX = -120;
                settings.transformOrigin = "top center -50";
                settings.autoAlpha = 0;
                settings.stagger = 0.1;
            }
             
            if( $(el).hasClass('split-words-scale') ){
                pxl_split.split({type:"words"}); 
                split_type_set = pxl_split.words;
               
                $(split_type_set).each(function(index,elw) {
                    gsap.set(elw, {
                        opacity: 0,
                        scale:index % 2 == 0  ? 0 : 2,
                        force3D:true,
                        duration: 0.1,
                        ease: "power3.out",
                        stagger: 0.02,
                    },index * 0.01);
                });

                var pxl_anim = gsap.to(split_type_set, {
                    scrollTrigger: {
                        trigger: el,
                        toggleActions: "play reverse play reverse",
                        start: "top 86%",
                    },
                    rotateX: "0",
                    scale: 1,
                    opacity: 1,
                });
  
            }else{
                var pxl_anim = gsap.from(split_type_set, settings);
            }
             
            if( $(el).hasClass('hover-split-text') ){
                $(el).mouseenter(function(e) {
                    pxl_anim.restart();
                });
            }
        });
    }
    function donalfarm_split_text_hover(){
        var st = $(document).find(".pxl-split-text-only-hover");
 
        if(st.length == 0) return;
        gsap.registerPlugin(SplitText);
        
        st.each(function(index, el) {
            var els = $(el).find('p').length > 0 ? $(el).find('p')[0] : el; 
            const pxl_split_hover = new SplitText(els, { 
                type: "lines, words, chars",
                lineThreshold: 0.5,
                linesClass: "split-line"
            });
            var split_type_set = pxl_split_hover.chars;
           
            gsap.set(els, { perspective: 400 });
 
            var settings = {
                duration: 0.8, 
                stagger: 0.02,
                ease: "power3.out" //circ.out
            };
            if( $(el).hasClass('split-in-fade') ){
                settings.opacity = 0;
            }
            if( $(el).hasClass('split-in-right') ){
                settings.opacity = 0;
                settings.x = "50";
            }
            if( $(el).hasClass('split-in-left') ){
                settings.opacity = 0;
                settings.x = "-50";
            }
            if( $(el).hasClass('split-in-up') ){
                settings.opacity = 0;
                settings.y = "80";
            }
            if( $(el).hasClass('split-in-down') ){
                settings.opacity = 0;
                settings.y = "-80";
            }
            if( $(el).hasClass('split-in-rotate') ){
                settings.opacity = 0;
                settings.rotateX = "50deg";
            }
            if( $(el).hasClass('split-in-scale') ){
                settings.opacity = 0;
                settings.scale = "0.5";
            }
 
            if( $(el).hasClass('split-lines-transform') ){
                pxl_split_hover.split({
                    type:"lines",
                    lineThreshold: 0.5,
                    linesClass: "split-line"
                }); 
                split_type_set = pxl_split_hover.lines;
                settings.opacity = 0;
                settings.yPercent = 100;
                settings.autoAlpha = 0;
                settings.stagger = 0.1;
            }
            if( $(el).hasClass('split-lines-rotation-x') ){
                pxl_split_hover.split({
                    type:"lines",
                    lineThreshold: 0.5,
                    linesClass: "split-line"
                }); 
                split_type_set = pxl_split_hover.lines;
                settings.opacity = 0;
                settings.rotationX = -120;
                settings.transformOrigin = "top center -50";
                settings.autoAlpha = 0;
                settings.stagger = 0.1;
            }
             
            if( $(el).hasClass('split-words-scale') ){
                pxl_split_hover.split({type:"words"}); 
                split_type_set = pxl_split_hover.words;
               
                $(split_type_set).each(function(index,elw) {
                    gsap.set(elw, {
                        opacity: 0,
                        scale:index % 2 == 0  ? 0 : 2,
                        force3D:true,
                        duration: 0.1,
                        ease: "power3.out", //circ.out
                        stagger: 0.02,
                    },index * 0.01);
                });
                var pxl_anim = gsap.to(split_type_set, {
                    rotateX: "0",
                    scale: 1,
                    opacity: 1,
                });

                $(el).mouseenter(function(e) {
                    pxl_anim.restart();
                });
                 
            }else{
                $(el).mouseenter(function(e) {  
                    gsap.from(split_type_set, settings);
                });
            }
        });
    }
    //video button svg 
    function donalfarm_scroll_progress_svg($scope){  
        if($scope.find('.progress-wrap').length > 0){
            var progressPath = document.querySelector('.progress-wrap path');
            var pathLength = progressPath.getTotalLength();
            progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
            progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
            progressPath.style.strokeDashoffset = pathLength;
            progressPath.getBoundingClientRect();
            progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';    
            var updateProgress = function () {
                var scroll = $(window).scrollTop();
                var height = $(window).height() * 1.8;
                var progress = pathLength - (scroll * pathLength / height);
                progressPath.style.strokeDashoffset = progress;
            }
            updateProgress();
            $(window).scroll(updateProgress); 
             
        }
    }
    function donalfarm_parallax_bg(){  
        $(document).find('.pxl-parallax-background').parallaxBackground({
            event: 'mouse_move',
            animation_type: 'shift',
            animate_duration: 2
        });
        $(document).find('.pxl-pll-basic').parallaxBackground();
        $(document).find('.pxl-pll-transform-mouse-move').parallaxBackground();
        $(document).find('.pxl-pll-rotate').parallaxBackground({
            animation_type: 'rotate',
            zoom: 50,
            rotate_perspective: 500
        });
        $(document).find('.pxl-pll-mouse-move').parallaxBackground({
            event: 'mouse_move',
            animation_type: 'shift',
            animate_duration: 2
        });
        $(document).find('.pxl-pll-mouse-move-rotate').parallaxBackground({
            event: 'mouse_move',
            animation_type: 'rotate',
            animate_duration: 1,
            zoom: 30,
            rotate_perspective: 1000
        });

        $(document).find('.pxl-bg-prx-effect-pinned-zoom-clipped').each(function(index, el) {
            var $el = $(el);
            const clipped_bg_pinned = $el.find('.clipped-bg-pinned'); 
            const clipped_bg = $el.find('.clipped-bg');
            if( clipped_bg.length <= 0) return; 
            var clipped_bg_animation = gsap.to(clipped_bg, {
                clipPath: 'inset(0% 0% 0%)',
                scale: 1,
                duration: 1,
                ease: 'Linear.easeNone'
            });

            var clipped_bg_scene = ScrollTrigger.create({
                trigger: clipped_bg_pinned,
                start: "top center",
                end: function() {
                    const end_pin = 0;
                    return "+=" + end_pin;
                },
                animation: clipped_bg_animation,
                scrub: 1,
                pin: true,
                pinSpacing: false,
            });

            function set_clipped_bg_wrapper_height() {
                gsap.set(clipped_bg, { height: window.innerHeight });                                
            }  
            window.addEventListener('resize', set_clipped_bg_wrapper_height);
        });
    }
    function donalfarm_parallax_effect(){ 
        if( $(document).find('.pxl-parallax-effect.mouse-move').length > 0 ){

            setTimeout(function(){
                $('.pxl-parallax-effect.mouse-move').each(function(index, el) {
                    var $this = $(this);
                    var $bound = 'undefined'; 
                    
                    if( $this.closest('.mouse-move-bound').length > 0 ){
                        $bound = $this.closest('.mouse-move-bound');
                    }
                    if ( $(this).hasClass('bound-section') ){
                        $bound = $this.closest('.elementor-section');
                    }
                    if ( $(this).hasClass('bound-column') ){
                        $bound = $this.closest('.elementor-column');
                    }
                    if ( $(this).hasClass('mouse-move-scope') ){
                        $bound = $this.parents('.mouse-move-scope');
                        if( $bound.length <= 0 )
                            $bound = $this;
                    }


                    if( $bound != 'undefined' && $bound.length > 0 )
                        donalfarm_parallax_effect_mousemove($this, $bound);
                });
            }, 600);
        }
    }
    function donalfarm_parallax_effect_mousemove($this, $bound){  
        
        var rect = $bound[0].getBoundingClientRect();
         
        var mouse = {x: 0, y: 0, moved: false};
        
        $bound.on('hover', function(e) {
                mouse.moved = true; 
            }, function(e) {
                mouse.moved = false;
                gsap.to($this[0], {
                    duration: 0.5,
                    x: 0,
                    y: 0,
                });   
            }
        );

        $bound.on( "mousemove", function( e ) {
            mouse.moved = true;
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            gsap.to($this[0], {
                duration: 0.5,
                x: (mouse.x - rect.width / 2) / rect.width * -100,
                y: (mouse.y - rect.height / 2) / rect.height * -100
            });
        });
          
        $(window).on('resize scroll', function(){
            rect = $bound[0].getBoundingClientRect();
        })
 
    }
    function donalfarm_pxl_hover_target_handler(){
        var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        for(let x in numbers){
            $('.pxl-hover-target-'+x).on("mouseenter", function() {
                if(  $('.pxl-hover-target-'+x+'-destination').length > 0 ){
                    $('.pxl-hover-target-'+x+'-destination').siblings('.active').removeClass('active');
                    $('.pxl-hover-target-'+x+'-destination').addClass('active');
                }
            });
        }

    }
    function donalfarm_weather_handler($scope){
        var $this = $scope.find('.location-weather-wrap');
        var settings = $this.data('settings');

        $($this.find('.weather-temp')).pxl_location_weather({
            key: settings.key,
            city: settings.city,
            units: 'c',
            iconTarget: $this.find('.pxl-weather-icon'),
            weatherDate: $this.find('.pxl-weather-time'),
            lat: settings.lat,
            lng: settings.lng,
            show_date: settings.show_date,
            show_time: settings.show_time,
            customIcons: settings.custom_icons,
            success: function(data) {
                $this.show();
            },
            error: function(data) {
                $this.remove();
            }
        });
         
    }

    function donalfarm_map_var_css($scope){ 
        if( $scope.find('.pxl-map-wrap').length > 0){
            var posX = 0,
                posY = 0;
            var mouseX = 0,
                mouseY = 0;

            var offset_left = 0;
            var offset_right = 0;
            var offset_top = 0;
            var offset_bottom = 0;

            $(document).on("mousemove", function(e) {
                offset_left = e.clientX; 
                offset_right = $(window).width() - offset_left;

                offset_top = e.clientY;
                offset_bottom = $(window).height() - offset_top;
 
            });

            $('.show-maps').on("mousemove", function(e) {
                var offset = $(this).offset();  
                mouseX = (e.pageX - offset.left);
                mouseY = (e.pageY - offset.top);
            });

            var map_content_width = $('.pxl-map-wrap').width();
            var map_content_height = $('.pxl-map-wrap').height();

            TweenMax.to({}, 0.01, {
                repeat: -1,
                onRepeat: function() {
                    posX += (mouseX - posX);
                    posY += (mouseY - posY);
                     
                    var base_left = posX - 30 - map_content_width;
                    if(offset_left < (base_left*-1) + mouseX ){
                        base_left = posX + 30;
                    } 

                    var top_pos = posY - (map_content_width * 0.5);
                    if($(window).innerWidth() <= 767){
                        base_left = (offset_left * -1) + mouseX + 15;
                        top_pos = (map_content_height * -1) + mouseY - 15;
                    }
                    TweenMax.set($('.pxl-map-wrap:not(.clicked)'), {
                        css: {
                            left: base_left,
                            top: top_pos
                        }
                    });
                     
                }
            });
            $('.show-maps').on("mouseenter", function() {
                $(this).find(".pxl-map-wrap").removeClass("deactive").addClass("active");   
            }); 
            $('.show-maps').on("mouseleave", function() {
                $(this).find(".pxl-map-wrap").removeClass("active").addClass("deactive");   
            }); 

            $(document).on('mousedown','.show-maps.show-popup',function(){
                $(this).find(".pxl-map-wrap").addClass("clicked");
                var p_left = 0;
                var p_top = 0;
                var zoom_w = ($(window).width() / 2);
                var zoom_h = ($(window).height() / 1.8);
                 
                if( offset_right < (zoom_w/2) ){
                    p_left = (zoom_w/-2) + mouseX + 15;
                  
                }  
                if( offset_bottom < (zoom_h/2) ){
                    p_top = (zoom_h/-2) + mouseY + 30;
                }  
                
                if( offset_left < (zoom_w/2) ){
                    p_left = (zoom_w/2) - 15;
                } 

                if($(window).innerWidth() <= 767){
                    p_left = (offset_left * -1) + mouseX + 30;
                    zoom_w = ($(window).width() - 60);
                    zoom_h = ($(window).height() - 200);
                }

                $(this).find(".pxl-map-wrap").css({
                    left: p_left,
                    top: p_top,
                    width: zoom_w,
                    height: zoom_h
                }); 
                $(".show-maps").addClass('hide') ;
            });
         
            $(document).on('mouseout','.pxl-map-wrap',function(){
                $(this).removeClass("clicked"); 
                $(".show-maps").removeClass('hide') ; 
                $(this).css({
                    width: map_content_width,
                    height: map_content_height
                });  
            });
        }
    }
    function donalfarm_typed_text($scope){
        if( $scope.find('.typed-text').length > 0){
            var data_texts = $scope.find('.typed-text').data('typed-text');
            var typed_tag = $scope.find('.pxl-typed')[0];
            if(typeof data_texts != 'undefined'){
                new Typed(typed_tag,{
                    strings : data_texts,
                    stringsElement: null,
                    typeSpeed : 40,
                    startDelay: 1200,
                    backSpeed: 20,
                    backDelay: 500,
                    loop : true,
                    showCursor: false,
                    cursorChar: '|',
                    attr: null,
                    contentType: 'html',
                    fadeOut: false,
                    fadeOutClass: 'typed-fade-out',
                    fadeOutDelay: 500,   
                });
            }
        }
    }
    
    $( window ).on( 'elementor/frontend/init', function() {
        
        elementorFrontend.hooks.addAction( 'frontend/element_ready/section', function( $scope ) {
            donalfarm_animation_handler($scope);
        } );

        donalfarm_parallax_bg(); 
        donalfarm_parallax_effect(); 
        donalfarm_pxl_hover_target_handler(); 

        elementorFrontend.hooks.addAction( 'frontend/element_ready/pxl_heading.default', function( $scope ) {
            donalfarm_split_text($scope);
            donalfarm_typed_text($scope);
        } );

        elementorFrontend.hooks.addAction( 'frontend/element_ready/pxl_post_title.default', function( $scope ) {
            donalfarm_split_text($scope);
        } );

        elementorFrontend.hooks.addAction( 'frontend/element_ready/pxl_button.default', function( $scope ) {
            donalfarm_split_text($scope);
        } );

        elementorFrontend.hooks.addAction( 'frontend/element_ready/pxl_text_editor.default', function( $scope ) {
            donalfarm_split_text($scope);
        } );
        elementorFrontend.hooks.addAction( 'frontend/element_ready/pxl_history.default', function( $scope ) {
            donalfarm_split_text($scope);
        } );

        setTimeout(function () { 
            donalfarm_split_text_hover();
        }, 500);

        elementorFrontend.hooks.addAction( 'frontend/element_ready/pxl_contact_info.default', function( $scope ) {
            donalfarm_map_var_css($scope);
        } );

    } );


    $( document ).ready( function() { 
        setTimeout(function () {
            $(document).find('.pxl-clip-overlap').each( function () { //set height for block with pupose hover easy
                var el_clip_height = $(this).find('.clip-overlap-part').outerHeight();
                $(this).find('.clip-content-wrap').css('--clip-height',el_clip_height+'px');
            });
            $(document).find('.pxl-clip-overlap').each( function () { //set height for block with pupose hover easy
                var el_clip_height = $(this).find('.clip-overlap-part').outerHeight();
                $(this).find('.clip-content-wrap').css('--clip-height',el_clip_height+'px');
            });
        }, 1000);
    });
     
    $(window).on('resize', function () {
        setTimeout(function () {
            $(document).find('.pxl-clip-overlap').each( function () {
                var el_clip_height = $(this).find('.clip-overlap-part').outerHeight();
                $(this).find('.clip-content-wrap').css('--clip-height',el_clip_height+'px');
            });
        }, 1000);
 
    });
     
} )( jQuery );

 
 