const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const express = require('express')
const _ = require('lodash')

const path = require("path")
const http = require("http")
const morgan = require("morgan")
const request = require('request')


var hbs = exphbs.create({
    extname: '.hbs', defaultLayout: 'layout',
    // Specify helpers which are only registered on this instance.
    helpers: {
        math: function (lvalue, operator, rvalue, options) {
            if (isNaN(lvalue)) {
                //todo return error: invalid input
            }

            if (isNaN(rvalue)) {
                //todo return error: invalid input
            }

            lvalue = parseFloat(lvalue);
            rvalue = parseFloat(rvalue);
            var result = 0;
            switch (operator) {
                case "+":
                    result = lvalue + rvalue
                    break
                case "-":
                    result = lvalue - rvalue
                    break
                case "*":
                    result = lvalue * rvalue
                    break
                case "/":
                    result = lvalue / rvalue
                    break
                case "%":
                    result = lvalue % rvalue
                    break
            }

            return result
        },
        ifLogical: function (lvalue, operator, rvalue, options) {
            
            if (isNaN(lvalue) && isNaN(rvalue)) {                
                lvalue = parseFloat(lvalue);
                rvalue = parseFloat(rvalue);
            }
            var result = false;
            switch (operator) {
                case ">":
                    result = lvalue > rvalue
                    break
                case "<":
                    result = lvalue < rvalue
                    break
                case "=":
                    result = lvalue = rvalue
                    break
                case "!=":
                    result = lvalue != rvalue
                    break
                case ">=":
                    result = lvalue >= rvalue
                    break
                case "<=":
                    result = lvalue <= rvalue
                    break
            }
            console.log(lvalue, operator, rvalue, result)
            if (result) {
                return options.fn(this)
            } else {
                return options.inverse(this)
            }
        }
    }
});


var app = express();
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
var server = http.createServer(app);
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, './public')));

const port = process.env.PORT || 3002;

app.get('/quotes', (req, res) => {
    var url = 'http://localhost:3600/quotes'

    request({ url: url, json: true }, (err1, res1, body1) => {
        if (err1) {
            console.log(err1)
            return
        }

        res.render('quotes', body1.quotes)
    })

    //var json = '{"success": {"total": 1},"contents": {"quotes": [{"quote": "From now on we live in a world where man has walked on the Moon. It\'s not a miracle; we just decided to go.","length": "107","author": "Tom Hanks","tags": ["humor","inspire","man","miracles","moon"],"category": "inspire","date": "2018-02-26","permalink": "https://theysaidso.com/quote/9rDc8ymrY7VZQHCUf6Xf1AeF/tom-hanks-from-now-on-we-live-in-a-world-where-man-has-walked-on-the-moon-its-no","title": "Inspiring Quote of the day","background": "https://theysaidso.com/img/bgs/man_on_the_mountain.jpg","id": "9rDc8ymrY7VZQHCUf6Xf1AeF"}],"copyright": "2017-19 theysaidso.com"}}';
    //var body1 = JSON.parse(json)
    //res.render('quotes', body1.contents.quotes[0])    
});

app.get('/clock', (req, res) => {

    var json = '{"clocks":[{"clock0":""},{"clock1":""},{"clock2":""},{"clock3":""},{"clock4":""},{"clock5":""},{"clock6":""},{"clock7":""},{"clock8":""},{"clock9":""},{"clock10":""},{"clock11":""},{"clock12":""},{"clock13":""},{"clock14":""},{"clock15":""},{"clock16":""},{"clock17":""},{"clock18":""},{"clock19":""},{"clock20":""},{"clock21":""},{"clock22":""},{"clock23":""}]}';
    var body1 = JSON.parse(json)
    res.render('clock24', body1)    
});

app.get('/todo', (req, res) => {
    var urlProjects = 'http://localhost:3600/todo/projects'
    request({ url: urlProjects, json: true }, (err1, res1, body1) => {
        if (err1) {
            console.log(err1)
            return
        }

        var urlTasks = 'http://localhost:3600/todo'
        request({ url: urlTasks, json: true }, (err2, res2, body2) => {
            if (err2) {
                console.log(err2)
                return
            }

            if (body1 && body2) {

                _.each(body1.projects, function (item, index) {
                    item.tasks = _.filter(body2.tasks, { 'project_id': item.id })
                })

                res.render('todo', body1)
            }
        })
    })
})

app.get('/weather', (req, res) => {
    //var url = 'http://192.168.1.70:3600/forecast'
    var url = 'http://localhost:3600/forecast'

    request({ url: url, json: true }, (err1, res1, body1) => {
        if (err1) {
            console.log(err1)
            return
        }

        const moment = require('moment')
        if (body1) {

            // var parsedDate = moment(currently.time * 1000);
            // var date = parsedDate.format('dddd MMMM Do YYYY hh:mm:ss a');
            // var dayAndWeek = parsedDate.format('[(]DDD[th day) (]w[th week)]');
            // info += `</br>${date}`

            let weekTempMin = _.toInteger(_.minBy(body1.data.daily.data, 'temperatureMin').temperatureMin / 10) * 10
            let weekTempMax = _.toInteger(_.maxBy(body1.data.daily.data, 'temperatureMax').temperatureMax / 10) * 10

            let weekTempMarginUnit = 100 / (weekTempMax - weekTempMin);
            //console.log('weekTempMax', weekTempMax, 'weekTempMin', weekTempMin, 'weekTempMarginUnit', weekTempMarginUnit)

            var currently = body1.data.currently
            currently.temperatureInt = Math.round(currently.temperature)
            currently.apparentTemperatureInt = Math.round(currently.apparentTemperature)

            _.each(body1.data.daily.data, function (item, index) {

                item.temperatureMinInt = Math.round(item.temperatureMin)
                item.temperatureMaxInt = Math.round(item.temperatureMax)

                let l = (item.temperatureMinInt - weekTempMin) * weekTempMarginUnit;
                let m = 100 - ((weekTempMax - item.temperatureMaxInt) * weekTempMarginUnit)

                item.minTempLeft = l
                item.barWidth = (m - l)
                item.barML = l
                item.maxTempLeft = m
                if (index == 0)
                    item.name = "Today"
                else
                    item.name = moment(item.time * 1000).format('ddd')
                //console.log('m', m, 'l', l, 'item.temperatureMin', item.temperatureMin, 'item.temperatureMax', item.temperatureMax)
            })

            _.each(body1.data.hourly.data, function (item, index) {
                item.tempLeft = Math.round((index / 2) * 66.6667)
                item.temperatureInt = _.toInteger(item.temperature)
                item.displayTemp = false
                if (index % 2 == 0 && index < 24) {
                    item.displayTemp = true
                }

                item.displayHour = false
                if (index < 24) {
                    item.displayHour = true
                    item.hourLeft = Math.round(index * 66.6667)
                    item.hourFormat = moment(item.time * 1000).format('ha')
                    //console.log(item.time, item.hourFormat)
                }
            })

            res.render('weather', body1.data)

        }
    })
})

app.listen(3002, () => console.log('Forecast listening on port 3002!'))

