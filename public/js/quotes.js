(function () {
    toggleQuotes()
    setInterval(toggleQuotes, 3000)

})()

var toggle = true;
function toggleQuotes() {
    $('.columns[category="inspire"]').toggle(toggle).slideDown({duration: 800, easing: 'swing'})
    $('.columns[category="funny"]').toggle(toggle).slideUp({duration: 800, easing: 'swing'})

    toggle = !toggle
}