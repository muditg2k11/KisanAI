;(function ($) {
    "use strict";
    var scroll_top;
    var window_height;
    var window_width;
    var scroll_status = '';
    var lastScrollTop = 0;

    var $form;
    var VariationFormObj = false;

    $( document ).ready( function() {
        window_width = $(window).outerWidth();
        donalfarm_events_handler();
        donalfarm_header_sticky();
        donalfarm_mega_menu_style();
        donalfarm_nice_select();
        donalfarm_scroll_to_top();
        donalfarm_footer_fixed();
        donalfarm_light_gallery();

        // shop loop handler
        donalfarm_shop_loop_handler();

        //single product handler
        donalfarm_single_product_handler();
        donalfarm_single_product_add_to_cart_ajax_handler();

        //cart
        donalfarm_cart_handler();
        //donalfarm_canvas_dropdown_mini_cart();
        donalfarm_update_cart_quantity();  
        donalfarm_mini_cart_dropdown_offset();
    });
      
    $(window).on('load', function () {
        if($('.pxl-loader').length > 0){
            $('.pxl-loader').fadeOut("slow");
        }
        if($('.pxl-pagetitle').length > 0){  
            $('.pxl-pagetitle').addClass('pxl-animate');
        }
    });

    $(window).on('resize', function () {
        window_width = $(window).outerWidth();
        donalfarm_mega_menu_style();
        donalfarm_footer_fixed();
        donalfarm_mini_cart_dropdown_offset();
    });

    $(document).ajaxComplete(function(event, xhr, settings){   
        donalfarm_nice_select()
    });

    $(window).on('scroll', function () {
        scroll_top = $(window).scrollTop();
        window_height = $(window).height();
        window_width = $(window).outerWidth();
        if (scroll_top < lastScrollTop) {
            scroll_status = 'up';
        } else {
            scroll_status = 'down';
        }
        lastScrollTop = scroll_top;
        
        if( window_width <= 600 && $('#wpadminbar').length > 0 ){
            if(scroll_top > 46){
                $('.pxl-hidden-template').css({
                    top: 0,
                    height: '100%'
                });
            }else{
                $('.pxl-hidden-template').css({
                    top: '46px',
                    height: 'calc(100% - 46px)'
                });
            }
        }
        
        donalfarm_header_sticky();
        donalfarm_scroll_to_top();
        donalfarm_adjust_hidden_sidebar_custom_offset();
    });

    $( document.body ).on( 'wc_fragments_loaded wc_fragments_refreshed', function() {
        donalfarm_mini_cart_body_caculate_height();
        $('.pxl-hidden-template-canvas-cart').removeClass('loading');
        $('.pxl-cart-dropdown').removeClass('loading');
        $('body').removeClass('loading');
    });
   
    function donalfarm_events_handler(){
        'use strict';

        $('.pxl-primary-menu > li').on("mouseenter", function() {
            $(this).siblings('li').each(function(index, el) {
                $(el).find(' > a').css('opacity','0.6');
            });
        });
        $('.pxl-primary-menu > li').on("mouseleave", function() {
            $(this).siblings('li').each(function(index, el) {
                $(el).find(' > a').css('opacity','1');
            });
        });

        $('.main-menu-toggle').on('click', function () {
            $(this).toggleClass('open');
            $(this).closest('.menu-item').toggleClass('active');
            $(this).closest('.menu-item').siblings('.active').toggleClass('active');
            $(this).closest('.menu-item').siblings().find('.submenu-open').toggleClass('submenu-open').slideToggle();
            $(this).siblings('.sub-menu').toggleClass('submenu-open').slideToggle();
        });
        $('.pxl-mobile-menu').on('click','.menu-item-has-children > a',function(e){
            if( $(this).attr('href') == '#' || typeof $(this).attr('href') === 'undefined'){
                $(this).parent().find('> .main-menu-toggle').toggleClass('open'); 
                $(this).parent().find('> .sub-menu').toggleClass('submenu-open');
                $(this).parent().find('> .sub-menu').slideToggle();
            }
        });
        
        $('.pxl-canvas-menu .menu-item-has-children > a').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).closest('.menu-item').toggleClass('active');
            $(this).closest('.menu-item').siblings('.active').toggleClass('active');
            $(this).closest('.menu-item').siblings().find('.submenu-open').toggleClass('submenu-open').slideToggle();
            $(this).siblings('.sub-menu').toggleClass('submenu-open').slideToggle();
        });
        $('.pxl-canvas-menu .menu-item').each(function(index, el) {
            if( $(this).hasClass('current-menu-parent') || $(this).hasClass('current-menu-ancestor') ){
                $(this).addClass('active');
                $(this).find('>.sub-menu').addClass('submenu-open').slideToggle();
            }
        });

        $(document).on('click','.pxl-cart-toggle',function(e){
            e.preventDefault();
            e.stopPropagation();
            var target = $(this).attr('data-target');
            $(this).toggleClass('cliked');
            $(target).toggleClass('open');
            $('.pxl-page-overlay').toggleClass('active');
        });

        $(document).on('click','.pxl-anchor.side-panel',function(e){
            e.preventDefault();
            e.stopPropagation();
            var target = $(this).attr('data-target');
            $(this).toggleClass('cliked');
            $(target).toggleClass('open');
            $('.pxl-page-overlay').toggleClass('active');  
            var attr = $(this).attr('data-form-type');
            if (typeof attr !== 'undefined' && attr == 'login') {
                $('.pxl-register-form').removeClass('active');
                $('.pxl-login-form').addClass('active');
            }
            if (typeof attr !== 'undefined' && attr == 'reg') {
                $('.pxl-login-form').removeClass('active');
                $('.pxl-register-form').addClass('active');
            }
             
        });
 
        $(document).on('click','.pxl-close',function(e){
            e.preventDefault();
            e.stopPropagation();
            $(this).closest('.pxl-hidden-template').toggleClass('open');
            $('.pxl-page-overlay').removeClass('active');
            $(this).closest('.pxl-login-form-checkout').removeClass('open');
        });

        $(document).on('click',function (e) {
            var target = $(e.target);
            var check = '.pxl-anchor.side-panel, .pxl-anchor-cart.pxl-anchor, .mfp-woosq .mfp-close, .woosw-popup .woosw-popup-close';
            
            if (!(target.is(check)) && target.closest('.pxl-hidden-template').length <= 0 && $('.pxl-page-overlay').hasClass('active')) { 
                $('.pxl-hidden-template').removeClass('open');
                $('.pxl-page-overlay').removeClass('active');
            }
            if (!(target.is('.review-btn-anchor.pxl-anchor')) && target.closest('.pxl-hidden-template-wrap').length <= 0 && $('.pxl-page-overlay').hasClass('active')) { 
                $('.pxl-hidden-template').removeClass('open');
                $('.pxl-page-overlay').removeClass('active');
            }
            if ( !(target.is('.pxl-anchor-cart.pxl-anchor')) && target.closest('.pxl-cart-dropdown').length <= 0 ) {  
                $('.pxl-cart-dropdown').removeClass('open');
            }
            if ( $('.pxl-login-form-checkout').length > 0 && $('.pxl-login-form-checkout').hasClass('open') && target.closest('.pxl-hidden-template-wrap').length <= 0) {  
                $('.pxl-login-form-checkout').removeClass('open'); 
            }
        });

        $('.pxl-scroll-top').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var _target = $(this).attr('data-target');
            $('html, body').stop().animate({ scrollTop: $(_target).offset().top }, 1000);   
        });

        $('.pxl-mobile-menu .is-one-page').on('click', function(e) {
            $(document).trigger('click');
        });

        //* Menu Dropdown back  
        $('.pxl-primary-menu li').each(function () {
            var $submenu = $(this).find('> ul.sub-menu');
            if ($submenu.length == 1) {
                $(this).on('hover', function() {
                    if ($submenu.offset().left + $submenu.width() > $(window).width()) {
                        $submenu.addClass('back');
                    } else if ($submenu.offset().left < 0) {
                        $submenu.addClass('back');
                    }
                }, function () {
                    $submenu.removeClass('back');
                });
            }
        });

        $( document ).on( 'click', '.pxl-anchor-cart .pxl-anchor', function( e ) {
            e.preventDefault();
            e.stopPropagation();
            var target = $(this).attr('data-target');
            if( target == '.pxl-cart-dropdown'){
                $(this).next(target).toggleClass('open');    
            }else{
                $(target).toggleClass('open');
                $('.pxl-page-overlay').toggleClass('active');   
                $('.product-main-img .pxl-cursor-icon').addClass('hide'); 
            }
             
        });
    }
    
    function donalfarm_header_sticky() {
        'use strict';
        if($(document).find('.pxl-header-sticky').length > 0 && window_width >= 1200){
            var header_height = $('.pxl-header-desktop').outerHeight();
            var header_transparent_height = $('.pxl-header-transparent').outerHeight();

            var offset_top_nimation = typeof header_transparent_height !== 'undefined' ? (header_height + header_transparent_height) : header_height;
             
            if( scroll_status == 'down' && $('.pxl-header').hasClass('sticky-direction-scroll-down') && scroll_top > offset_top_nimation ){
                $(document).find('.pxl-header-sticky').addClass('h-fixed');
            }else if( scroll_status == 'up' && $('.pxl-header').hasClass('sticky-direction-scroll-up') && scroll_top > offset_top_nimation ){
                $(document).find('.pxl-header-sticky').addClass('h-fixed');
            }else if( $('.pxl-header').hasClass('sticky-direction-scroll') && scroll_top > offset_top_nimation ){
                $(document).find('.pxl-header-sticky').addClass('h-fixed');
            }else{
                $(document).find('.pxl-header-sticky').removeClass('h-fixed');
            } 
            
        } 
        if($(document).find('.pxl-header-main-sticky').length > 0 && window_width >= 1200){
            let tl = gsap.timeline({
                defaults: {
                    duration: 0.2
                }
            });
            var header_height = $('.pxl-header-desktop').outerHeight();
            var main_sticky_height = $('.pxl-header-main-sticky').outerHeight();
            if( scroll_top > (header_height + main_sticky_height) ){    
                if (scroll_status == 'down' && $('.pxl-header').hasClass('sticky-direction-scroll-down') ) {
                    $(document).find('.pxl-header-main-sticky').addClass('h-fixed');
                    tl.to('.pxl-header-main-sticky', {
                        y: 0
                    });
                }else if( scroll_status == 'up' && $('.pxl-header').hasClass('sticky-direction-scroll-up') ){
                    $(document).find('.pxl-header-main-sticky').addClass('h-fixed');
                    tl.to('.pxl-header-main-sticky', {
                        y: 0
                    });
                }else if( $('.pxl-header').hasClass('sticky-direction-scroll') ){
                    $(document).find('.pxl-header-main-sticky').addClass('h-fixed');
                    tl.to('.pxl-header-main-sticky', {
                        y: 0
                    });
                }else{
                    tl.to('.pxl-header-main-sticky', {
                        y: (main_sticky_height * -1)
                    });
                }
            }else{
                $(document).find('.pxl-header-main-sticky').removeClass('h-fixed');
                tl.to('.pxl-header-main-sticky', {
                    y: 0
                });
            }
        } 


        if ( $(document).find('.pxl-header-mobile-sticky').length > 0 && window_width < 1200  ) {
            var offset_top = $('.pxl-header-mobile').outerHeight();
            offset_top = $('.pxl-header-mobile-transparent').length > 0 ? (offset_top + $('.pxl-header-mobile-transparent').outerHeight()) : offset_top;
            if (scroll_status == 'down' && $('.pxl-header').hasClass('sticky-direction-scroll-down') && scroll_top > offset_top) {
                $(document).find('.pxl-header-mobile-sticky').addClass('mh-fixed');
            }else if (scroll_status == 'up' && $('.pxl-header').hasClass('sticky-direction-scroll-up') && scroll_top > offset_top) {
                $(document).find('.pxl-header-mobile-sticky').addClass('mh-fixed');
            }else if ( $('.pxl-header').hasClass('sticky-direction-scroll') && scroll_top > offset_top) {
                $(document).find('.pxl-header-mobile-sticky').addClass('mh-fixed');
            }else{
                $(document).find('.pxl-header-mobile-sticky').removeClass('mh-fixed');
            }
        }
        if ( $(document).find('.pxl-header-mobile-main-sticky').length > 0 && window_width < 1200  ) {
           
            let timel = gsap.timeline({
                defaults: {
                    duration: 0.2
                }
            });
            var offset_top = $('.pxl-header-mobile').outerHeight();
            var mobile_main_sticky_height = $('.pxl-header-mobile-main-sticky').outerHeight();
            if( scroll_top > (offset_top + mobile_main_sticky_height) ){    
                if (scroll_status == 'down' && $('.pxl-header').hasClass('sticky-direction-scroll-down')) {
                    $(document).find('.pxl-header-mobile-main-sticky').addClass('mh-fixed');
                    timel.to('.pxl-header-mobile-main-sticky', {
                        y: 0
                    });
                }else if( scroll_status == 'up' && $('.pxl-header').hasClass('sticky-direction-scroll-up') ){
                    $(document).find('.pxl-header-mobile-main-sticky').addClass('mh-fixed');
                    timel.to('.pxl-header-mobile-main-sticky', {
                        y: 0
                    });    
                }else if( $('.pxl-header').hasClass('sticky-direction-scroll') ){
                    $(document).find('.pxl-header-mobile-main-sticky').addClass('mh-fixed');
                    timel.to('.pxl-header-mobile-main-sticky', {
                        y: 0
                    });    
                }else{
                    timel.to('.pxl-header-mobile-main-sticky', {
                        y: (mobile_main_sticky_height * -1)
                    });
                }
            }else{
                $(document).find('.pxl-header-mobile-main-sticky').removeClass('mh-fixed');
                timel.to('.pxl-header-mobile-main-sticky', {
                    y: 0
                });
            }
        } 

        if ( $(document).find('.pxl-header-mobile-transparent-sticky').length > 0 && window_width < 1200  ) {
            let timel = gsap.timeline({
                defaults: {
                    duration: 0.2
                }
            });
            var offset_top = $('.pxl-header-mobile').outerHeight();
            var mobile_main_sticky_height = $('.pxl-header-mobile-transparent-sticky').outerHeight();
            if( scroll_top > (offset_top + mobile_main_sticky_height + 1) ){    
                if (scroll_status == 'down' && $('.pxl-header').hasClass('sticky-direction-scroll-down')) {
                    $(document).find('.pxl-header-mobile-transparent-sticky').addClass('mh-fixed');
                    timel.to('.pxl-header-mobile-transparent-sticky', {
                        y: 0
                    });
                }else if( scroll_status == 'up' && $('.pxl-header').hasClass('sticky-direction-scroll-up') ){
                    $(document).find('.pxl-header-mobile-transparent-sticky').addClass('mh-fixed');
                    timel.to('.pxl-header-mobile-transparent-sticky', {
                        y: 0
                    });     
                }else if( $('.pxl-header').hasClass('sticky-direction-scroll') ){
                    $(document).find('.pxl-header-mobile-transparent-sticky').addClass('mh-fixed');
                    timel.to('.pxl-header-mobile-transparent-sticky', {
                        y: 0
                    });     
                }else{
                    timel.to('.pxl-header-mobile-transparent-sticky', {
                        y: (mobile_main_sticky_height * -1)
                    });
                }
            }else{
                $(document).find('.pxl-header-mobile-transparent-sticky').removeClass('mh-fixed');
                timel.to('.pxl-header-mobile-transparent-sticky', {
                    y: 0
                });
            }
        }
    }
 
    function donalfarm_mega_menu_style(){
        if($(document).find('.pxl-mega-menu').length > 0){
            if($(window).outerWidth() < 1200 ){
                $('.pxl-mega-menu').closest("li.pxl-megamenu").css('position', 'relative');    
                $('.pxl-mega-menu').closest(".elementor-widget").css('position', 'relative');    
                $('.pxl-mega-menu').closest(".elementor-container").css('position', 'relative');    
                $('.pxl-mega-menu').closest(".elementor-widget-wrap").css('position', 'relative');    
                $('.pxl-mega-menu').closest(".elementor-column").css('position', 'relative');
            }else{
                $('.pxl-mega-menu').closest("li.pxl-megamenu").css('position', 'static');    
                $('.pxl-mega-menu').closest(".elementor-widget").css('position', 'static');    
                $('.pxl-mega-menu').closest(".elementor-container").css('position', 'static');    
                $('.pxl-mega-menu').closest(".elementor-widget-wrap").css('position', 'static');    
                $('.pxl-mega-menu').closest(".elementor-column").css('position', 'static');
            }
        }
    }

    function donalfarm_nice_select(){
        $('select.nice-select').niceSelect();
        $('select.wpcf7-select').niceSelect();
        $('.pxl-toolbar-ordering select').niceSelect();
        $('.variations_form .variations .att-type-select select').niceSelect();
    }
 
    function donalfarm_scroll_to_top() {
        if (scroll_top < window_height) {
            $('.pxl-scroll-top').addClass('off').removeClass('on');
        }
        if (scroll_top > window_height) {
            $('.pxl-scroll-top').addClass('on').removeClass('off');
        }
    }
    
    function donalfarm_adjust_hidden_sidebar_custom_offset(){
        if($('.pxl-hidden-template.pos-custom').length <= 0) return;
        if (scroll_top > 200) {
            $('.pxl-hidden-template.pos-custom').css('top', '100px');
        }else{
            $('.pxl-hidden-template.pos-custom').css('top', 'var(--hd-top-offset)');   
            if( window_width < 1200){
                $('.pxl-hidden-template.pos-custom').css('top', 'var(--hd-top-offset-mobile)');
            }
        }
    }

    function donalfarm_footer_fixed() {
        if($('.footer-fixed').length <= 0) return;
        setTimeout(function(){
            var h_footer = $('.pxl-footer-fixed').outerHeight() - 1;
            $('.footer-fixed .pxl-main').css('margin-bottom', h_footer + 'px');
        }, 600);
    }
     
    function donalfarm_light_gallery(){
        if ( $.fn.lightGallery && $('.pxl-light-gallery').length > 0){
            $('.pxl-light-gallery').lightGallery( {
                selector: '.zoom-light',
                mode: 'lg-fade',
                share: main_data.lg_share === 'on',
                zoom: main_data.lg_zoom === 'on',
                fullScreen: main_data.lg_full_screen === 'on',
                download: main_data.lg_download === 'on',
                autoplay: main_data.lg_auto_play === 'on',
                thumbnail: main_data.lg_thumbnail === 'on',
                hash: false,
                animateThumb: false,
                showThumbByDefault: false,
                getCaptionFromTitleOrAlt: false
            });
        }
    }
    function pxl_esc_js(str){
        return String(str).replace(/[^\w. ]/gi, function(c){
            return '&#'+c.charCodeAt(0)+';';
        });
    }

    // shop loop
    function donalfarm_shop_loop_handler(){
        $('.pxl-view-layout').on( 'click', 'a', function(e) {
            e.preventDefault();
            if(!$(this).parent('li').hasClass('active')){
                $('.pxl-view-layout .view-icon').removeClass('active');  
                $(this).parent('li').addClass('active');
                var data_cls = $(this).attr('data-cls');
                $(this).closest('.pxl-shop-loop-wrap').find('.pxl-grid-inner').attr('class',data_cls);
                $(this).closest('.pxl-product-grid').find('.pxl-grid-inner').attr('class',data_cls);
                $( document.body ).trigger( 'pxl_view_layout_click' );
            }
           
        } ); 
    }

    function donalfarm_mini_cart_body_caculate_height(){
        if( $('.pxl-hidden-template-canvas-cart').length > 0){
            var window_height = window.innerHeight;
            var $canvas_cart  = $('.pxl-hidden-template-canvas-cart');
            var $cart_header  = $canvas_cart.find( '.pxl-panel-header' );
            var $cart_content = $canvas_cart.find( '.pxl-panel-content' );
            var $cart_footer  = $canvas_cart.find( '.pxl-panel-footer' );
            
            var admin_bar_h = $('#wpadminbar').length > 0 ? $('#wpadminbar').height() : 0;
            var content_h = window_height - $cart_header.outerHeight() - $cart_footer.outerHeight() - admin_bar_h;
            content_h = Math.max( content_h, 400 );
            $cart_content.outerHeight( content_h );
        }
    } 
    
    // single product
    function donalfarm_single_product_handler(){
        if ( $.fn.lightGallery && $('.pxl-light-gallery').length > 0){
            $('.pxl-light-gallery .product-main-img-inner').lightGallery( {
                selector: '.zoom',
                mode: 'lg-fade',
                share: main_data.lg_share === 'on',
                zoom: main_data.lg_zoom === 'on',
                fullScreen: main_data.lg_full_screen === 'on',
                download: main_data.lg_download === 'on',
                autoplay: main_data.lg_auto_play === 'on',
                thumbnail: main_data.lg_thumbnail === 'on',
                hash: false,
                animateThumb: false,
                showThumbByDefault: false,
                getCaptionFromTitleOrAlt: false
            });
        }

        $(".zoom-hover").on("mousemove", function(e) {
            donalfarm_image_zoom(e);
        });

        $(document).on('click','.pxl-wc-tabs .tab-link-item',function (e) {
            e.preventDefault();
            e.stopPropagation();
             
            var $tab_item = $(this).closest('.tab-item');
            if( $tab_item.hasClass('active')) return false;
            var target = $(this).attr('data-taget');

            $tab_item.siblings('.tab-item').removeClass('active');
            $tab_item.toggleClass('active');
            $(target).siblings('.wc-tabs-panel').removeClass('active')
            $(target).toggleClass('active');
        });

         
        $(document).on( 'click', 'a.woocommerce-review-link', function( e ) {
            e.preventDefault();
            var $review_tab = $( 'a.tab-link-item[href="#tab-reviews"]' );
            if ( $review_tab.length > 0 ) {
                $( 'html, body' ).animate( { scrollTop: $review_tab.offset().top - 50 }, 300 ); 
            }
            $review_tab.trigger('click');
            return true;
        } );

        $( document ).on( 'click', '.checkout-login-btn-toggle', function( e ) {
            e.preventDefault();
            e.stopPropagation();
            var target = $(this).attr('data-target');
            $(target).toggleClass('open');
             
        });

        $(document).on('woocommerce_update_variation_values', function(e) {
            if ($(e['target']).closest('.variations_form.cart').length){
                if (typeof wpcvs !== 'undefined') {
                    wpcvs.Swatches.init();
                }
            }
        });

        $form = $('form.variations_form.cart');
        
        if ($form.length) { 
            $form.on('wc_variation_form', function (event, variationForm) {
                VariationFormObj = variationForm;
               
                var windoww = window_width; 
                donalfarm_update_variation_image_value(window_width);
            });
        }
        $(document).on('wpcvs_select', function() {
            donalfarm_update_variation_image_value(window_width);
        });
            
    }   

    function donalfarm_update_variation_image_value(window_w){
        
        if( typeof window_width === 'undefined') 
            window_width = $(window).width();

        var chosenAttributes = VariationFormObj.getChosenAttributes();
         
        if (chosenAttributes.count < 1 || chosenAttributes.chosenCount < 1) {
            return;
        }
         
        var res = VariationFormObj.findMatchingVariations(VariationFormObj.variationData, chosenAttributes.data);
        
        if (res.length > 0 && chosenAttributes.chosenCount > 0 && chosenAttributes.chosenCount <= chosenAttributes.count) {
           
            if (res.length > 0) {
                var variation = res[0];  
                var $product          = $form.closest( '.section-image-summary' ),
                    $main_img_wrap    = $product.find( '.product-main-img' ),
                    $gallery_nav      = $product.find( '.product-gallery-img' ),
                    $slider_main      = $main_img_wrap.find( '.pxl-swiper-container' ),
                    $slider_nav       = $gallery_nav.find( '.swiper-container-thumbs' ),
                    $gallery_img      = $gallery_nav.find( '.pxl-swiper-slide:eq(0) img' ),
                    $main_img_item    = $main_img_wrap.find( '.product-main-img-item' ),
                    $main_img         = $main_img_item.find( '.main-img-item' ),
                    $sticky_wrapper   = $product.find( '.pxl-img-sticky-wrapper' ),
                    $img_list_wrapper = $product.find( '.pxl-img-list-wrapper' ),
                    $img_grid_wrapper = $product.find( '.pxl-img-grid-wrapper' );
                     

                if ( variation && variation.image && variation.image.src && variation.image.src.length > 1 && $slider_main.length > 0) {
                    var main_img_had_changed = $main_img_wrap.find( '.pxl-swiper-slide[data-o_data-image-id="' + variation.image_id + '"]' ).length > 0;
                    if ( main_img_had_changed ) {
                        $main_img_item.wc_reset_variation_attr( 'data-image-id', );
                        $main_img_item.wc_reset_variation_attr( 'data-src' );
                        $main_img_item.find('.zoom-hover').wc_reset_variation_attr( "style" );
                        $main_img.wc_reset_variation_attr( 'src' );
                        $main_img.wc_reset_variation_attr( 'data-src' );
                    }
                
                    var slideToImage = $gallery_nav.find( '.pxl-swiper-slide[data-image-id="' + variation.image_id + '"]' );

                    if ( slideToImage.length > 0 ) {
                        if ( $slider_nav.length > 0 ) {  
                            var slideIndex = 0;
                            if ( $slider_nav[ 0 ].swiper.params.loop ) {
                                slideIndex = slideToImage.data( 'swiper-slide-index' ); 
                                $slider_nav[ 0 ].swiper.slideToLoop( slideIndex )
                                $slider_main[ 0 ].swiper.slideToLoop( slideIndex );
                            } else {
                                slideIndex = slideToImage.index();
                                $slider_nav[ 0 ].swiper.slideTo( slideIndex );
                                $slider_main[ 0 ].swiper.slideTo( slideIndex );
                            }
                            
                        }

                        $form.attr( 'current-image', variation.image_id );
                    }else{  
                        $main_img_item.wc_set_variation_attr( 'data-image-id', variation.image_id );
                        $main_img_item.wc_set_variation_attr( 'data-src', variation.image.full_src );
                        $main_img_item.find('.zoom-hover').wc_set_variation_attr( "style", "--zoom-bg-img: url('"+variation.image.full_src+"')" );
                        $main_img.wc_set_variation_attr( 'src', variation.image.src );
                        $main_img.wc_set_variation_attr( 'data-src', variation.image.src );
                         
                        if ( $slider_main[ 0 ].swiper.params.loop ) {
                            $slider_main[ 0 ].swiper.slideToLoop( 0 );
                        } else {
                            $slider_main[ 0 ].swiper.slideTo( 0 );
                        }
                         
                    } 
                } 
 
            }
        }
    } 
    function donalfarm_single_product_add_to_cart_ajax_handler(){
        if ( typeof wc_add_to_cart_params === 'undefined' ) {
            return false;
        }
        $( document ).on( 'click', 'form.cart .ajax_add_to_cart', function( e ) {
            e.preventDefault();
            var $this_button = $( this );

            if ( $this_button.hasClass( 'disabled' ) ) {  
                return false;
            }
            

            var $variations_form = $this_button.closest( 'form.cart' ),
                p_id       = $variations_form.find( '[name=add-to-cart]' ).val(),
                var_id     = $variations_form.find( 'input[name=variation_id]' ).val(),
                quantity        = $variations_form.find( '.quantity .qty[name=quantity]' ).val();

            if ( 'add-to-cart' === $this_button.attr( 'name' ) || 'buy-now' === $this_button.attr( 'name' ) ) {
                p_id = $this_button.val();
            }
              
            if ( 0 === p_id ) {
                return;
            }
            var data = {
                product_id: p_id,
                variation_id: var_id,
            };

            $variations_form.serializeArray().map( function( attr ) {
                if ( attr.name !== 'add-to-cart' ) {
                    if ( attr.name.endsWith( '[]' ) ) {
                        let name = attr.name.substring( 0, attr.name.length - 2 );
                        if ( ! (
                            name in data
                        ) ) {
                            data[name] = [];
                        }
                        data[name].push( attr.value );
                    } else {
                        data[attr.name] = attr.value;
                    }
                }
            } );

            if ( $this_button.attr( 'data-qty' ) ) {
                quantity = parseInt( $this_button.attr( 'data-qty' ) );
            }
            data.quantity = quantity;
  
            $this_button.removeClass( 'added' ).addClass( 'loading' );
            $( document.body ).trigger( 'adding_to_cart', [ $this_button, data ] );
             
            var ajaxurl = main_data.pxl_ajax_url.toString().replace( '%%endpoint%%', 'pxl_add_to_cart_variable' );
             
            $.post( ajaxurl, data, function( response ) {  
                 
                if ( ! response ) {
                    return;
                }

                if ( response.error && response.product_url ) {
                    window.location = response.product_url;
                    return;
                }

                // Redirect to checkout for Buy Now button.
                var redirect = $this_button.data( 'redirect' );

                if ( redirect && '' !== redirect ) {
                    window.location = redirect;
                    return;
                }

                // Redirect to cart option.
                if ( wc_add_to_cart_params.cart_redirect_after_add === 'yes' ) {
                    window.location = wc_add_to_cart_params.cart_url;
                    return;
                }

                // Trigger event so themes can refresh other areas.
                $( document.body ).trigger( 'added_to_cart', [
                    response.fragments, response.cart_hash, $this_button
                ] );

            } ).always( function() { 
                $this_button.addClass( 'added' ).removeClass( 'loading' );
            } );
        } );
        
    } 
    function donalfarm_image_zoom(e){
        var x, y;
        var zoomer = e.currentTarget;
        var offsetX = 0, offsetY = 0;
        if(e.offsetX) {
            offsetX = e.offsetX;
        } 

        if(e.offsetY) {
            offsetY = e.offsetY;
        }  
        x = offsetX/zoomer.offsetWidth*100;
        y = offsetY/zoomer.offsetHeight*100;
        zoomer.style.backgroundPosition = x+'% '+y+'%';
    } 

    // cart js
    function donalfarm_cart_handler(){
        if ( typeof wc_add_to_cart_params === 'undefined' )
            return false;

        $( document ).on( 'click', '.js-remove-from-cart', function( e ) { //remove-from-cart-js
            $(this).closest('.pxl-hidden-template-canvas-cart').addClass('loading');
            $(this).closest('.pxl-cart-dropdown').addClass('loading');
        });

        $(document.body).on( 'added_to_cart', function( evt, fragments, cart_hash, $button ) {
            $('.pxl-hidden-template-canvas-cart').toggleClass('open');
            $('.pxl-page-overlay').toggleClass('active');
            $('body').toggleClass('overflow');
            donalfarm_mini_cart_body_caculate_height();
        } );

        $(document).on('click','.quantity .quantity-button',function () {
            var $this = $(this),
                spinner = $this.closest('.quantity'),
                input = spinner.find('input[type="number"]'),
                step = input.attr('step'),
                min = input.attr('min'),
                max = input.attr('max'),value = parseInt(input.val());
            if(!value) value = 0;
            if(!step) step=1;
            step = parseInt(step);
            if (!min) min = 0;
            var type = $this.hasClass('quantity-up') ? 'up' : 'down' ;
            switch (type)
            {
                case 'up':
                    if(!(max && value >= max))
                        input.val(value+step).change();
                    break;
                case 'down':
                    if (value > min)
                        input.val(value-step).change();
                    break;
            }
            if(max && (parseInt(input.val()) > max))
                input.val(max).change();
            if(parseInt(input.val()) < min)
                input.val(min).change();
        });
    }
    function donalfarm_mini_cart_dropdown_offset(){
        if( $( '.pxl-cart-dropdown' ).length > 0 ){
            var window_w = $(window).width();
            
            $( '.pxl-cart-dropdown' ).each(function(index, el) {
                var anchor_cart_offset_right = $(this).closest('.pxl-anchor-cart').offset().left;
                if ( ($(this).offset().left + $(this).width() ) > window_w) {
                    var right_offset = window_w - (anchor_cart_offset_right + $(this).closest('.pxl-anchor-cart').width()) - 15;
                    $(this).css('right', (right_offset * -1));
                }
            });
             
        }
    }

    function donalfarm_update_cart_quantity(){     
        $('.pxl-hidden-template-canvas-cart').on( 'change', '.qty', function() {
            var item_key = $( this ).attr( 'name' );
            var item_qty = $( this ).val(); 

            var data = {
                action: 'donalfarm_update_product_quantity',
                cart_item_key: item_key,
                cart_item_qty: item_qty,
                security: main_data.nonce,
            };

            $.ajax( {
                url: main_data.ajaxurl,
                type: 'POST',
                cache: false,
                dataType: 'json',
                data: data,
                success: function( response ) {
                    $( document.body ).trigger( 'wc_fragment_refresh' );
                },
                beforeSend: function() {
                    $('body').find('.pxl-hidden-template-canvas-cart').addClass('loading'); 
                },
                complete: function() {}
            } );
        } );

        $('.cart-list-wrapper').on( 'change', '.qty', function() {
             
            var item_key = $( this ).attr( 'name' );
            var item_qty = $( this ).val(); 
 
            var data = {
                action: 'donalfarm_update_product_quantity',
                cart_item_key: item_key,
                cart_item_qty: item_qty,
                security: main_data.nonce,
            };
            $.ajax( {
                url: main_data.ajaxurl,
                type: 'POST',
                cache: false,
                dataType: 'json',
                data: data,
                success: function( response ) {  
                    $( document.body ).trigger( 'wc_fragment_refresh' );
                },
                beforeSend: function() {
                    $('body').addClass('loading');
                },
                complete: function() {}
            } );
        } );
    }

})(jQuery);
 