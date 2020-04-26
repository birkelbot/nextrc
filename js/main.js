(function($) {

  "use strict";

  $(function() {
    // Remove the spinner when the page is loaded.
    $(window).on('load', function() {
      if ($('.spinner')) {
        $('.spinner').removeClass('show');
      }
    })

    // Adjust height of the home section to fit the viewport.
    $('.home').css('height', $(window).height() - $('.navbar').height() - $('.home').next().height());
    $(window).resize(function(){
      $('.js-fullheight').css('height', $(window).height());
    });

    // Set up content waypoint animations.
    $('.animate').waypoint(function(direction) {

      if (direction === 'down' && !$(this.element).hasClass('animated')) {
        $(this.element).addClass('item-animate');

        setTimeout(function() {
          $('body .animate.item-animate').each(function(k) {
            var el = $(this);
            setTimeout(function () {
              var effect = el.data('animate-effect');
              if ( effect === 'fadeIn') {
                el.addClass('fadeIn animated');
              } else if ( effect === 'fadeInLeft') {
                el.addClass('fadeInLeft animated');
              } else if ( effect === 'fadeInRight') {
                el.addClass('fadeInRight animated');
              } else {
                el.addClass('fadeInUp animated');
              }
              el.removeClass('item-animate');
            },  k * 50);
          });
        }, 100);
      }

    }, {offset: '95%'});
  });

})(jQuery);

