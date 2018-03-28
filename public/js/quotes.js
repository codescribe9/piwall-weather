(function () {
    $('.quotes').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 10000,
        arrows: false,
        infinite: true
      });

    //$('.columns[category="funny"]').toggle()
    //toggleQuotes()
    //setInterval(toggleQuotes, 3000)
    
})()

var toggle = true;
function toggleQuotes() {        
   if(toggle == true)
        $('.columns[category="funny"]').slideDown({duration: 800, easing: 'swing'})
    else
        $('.columns[category="inspire"]').slideDown({duration: 800, easing: 'swing'})

    toggle = !toggle
}