(function($) {
    skel.breakpoints({
        large: '(max-width: 1680px)',
        medium: '(max-width: 980px)',
        small: '(max-width: 736px)',
        xsmall: '(max-width: 480px)'
    });

    function createMainBGElement(section) {
        var $body = $('body'),
            $bg = section.find('.bg');

        // No background? Bail.
            if ($bg.length == 0) {
                return;
            }

        // Hack: IE8 fallback.
            if (skel.vars.IEVersion < 9) {
                section
                    .css('background-image', 'url("' + $bg.attr('src') + '")')
                    .css('-ms-behavior', 'url("css/ie/backgroundsize.min.htc")');

                return;
            }

        // Create main-bg (if not already created), and append it to body.
            var $mainBG = $body.find('#' + section.attr('id') + '-bg');
            if ($mainBG.length == 0) {
                $mainBG = $('<div class="main-bg" id="' + section.attr('id') + '-bg"></div>')
                    .css('background-image', (
                        'url("assets/css/images/overlay.png"), url("' + $bg.attr('src') + '")'
                    ))
                    .appendTo($body);
            }
    }

    function getBGScrollexOptions(section) {
        var $body = $('body'),
            $mainBG = $body.find('#' + section.attr('id') + '-bg'),
            options;

        // No main background? Bail.
            if ($mainBG.length == 0) {
                return;
            }

        // Scrollex.
            options = {
                mode: 'middle',
                delay: 200,
            };
            
            if (skel.canUse('transition')) {
                options.init = function() { $mainBG.removeClass('active'); };
                options.enter = function() { $mainBG.addClass('active'); };
                options.leave = function() { $mainBG.removeClass('active'); };
            } else {
                $mainBG
                    .css('opacity', 1)
                    .hide();

                options.init = function() { $mainBG.fadeOut(0); };
                options.enter = function() { $mainBG.fadeIn(400); };
                options.leave = function() { $mainBG.fadeOut(400); };
            }

            return options;
    }

    // Helper function to set the width of the box for the main title.
    function setTitleBoxWidth() {
        var minWidth = 600, // in px
            $containerWidth = $('.container').outerWidth();

        $('#title-box').width(Math.min(minWidth, $containerWidth));
    }

    // Helper function to set the height of the elements in a grid section.
    function setGridHeights() {
        $('.grid').each(function() {
            // Round up the heights of all the icons to the nearest whole pixel.
                $(this).find('.grid-icon').each(function() {
                    $(this).height('auto');
                    $(this).height(Math.round($(this).height()));
                });

            // Add margin to the images to make them all have equal height.
                var maxIconHeight = -1
                $(this).find('.grid-icon').each(function() {
                    maxIconHeight = maxIconHeight > $(this).height() ? maxIconHeight : $(this).height();
                });
                var minimumMargin = 10  // px
                $(this).find('.grid-icon').each(function() {
                    var newMargin = (maxIconHeight-$(this).height())/2.0 + minimumMargin;
                    $(this).css('margin-top', newMargin + 'px');
                    $(this).css('margin-bottom', newMargin + 'px');
                });

            // Adjust the height of the text blocks so they all have equal height.
                $(this).find('.grid-text').each(function() {
                    $(this).height('auto');
                });
                var maxTextHeight = -1
                $(this).find('.grid-text').each(function() {
                    maxTextHeight = maxTextHeight > $(this).height() ? maxTextHeight : $(this).height();
                });
                $(this).find('.grid-text').each(function() {
                    $(this).height(maxTextHeight);
                });

            // Adjust the height of the grid items to make sure they're all the same.
            // Sometimes, rounding in the margin calculations above cause the grid items
            // to be +/- 1 pixel, which breaks the rendering.
                $(this).find('li').each(function() {
                    $(this).height('auto');
                });
                var maxGridItemHeightWithPadding = -1
                $(this).find('li').each(function() {
                    thisHeightWithPadding = $(this).height() + parseInt($(this).css('padding-top')) + parseInt($(this).css('padding-bottom'));
                    maxGridItemHeightWithPadding = maxGridItemHeightWithPadding > thisHeightWithPadding ? maxGridItemHeightWithPadding : thisHeightWithPadding;
                })
                $(this).find('li').each(function() {
                    $(this).height(maxGridItemHeightWithPadding)
                })
        });
    }

    $(function() {
        var $window = $(window),
            $body = $('body'),
            $html = $('html');

        // Disable animations/transitions until the page has loaded.
            $html.addClass('is-loading');

            $window.on('load', function() {
                window.setTimeout(function() {
                    $html.removeClass('is-loading');
                }, 0);
            });

        // Touch mode.
            if (skel.vars.mobile) {
                var $wrapper;

                // Create wrapper.
                    $body.wrapInner('<div id="wrapper" />');
                    $wrapper = $('#wrapper');

                    // Hack: iOS vh bug.
                        if (skel.vars.os == 'ios')
                            $wrapper
                                .css('margin-top', -25)
                                .css('padding-bottom', 25);

                    // Pass scroll event to window.
                        $wrapper.on('scroll', function() {
                            $window.trigger('scroll');
                        });

                // Scrolly.
                    $window.on('load.hl_scrolly', function() {

                        $('.scrolly').scrolly({
                            speed: 1500,
                            parent: $wrapper,
                            pollOnce: true
                        });

                        $window.off('load.hl_scrolly');

                    });

                // Enable touch mode.
                    $html.addClass('is-touch');
            } else {
                // Scrolly.
                    $('.scrolly').scrolly({
                        speed: 1500
                    });
            }

        // Fix: Placeholder polyfill.
            $('form').placeholder();

        // Prioritize "important" elements on medium.
            skel.on('+medium -medium', function() {
                $.prioritize(
                    '.important\\28 medium\\29',
                    skel.breakpoint('medium').active
                );
            });

        // All sections.
            $('section').each(function() {
                var $this = $(this);
                createMainBGElement($this);
                if ($this.id != 'header') {
                    skel.on('-xsmall !xsmall', function() {
                        $this.unscrollex();
                        $this.scrollex(getBGScrollexOptions($this));
                    });

                    skel.on('+xsmall', function() {
                        $this.unscrollex();
                        var options = getBGScrollexOptions($this);
                        options.top = '-100px';
                        options.bottom = '-100px';
                        $this.scrollex(options);
                    });
                }
            });

        // Header.
            var $header = $('#header'),
                $headerTitle = $header.find('header'),
                $headerContainer = $header.find('.container');

            // Make title fixed on large desktop displays.
                if (!skel.vars.mobile) {
                    $window.on('load.hl_headerTitle', function() {

                        skel.on('-medium !medium', function() {
                            $headerTitle
                                .css('position', 'fixed')
                                .css('height', 'auto')
                                .css('top', '50%')
                                .css('left', '0')
                                .css('width', '100%')
                                .css('margin-top', ($headerTitle.outerHeight() / -2));
                        });

                        skel.on('+medium', function() {
                            $headerTitle
                                .css('position', '')
                                .css('height', '')
                                .css('top', '')
                                .css('left', '')
                                .css('width', '')
                                .css('margin-top', '');
                        });

                        $window.off('load.hl_headerTitle');
                    });
                }

            // Scrollex.
                skel.on('-small !small', function() {
                    $header.unscrollex();
                    var options = getBGScrollexOptions($header);
                    options.terminate = function() {    
                        $headerTitle.css('opacity', '');
                    };
                    options.scroll = function(progress) {
                        // Fade out title as user scrolls down.
                            if (progress > 0.5) {
                                x = 1 - progress;
                            } else {
                                x = progress;
                            }

                            $headerTitle.css('opacity', Math.max(0, Math.min(1, x * 2)));
                    };
                    $header.scrollex(options);
                });

                skel.on('+small', function() {
                    $header.unscrollex();
                    $header.scrollex(getBGScrollexOptions($header));
                });

            // Text Rotator.
                $('.rotate').each(function() {
                    var $this = $(this),
                        text = $this.html().split(',');
                    $this.html(text[0]);
                    var refreshIntervalId = window.setInterval(function() {
                        $this.animate(
                            {textShadowBlur: 20,
                             opacity: 0},
                            500,
                            function() {
                                index = $.inArray($this.html(), text)
                                if ((index + 2) == text.length) {
                                    clearInterval(refreshIntervalId);
                                    if ($this.attr('id') == 'main-title' ||
                                        $this.parent().attr('id') == 'main-title') {
                                        window.setTimeout(function() {
                                            var $mainTitle = $('#main-title');
                                            $mainTitle.animate(
                                                {textShadowBlur: 20,
                                                 opacity: 0},
                                                500,
                                                function() {
                                                    $mainTitle.html('<img id="be-next" src="images/be-next.png"/>').animate({
                                                        opacity: 1
                                                    }, 500);
                                                }
                                            );
                                        }, 2000);
                                    }
                                }
                                $this.text(text[index + 1]).animate({
                                    textShadowBlur: 0,
                                    opacity: 1
                                }, 500);
                            }
                        );
                    }, 2000);
                });

            // Title Box.
                setTitleBoxWidth();

        // NEXT Title.
            skel.on('+large -medium', function () {
                $('#next-title').attr('src', 'images/next-robotics-competition-wide-bold.png');
                $('#next-title').height('1.3em');
            });
            skel.on('-xsmall +small +medium -large', function () {
                $('#next-title').attr('src', 'images/next-robotics-competition-wide.png');
                $('#next-title').height('1.3em');
            });
            skel.on('+xsmall', function () {
                $('#next-title').attr('src', 'images/next-robotics-competition-medium.png');
                $('#next-title').height('3.2em');
            });

        // Set the height of the elements in "The Game" section.
            setGridHeights();
    });

    $(window).on('resize orientationChange', function(event) {
        setTitleBoxWidth();
        setGridHeights();
    });
})(jQuery);
