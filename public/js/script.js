var scroll = new SmoothScroll('a[href*="#"]');

$(window).scroll(function() {
    if ($(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
        $('#scroll-top').fadeIn(200);    // Fade in the arrow
    } else {
        $('#scroll-top').fadeOut(200);   // Else fade out the arrow
    }
});
