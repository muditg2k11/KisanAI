( function( $ ) { 
    // Make sure you run this code under Elementor.
    $( window ).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/pxl_slider.default', function( $scope ) {
            gsap.registerPlugin(SplitText);
            pxl_slider_handler($scope);
        } );
    } );

    function pxl_slider_handler( $scope) {
         
        var $this = $scope.find('.pxl-sliders-wrap');
        var settings = $this.find('.pxl-slider-container').data().settings;
        var carousel_settings = {
            direction: settings['slide_direction'],
            effect: settings['slide_mode'],
            wrapperClass : 'pxl-slider-wrapper',
            slideClass: 'pxl-slider-item',
            slidesPerView: 1,
            slidesPerGroup: 1,
            slidesPerColumn: 1,
            spaceBetween: 0,
            parallax: true,
            preloadImages: true,
            navigation: {
                nextEl: $this.find('.pxl-slider-arrow-next')[0], 
                prevEl: $this.find('.pxl-slider-arrow-prev')[0]
            },
            pagination : {
                type: (settings['dots_style'] == 'bullets' || settings['dots_style'] == 'bullets-number') ? 'bullets' : settings['dots_style'],
                el: $this.find('.pxl-slider-dots')[0],
                clickable : true,
                modifierClass: 'pxl-slider-pagination-',
                bulletClass : 'pxl-slider-pagination-bullet',
                formatFractionCurrent: function (number) {
                    return ('0' + number).slice(-2);
                },
                formatFractionTotal: function (number) {
                    return ('0' + number).slice(-2);
                },
                renderFraction: function (currentClass, totalClass) {
                    return '<span class="' + currentClass + '"></span>' +
                           '<span class="divider"></span>' +
                           '<span class="' + totalClass + '"></span>';
                },
                renderCustom: function (swiper, element, current, total) {
                    return current + ' of ' + total;
                }
            },
            speed: settings['speed'],
            watchSlidesProgress: true,
            autoplay: settings['autoplay'],
            autoHeight: true,
            allowTouchMove: true,
            runCallbacksOnInit: false,
            creativeEffect: {
                prev: {
                    shadow: true,
                    translate: ["-120%", 0, -500],
                },
                next: {
                    shadow: true,
                    translate: ["120%", 0, -500],
                },
            },
            on: {
                beforeInit: function (swiper){ 
                    $this.addClass('pxl-swiper-initialized');
                    
                },
                init : function (swiper){ 
                    var active_index = this.activeIndex; 
                    var $el = (typeof this.$el !== 'undefined') ? this.$el : $(this.el);
                    if( !settings['split_text_on_scroll']){
                        pxl_split_text($el); 
                    }

                    if( !settings['animation_on_scroll']){
                        pxl_slide_animate(this, 'init'); 
                    }else{
                        $(this.slides).each(function(index, el){ 
                            var $slide = $(el); 
                            if(index != active_index){ 
                                $slide.find('.pxl-elementor-animate').each(function(){
                                    var $this = $(this); 
                                    elementorFrontend.waypoint($this, function () {
                                        var data = $this.data('settings');
                                        if(typeof data != 'undefined' && typeof data['_animation'] != 'undefined'){
                                            setTimeout(function () {
                                                $this.removeClass('animated '+data['_animation']).addClass('elementor-invisible');
                                            }, 800);
                                        }
                                    });
                                });

                                $slide.find('.pxl-animate').each(function(){
                                    var $this = $(this); 
                                    elementorFrontend.waypoint($this, function () {
                                        var data = $this.data('settings');
                                        if(typeof data != 'undefined' && typeof data['animation'] != 'undefined'){
                                            setTimeout(function () {
                                                $this.removeClass('animated '+data['animation']).addClass('pxl-invisible');
                                            }, 800);
                                        }
                                    });
                                });
                            }
                            
                        });
                         
                    }

                },
                slideChangeTransitionStart : function (){
                    var active_index = this.activeIndex;
                    var $el = (typeof this.$el !== 'undefined') ? this.$el : $(this.el);
                    pxl_split_text($el);  

                },
                slideChange: function (swiper) {
                    $scope.find('.pxl-slider-wrapper.onload').removeClass('onload');
                    var active_index = this.activeIndex; 
                    var ridx = this.realIndex;    
                    pxl_slide_animate(this, 'onchange'); 
                },
                sliderMove: function (swiper) { 
                    var active_index = this.activeIndex; 
                    var ridx = this.realIndex;   
                }
            }
        };

        if( settings['dots_style'] == 'bullets-number' ){
            carousel_settings['pagination'].renderBullet = function (index, className) {
                var num = (index + 1); 
                var num_str = num < 10 ? '0'+num.toString() : num;
                return '<span class="' + className + '">' + num_str + "</span>";
            };
        }

        
        if(settings['center_mode'] || settings['center_mode'] == 'true')
            carousel_settings['centeredSlides'] = true;

        if(settings['loop'] || settings['loop'] === 'true'){
            carousel_settings['loop'] = true;
        }
      
        if(settings['autoplay'] || settings['autoplay'] === 'true'){
            carousel_settings['autoplay'] = {
                delay : settings['delay'],
                disableOnInteraction : settings['pause_on_interaction']
            };
        } else {
            carousel_settings['autoplay'] = false;
        }

        // Effect
        if(settings['slide_mode'] === 'cube'){
            carousel_settings['cubeEffect'] = {
                shadow: false,
                slideShadows: false,
                shadowOffset: 0,
                shadowScale: 0, //0.94,
            };
        }
        if(settings['slide_mode'] === 'coverflow'){
            carousel_settings['centeredSlides'] = true;
            carousel_settings['coverflowEffect'] = {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: false,
            };
        }
 
        var swiper = new Swiper($this.find('.pxl-slider-container')[0], carousel_settings);

        if(settings['autoplay'] && settings['pause_on_hover'] ){
            $( $this.find('.pxl-slider-container') ).on({
                mouseenter: function mouseenter() {
                    this.swiper.autoplay.stop();
                },
                mouseleave: function mouseleave() {
                    this.swiper.autoplay.start();
                }
            });
        }

    }

    function pxl_slide_animate(item, event){
        var active_index = item.activeIndex; 

        $(item.slides).each(function(index){ 
            var $slide = $(this);
            if(index == active_index){
                if( event == 'onchange'){
                    $slide.find('.pxl-elementor-animate').each(function(){
                        var $this = $(this); 
                        var data = $this.data('settings');
                        if(typeof data != 'undefined' && typeof data['_animation'] != 'undefined'){
                            $this.find('.pxl-btn').css('transition','all 300ms cubic-bezier(0.46, 0.23, 1, 1)');
                            var animation_delay = (typeof data['_animation_delay'] != 'undefined') ? data['_animation_delay'] : 0;
                            setTimeout(function () {  
                                $this.removeClass('elementor-invisible').addClass('animated ' + data['_animation']);
                            }, animation_delay);
                        }
                    });
                }
               
                $slide.find('.pxl-animate').each(function(){
                    var $this = $(this); 
                    var data = $this.data('settings');
                    if(typeof data != 'undefined' && typeof data['animation'] != 'undefined'){
                        $this.find('.pxl-btn').css('transition','all 300ms cubic-bezier(0.46, 0.23, 1, 1)');
                        var animation_delay = (typeof data['animation_delay'] != 'undefined') ? data['animation_delay'] : 0;
                        setTimeout(function () {  
                            $this.removeClass('pxl-invisible').addClass('animated ' + data['animation']);
                        }, animation_delay);
                    }
                });
                
                $slide.find('.pxl-draw-from-top').each(function(){
                    $(this).addClass('pxl-animated');
                });
                $slide.find('.pxl-draw-from-left').each(function(){
                    $(this).addClass('pxl-animated');
                });
                $slide.find('.pxl-draw-from-right').each(function(){
                    $(this).addClass('pxl-animated');
                });
                $slide.find('.pxl-move-from-left').each(function(){
                    $(this).addClass('pxl-animated');
                }); 
                $slide.find('.pxl-move-from-right').each(function(){
                    $(this).addClass('pxl-animated');
                });
                $slide.find('.pxl-skew-in').each(function(){
                    $(this).addClass('pxl-animated');
                });
                $slide.find('.pxl-skew-in-right').each(function(){
                    $(this).addClass('pxl-animated');
                });
                $slide.find('.pxl-zoom-in').each(function(){
                    $(this).addClass('pxl-animated');
                });
                $slide.find('.pxl-zoom-out').each(function(){
                    $(this).addClass('pxl-animated');
                });
            }else{ 
                if( event == 'onchange'){
                    $slide.find('.pxl-elementor-animate').each(function(){ 
                        var $this = $(this); 
                        var data = $this.data('settings');
                        if(typeof data != 'undefined' && typeof data['_animation'] != 'undefined'){ 
                            $this.find('.pxl-btn').css('transition','none');
                            $this.removeClass('animated '+data['_animation']).addClass('elementor-invisible');  
                        }
                    });
                }
                 
                $slide.find('.pxl-animate').each(function(){
                    var $this = $(this); 
                    var data = $this.data('settings');
                    if(typeof data != 'undefined' && typeof data['animation'] != 'undefined'){
                        $this.find('.pxl-btn').css('transition','none');
                        $this.removeClass('animated '+data['animation']).addClass('pxl-invisible');
                    }
                });

                $slide.find('.pxl-draw-from-top').each(function(){
                    $(this).removeClass('pxl-animated');
                });
                $slide.find('.pxl-draw-from-left').each(function(){
                    $(this).removeClass('pxl-animated');
                }); 
                $slide.find('.pxl-draw-from-right').each(function(){
                    $(this).removeClass('pxl-animated');
                }); 
                $slide.find('.pxl-move-from-left').each(function(){
                    $(this).removeClass('pxl-animated');
                });
                $slide.find('.pxl-move-from-right').each(function(){
                    $(this).removeClass('pxl-animated');
                }); 
                $slide.find('.pxl-skew-in').each(function(){
                    $(this).removeClass('pxl-animated');
                });
                $slide.find('.pxl-skew-in-right').each(function(){
                    $(this).removeClass('pxl-animated');
                });
                $slide.find('.pxl-zoom-in').each(function(){
                    $(this).removeClass('pxl-animated');
                });
                $slide.find('.pxl-zoom-out').each(function(){
                    $(this).removeClass('pxl-animated');
                });
            } 
        }); 
    }

    function pxl_ken_burns(item) {
        
        var active_index = item.activeIndex; 
      
        $(item.slides).each(function(index){ 
            
            if(index == active_index){
                $(this).find('.pxl-ken-burns').addClass('pxl-ken-burns--active');
            }else{
                $(this).find('.pxl-ken-burns').removeClass('pxl-ken-burns--active');
            } 
        });
    }

    function pxl_split_text(sliderDOM){
        
        const slideActive = sliderDOM.find(".swiper-slide-active");
        const slideCaption = slideActive.find(".pxl-split-text");
        if( slideCaption.length > 0 ){
            gsap.set(slideCaption, { autoAlpha: 1 });
        }
        var st = slideActive.find(".pxl-split-text");
        
        st.each(function() { 
            var el = $(this);
            var els = $(el).find('p').length > 0 ? $(el).find('p')[0] : el;

            const pxl_split = new SplitText(els, { 
                type: "lines, words, chars",
                lineThreshold: 0.5,
                linesClass: "split-line"
            });

            var split_type_set = pxl_split.chars;
            gsap.set(els, { perspective: 400 });

            var settings = {
                duration: 0.8, 
                stagger: 0.02,
                ease: "sine.out",
            };

            settings.onComplete = function() {
                setTimeout(function(){
                    pxl_split.revert();
                }, 7000);
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
               
                $(split_type_set).each(function(index,el) {
                    gsap.set(el, {
                        opacity: 0,
                        scale:index % 2 == 0  ? 0 : 2,
                        force3D:true,
                        duration: 0.6,
                        ease: "sine.out", //circ.out
                        stagger: 0.02,
                    },index * 0.01);
                });

                var settings_wscale = {
                    rotateX: "0",
                    scale: 1,
                    opacity: 1,
                }; 
               
                settings_wscale.onComplete = function() {
                    setTimeout(function(){
                        pxl_split.revert();
                    }, 7000);
                }

                var pxl_anim = gsap.to(split_type_set, settings_wscale);
                 
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
    
} )( jQuery );

 