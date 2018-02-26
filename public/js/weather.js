(function () {
    
    
    var skycons = new Skycons({ "color": "green" });
    // on Android, a nasty hack is needed: {"resizeClear": true}
    // you can add a canvas by it's ID...
    
    skycons.add("icon_current", $('#icon_current').attr("class"))
    $.each($('.skycon > canvas'), function(index, element){
        var elementId = `icon_day${index}`;
        console.log(elementId)
        skycons.add(elementId, $('#' + elementId).attr("class"))        
    })
    
    // start animation!
    skycons.play();
})()