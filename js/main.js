(function($) {

  "use strict";

  $(function() {

    /****************************************/
    /***             ON LOAD              ***/
    /****************************************/

    $(window).on('load', function() {
      // Remove the spinner when the page is loaded.
      if ($('.spinner')) {
        $('.spinner').removeClass('show');
      }

      // Animate the home page elements.
      $('body .home-animate').each(function() {
        var el = $(this);
        var delay = el.data('animate-delay');
        setTimeout(function () {
          el.addClass('fadeInUp animated');
        },  delay);
      });
    });


    /****************************************/
    /***    DYNAMIC HOME SECTION HEIGHT   ***/
    /****************************************/

    // Adjust height of the home section to fit the viewport.
    $('.home').css('height', $(window).height() - $('.navbar').height() - $('.home').next().height());
    $(window).resize(function() {
      $('.js-fullheight').css('height', $(window).height());
    });


    /****************************************/
    /***        HIDE/SHOW NAV BAR         ***/
    /****************************************/

    var prevScrollPos = Math.ceil(window.pageYOffset);
    var forceHideNavBar = false;
    var unlockNavBarPos = null;
    var preventNavBarHiding = false;

    function hideNavBar() {
      if (!preventNavBarHiding) {
        $('.navbar').css('top', -$('.navbar').outerHeight());
      }
    }

    function showNavBar() {
      $('.navbar').css('top', 0);
    }

    function isAtSetpoint(setpoint, actualPosition) {
      if (setpoint - 1 <= actualPosition && actualPosition <= setpoint + 1) {
        return true;
      }
      return false;
    }

    $('.nav-link').click(function() {
      // We can't scroll below the bottom of the page.
      var scrollSetpoint = Math.ceil(Math.min($($(this).data('href')).offset().top,        // Position of target
                                              $(document).height() - $(window).height())); // Bottom of page
      if (!$('.navbar-toggler').hasClass('collapsed')) {
        // Since the nav bar will be automatically collapsed simulataneously while
        // scrolling, deduct height of the collapsible section of the nav bar, which
        // hasn't been collapsed yet, but is going to be by the time we finish scrolling.
        scrollSetpoint -= $('.navbar-collapse').height();

        // Automatically collapse the nav bar.
        $('.navbar-toggler').click();
      }

      // Hide the nav bar until reaching the target.
      forceHideNavBar = true;
      unlockNavBarPos = scrollSetpoint;

      window.scrollTo(0, scrollSetpoint);
    });

    // Prevent hiding the nav bar when the nav bar is expanded.
    $('.navbar-toggler').click(function() {
      if ($(this).hasClass('collapsed')) {
        preventNavBarHiding = true;
      } else {
        preventNavBarHiding = false;
      }
    });

    // Hide/show the nav bar when scrolling.
    window.onscroll = function() {
      var currentScrollPos = Math.ceil(window.pageYOffset);
      if (forceHideNavBar) {
        // Keep the nav bar hidden until reaching the unlock position.
        if (isAtSetpoint(unlockNavBarPos, currentScrollPos)) {
          forceHideNavBar = false;
        } else {
          hideNavBar();
        }
      } else {
        // After reaching the unlock position, don't actually unlock the nav bar
        // until the user scrolls away from the unlock position.
        if (unlockNavBarPos) {
          if (!isAtSetpoint(unlockNavBarPos, currentScrollPos)) {
            unlockNavBarPos = null;
          }
        }
        // The nav bar is unlocked. Behave as normal.
        else {
          if (currentScrollPos > prevScrollPos) {
            hideNavBar();
          } else if (currentScrollPos < prevScrollPos) {
            showNavBar();
          }
        }
      }
      prevScrollPos = currentScrollPos;
    };


    /****************************************/
    /***       WAYPOINT ANIMATIONS        ***/
    /****************************************/

    // Set up content waypoint animations.
    $('.animate').waypoint(function(direction) {

      if (direction === 'down' && !$(this.element).hasClass('animated')) {
        $(this.element).addClass('item-animate');

        setTimeout(function() {
          $('body .animate.item-animate').each(function(k) {
            var el = $(this);
            setTimeout(function () {
              el.addClass('fadeInUp animated');
              el.removeClass('item-animate');
            },  k * 50);
          });
        }, 100);
      }

    }, {offset: '95%'});
  });

})(jQuery);

