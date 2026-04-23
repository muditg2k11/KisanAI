( function( $ ) {
    $( window ).on( 'elementor/frontend/init', function() {
        $('.pxl-grid').each(function(index, element) { 
            var $grid_scope = $(this);
            if( $grid_scope.hasClass('pxl-post-list')){
                var isoOptions = {};
                var $grid_isotope = null;
            }else{
                var $grid_masonry = $grid_scope.find('.pxl-grid-masonry');
                var isoOptions = {
                    itemSelector: '.grid-item',
                    layoutMode: $grid_scope.attr('data-layout-mode'),   
                    fitRows: {
                        gutter: 0
                    },
                    percentPosition: true,
                    masonry: {
                        columnWidth: '.grid-sizer',
                    },
                    containerStyle: null,
                    stagger: 30,
                    sortBy : 'name',
                };
                
                var $grid_isotope = $grid_masonry.isotope(isoOptions);
                 
                $grid_scope.on('click', '.grid-filter-wrap .filter-item', function(e) {
                    
                    var $this = $(this);
                    var term_slug = $this.attr('data-filter');  
                    
                    $this.siblings('.filter-item.active').removeClass('active');
                    $this.addClass('active'); 
                    $grid_scope.find('.item-inner-wrap').removeClass('animated');

                    if( $this.closest('.grid-filter-wrap').hasClass('ajax') ){
                        var loadmore = $grid_scope.data('loadmore');
                        loadmore.term_slug = term_slug;
                        donalfarm_grid_ajax_handler( $this, $grid_scope, $grid_isotope, 
                            { action: 'donalfarm_load_more_post_grid', loadmore: loadmore, iso_options: isoOptions, handler_click: 'filter', scrolltop: 0, wpnonce: grid_data.wpnonce }
                        );
                    }else{
                        $grid_isotope.isotope({ filter: term_slug });
                      
                        if( $grid_scope.find('.item-inner-wrap').hasClass('pxl-animate') ){
                            var $animate_el = $grid_scope.find('.item-inner-wrap'),
                                data = $animate_el.data('settings');  
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
                    }
                });
            }
            $grid_scope.on('click', '.pxl-grid-pagination .ajax a.page-numbers', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var $this = $(this);
                var loadmore = $grid_scope.data('loadmore');
                var paged = $this.attr('href');
                paged = paged.replace('#', '');
                loadmore.paged = parseInt(paged);
                 
                donalfarm_grid_ajax_handler( $this, $grid_scope, $grid_isotope, 
                    { action: 'donalfarm_load_more_post_grid', loadmore: loadmore, iso_options: isoOptions, handler_click: 'pagination', scrolltop: 1, wpnonce: grid_data.wpnonce }
                );
            });

            $grid_scope.on('click', '.btn-grid-loadmore', function(e) {
                e.preventDefault();
                var $this = $(this);
                var loadmore = $grid_scope.data('loadmore');
                loadmore.paged = parseInt($grid_scope.data('start-page')) + 1; 
                donalfarm_grid_ajax_handler( $this, $grid_scope, $grid_isotope, 
                    { action: 'donalfarm_load_more_post_grid', loadmore: loadmore, iso_options: isoOptions, handler_click: 'loadmore', scrolltop: 0, wpnonce: grid_data.wpnonce }
                );
            });
            $grid_scope.on('change', '.orderby', function(e) {
                e.preventDefault();
                var $this = $(this);
                var loadmore = $grid_scope.data('loadmore');
                loadmore.orderby = $this.val(); 
                 
                donalfarm_grid_ajax_handler( $this, $grid_scope, $grid_isotope, 
                    { action: 'donalfarm_load_more_post_grid', loadmore: loadmore, iso_options: isoOptions, handler_click: 'select_orderby', scrolltop: 0, wpnonce: grid_data.wpnonce }
                );
            });
        });

        function donalfarm_grid_ajax_handler($this, $grid_scope, $grid_isotope, args = {}){
            var settings = $.extend( true, {}, {
                action: '',
                loadmore: '',
                iso_options: {},
                handler_click: '',
                scrolltop: 0,
                wpnonce: ''
            }, args );


            var offset_top = $grid_scope.offset().top; 

            if( settings.handler_click == 'loadmore' ){
                var loadmore_text  = $this.closest('.pxl-load-more').data('loadmore-text');
                var loading_text  = $this.closest('.pxl-load-more').data('loading-text');
                var curoffsettop = $this.offset().top;
            }
             
            $.ajax({
                url: grid_data.ajax_url,
                type: 'POST',
                data: {
                    action: settings.action,
                    settings: settings.loadmore,
                    handler_click: settings.handler_click,
                    wpnonce: settings.wpnonce
                },
                success: function( res ) {   
                     
                    if(res.status == true){  

                        if( settings.handler_click == 'loadmore' ){
                            if( settings.loadmore.wg_type == 'post-list'){
                                $grid_scope.find('.pxl-list-inner').append(res.data.html)
                            }else{
                                $grid_scope.find('.pxl-grid-inner').append(res.data.html)
                            }
                        }else{
                            if( settings.loadmore.wg_type == 'post-list'){
                                $grid_scope.find('.pxl-list-inner .list-item').remove();
                                $grid_scope.find('.pxl-list-inner').append(res.data.html);
                            }else{
                                $grid_scope.find('.pxl-grid-inner .grid-item').remove();
                                $grid_scope.find('.pxl-grid-inner').append(res.data.html);
                            }
                        }
                         
                        if( settings.iso_options && $grid_isotope != null){
                            $grid_isotope.isotope('destroy');
                            $grid_isotope.isotope(settings.iso_options);
                        }

                        if( $grid_scope.find('.pxl-animate').length > 0 ){
                            $grid_scope.find('.pxl-animate').each(function(){
                                var $animate_el = $(this); 
                                elementorFrontend.waypoint($animate_el, function () {
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
                            });
                        } 

                        $grid_scope.data('start-page', res.data.paged);
 
                        if( settings.loadmore['pagination_type'] == 'loadmore'){
                            if(res.data.paged >= res.data.max){
                                $grid_scope.find('.pxl-load-more').hide();
                            }else{
                                $grid_scope.find('.pxl-load-more').show();
                            } 
                        } 
                        if( settings.loadmore['pagination_type'] == 'pagination'){
                            $grid_scope.find(".pxl-grid-pagination").html(res.data.pagin_html);
                        }

                        if( $grid_scope.find('.result-count').length > 0 ){
                            $grid_scope.find(".result-count").html(res.data.result_count);
                        }
                    }      
                },
                beforeSend: function() {  
                    if( settings.handler_click == 'loadmore' ){
                        $this.removeClass( 'loaded' ).addClass( 'loading' );
                        $this.find('.btn-text').text(loading_text);
                    }else{
                        $( 'body' ).removeClass( 'loaded' ).addClass( 'loading' );
                    }
                },
                complete: function() {
                    if( settings.handler_click == 'loadmore' ){
                        $this.removeClass( 'loading' ).addClass( 'loaded' );
                        $this.find('.btn-text').text(loadmore_text);
                        $( 'html, body' ).animate( { scrollTop: curoffsettop - 200 }, 0 );
                    }else{
                        $( 'body' ).removeClass( 'loading' ).addClass( 'loaded' );
                        if ( settings.scrolltop ) {
                            $( 'html, body' ).animate( { scrollTop: offset_top - 100 }, 0 );
                        }
                    }
                     
                }
            });
        }
    });
     
} )( jQuery );