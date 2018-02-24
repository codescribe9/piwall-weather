(function () {
    $.get("http://localhost:3600/forecast", function (data) {
        if (data) {
            var currently = data.currently;
            var info = `<canvas id="icon_current" width="64" height="64"></canvas> ${currently.temp}˚ ${currently.summary}`
              //alternatively use &deg;C  for degree

            var parsedDate = moment(currently.time * 1000);
            var date = parsedDate.format('dddd MMMM Do YYYY hh:mm:ss a');
            var dayAndWeek = parsedDate.format('[(]DDD[th day) (]w[th week)]');
            info += `</br>${date}`
            
            $(".result").html(info)



            var skycons = new Skycons({ "color": "green" });
            // on Android, a nasty hack is needed: {"resizeClear": true}
            // you can add a canvas by it's ID...
            skycons.add("icon_current", currently.icon);
            // start animation!
            skycons.play();
        }

    });
})();