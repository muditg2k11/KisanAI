(function ($) {

    function donalfarm_add_param_to_url(url, key, val) {
        key = encodeURI(key);
        val = encodeURI(val);

        if ('' !== val) {
            var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
            var separator = url.indexOf('?') !== - 1 ? "&" : "?";

            // Update value if key exist.
            if (url.match(re)) {
                url = url.replace(re, '$1' + key + "=" + val + '$2');
            } else {
                url += separator + key + '=' + val;
            }
        } else {
            donalfarm_remove_param_from_url(url, key);
        }

        return url;
    }

    function donalfarm_remove_param_from_url(url, key) {
        const params = new URLSearchParams(url);
        params.delete(key);
        return url;
    }

    function donalfarm_cound_down_handler($scope) {
        if ($scope.find('.pxl-countdown-container').length > 0) {
            var $this = $scope.find('.pxl-countdown-container');
            var timeout = $this.data('time');

            if (timeout == '') {
                var current = new Date();
                var end = new Date(current.getTime() + (71 * 24 * 60 * 60 * 1000));
            } else {
                var end = new Date(timeout);
            }

            var _second = 1000;
            var _minute = _second * 60;
            var _hour = _minute * 60;
            var _day = _hour * 24;
            var timer = setInterval(function () {
                var now = new Date();
                var distance = end - now;
                if (distance > 0) {
                    var days = Math.floor(distance / _day);
                    var hours = Math.floor((distance % _day) / _hour);
                    var minutes = Math.floor((distance % _hour) / _minute);
                    var seconds = Math.floor((distance % _minute) / _second);
                    $this.find('.day').html(days < 10 ? '0' + days : days);
                    $this.find('.hour').html(hours < 10 ? '0' + hours : hours);
                    $this.find('.minute').html(minutes < 10 ? '0' + minutes : minutes);
                    $this.find('.second').html(seconds < 10 ? '0' + seconds : seconds);
                    return;
                }
                clearInterval(timer);
            }, 1000);
        }
    }

    function donalfarm_accordion_handler($scope) {
        $scope.find(".pxl-accordion .ac-title").on("click", function (e) {
            e.preventDefault();

            var target = $(this).closest('.ac-item').data("target");
            var parent = $(this).closest(".pxl-accordion");
            var active_items = parent.find(".ac-item.active");
            $.each(active_items, function (index, item) {
                var item_target = $(item).data("target");
                if (item_target != target) {
                    $(item).removeClass("active");
                    $(item_target).slideUp(400);
                }
            });
            $(this).closest('.ac-item').toggleClass("active");
            $(target).slideToggle(400);
        });
    }

    function donalfarm_gallery_handler($scope) {
        var $grid_isotope = null;
        var layout_mode = $scope.find('.pxl-gallery-grid').attr('data-layout-mode');
        if ($(window).outerWidth() < 992) {
            layout_mode = 'masonry';
        }
        var isoOptions = {
            itemSelector: '.grid-item',
            layoutMode: layout_mode,
            fitRows: {
                gutter: 0
            },
            percentPosition: true,
            masonry: {
                columnWidth: '.grid-sizer',
            },
            containerStyle: null,
            stagger: 30,
            sortBy: 'name',
        };
        $scope.find('.pxl-gallery-grid .pxl-grid-masonry').imagesLoaded(function () {
            if ($(document).find('.elementor-editor-active').length > 0) {
                let oldHTMLElement = HTMLElement;
                window.HTMLElement = window.parent.HTMLElement;
                $scope.find('.pxl-grid-masonry').isotope(isoOptions);
                window.HTMLElement = oldHTMLElement;
            } else {
                $grid_isotope = $scope.find('.pxl-grid-masonry').isotope(isoOptions);
            }
        });

        var galleries = $scope.find(".pxl-gallery-grid"),
            data_show = galleries.data('show'),
            data_load = galleries.data('loadmore');
        galleries.find(".grid-item").slice(0, data_show).removeClass('hide').show();

        galleries.find('.pxl-gallery-load').on('click', function (e) { // click event for load more
            e.preventDefault();
            var pos_bottom = $('.load-more-wrap').offset().top;
            galleries.find(".grid-item:hidden").slice(0, data_load).removeClass('hide').show(); // select next 10 hidden divs and show them
            if (galleries.find(".grid-item:hidden").length == 0) { // check if any hidden divs still exist
                $(this).closest('.load-more-wrap').hide();
            }

            $('html, body').stop().animate({ scrollTop: pos_bottom - 200 }, 1000);
            setTimeout(function () {
                $grid_isotope.isotope('destroy');
                $grid_isotope.isotope(isoOptions);
            }, 100);

        });

        $scope.find('.pxl-gallery-grid').on('click', '.grid-filter-wrap .filter-item', function (e) {
            var $this = $(this);
            var term_slug = $this.attr('data-filter');
            $this.siblings('.filter-item.active').removeClass('active');
            $this.addClass('active');
            $scope.find('.pxl-grid-masonry').isotope({ filter: term_slug });
            if (term_slug != '*') {
                $scope.find('.load-more-wrap').hide();
            } else {
                if (galleries.find(".grid-item:hidden").length > 0)
                    $scope.find('.load-more-wrap').show();
            }
        });
    };

    function donalfarm_contact_form_handler($scope) {
        $scope.find('.pxl-date-field').datepicker({
            minDate: new Date(),
            altFormat: 'M',
            firstDay: 0,
            dateFormat: 'mm/dd/yy',
            numberOfMonths: 1,
        });

        $scope.find('.pxl-time-picker').each(function (index, el) {
            $(this).timepicker({
                timeFormat: 'h:mm p',
                interval: 30,
                dynamic: false,
                dropdown: true,
                scrollbar: true
            });
        });

    }

    function donalfarm_tabs_handler($scope) {
        $scope.find(".pxl-tabs .tabs-title .tab-title").on("click", function (e) {
            e.preventDefault();
            var target = $(this).data("target");
            $(this).addClass('active').siblings().removeClass('active');
            $(target).addClass('active').siblings().removeClass('active');

            $(target).siblings().find('.pxl-animate').each(function () {
                var data = $(this).data('settings');
                $(this).removeClass('animated ' + data['animation']).addClass('pxl-invisible');
            });
            $(target).find('.pxl-animate').each(function () {
                var data = $(this).data('settings');
                var cur_anm = $(this);
                setTimeout(function () {
                    $(cur_anm).removeClass('pxl-invisible').addClass('animated ' + data['animation']);
                }, data['animation_delay']);

            });
        });

        $scope.find(".pxl-tabs .tabs-content .tab-title-ct").on("click", function (e) {
            e.preventDefault();
            var target = $(this).closest('.tab-content').attr("id");
            $(this).closest('.pxl-tabs').find('.tab-title').each(function (index, el) {
                var this_target = $(el).data('target');
                if (this_target == '#' + target) {
                    $(el).addClass('active');
                } else {
                    $(el).removeClass('active');
                }
            });

            if ($(this).closest('.tab-content').hasClass('active')) {
                $(this).closest('.tab-content').removeClass("active");
                $(this).next('.content-inner').slideUp(400);
            } else {
                $(this).closest('.tab-content').siblings('.active').removeClass("active").find('.content-inner').slideUp(400);
                $(this).closest('.tab-content').addClass("active");
                $(this).next('.content-inner').slideDown(400);
            }

        });
    }

    function donalfarm_progressbar_handler($scope) {
        elementorFrontend.waypoint($scope.find('.pxl-progress-bar'), function () {
            var $this = $(this);
            var goal = $this.data('valuetransitiongoal');
            if (goal) {
                $this.css('width', goal + '%');
            }
            if (typeof $this.progressbar === 'function') {
                $this.progressbar();
            }
        });
    }

    // Make sure you run this code under Elementor.
    $(window).on('elementor/frontend/init', function () {

        elementorFrontend.hooks.addAction('frontend/element_ready/pxl_countdown.default', function ($scope) {
            donalfarm_cound_down_handler($scope);
        });
        elementorFrontend.hooks.addAction('frontend/element_ready/pxl_accordion.default', function ($scope) {
            donalfarm_accordion_handler($scope);
        });
        elementorFrontend.hooks.addAction('frontend/element_ready/pxl_galleries.default', function ($scope) {
            donalfarm_gallery_handler($scope);
        });
        elementorFrontend.hooks.addAction('frontend/element_ready/pxl_contact_form.default', function ($scope) {
            donalfarm_contact_form_handler($scope);
        });
        elementorFrontend.hooks.addAction('frontend/element_ready/pxl_tabs.default', function ($scope) {
            donalfarm_tabs_handler($scope);
        });
        elementorFrontend.hooks.addAction('frontend/element_ready/pxl_progressbar.default', function ($scope) {
            donalfarm_progressbar_handler($scope);
        });
    });

})(jQuery);