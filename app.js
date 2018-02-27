const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const express = require('express')
const _ = require('lodash')

const path = require("path")
const http = require("http")
const morgan = require("morgan")
const request = require('request')


var app = express();
app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'layout' }));
app.set('view engine', '.hbs');
var server = http.createServer(app);
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, './public')));

const port = process.env.PORT || 3002;

app.get('/quotes', (req, res) => {

    var json = '{"success": {"total": 1},"contents": {"quotes": [{"quote": "From now on we live in a world where man has walked on the Moon. It\'s not a miracle; we just decided to go.","length": "107","author": "Tom Hanks","tags": ["humor","inspire","man","miracles","moon"],"category": "inspire","date": "2018-02-26","permalink": "https://theysaidso.com/quote/9rDc8ymrY7VZQHCUf6Xf1AeF/tom-hanks-from-now-on-we-live-in-a-world-where-man-has-walked-on-the-moon-its-no","title": "Inspiring Quote of the day","background": "https://theysaidso.com/img/bgs/man_on_the_mountain.jpg","id": "9rDc8ymrY7VZQHCUf6Xf1AeF"}],"copyright": "2017-19 theysaidso.com"}}';
    var body1 = JSON.parse(json)
    res.render('quotes', body1.contents.quotes[0])

    // var urlProjects = 'http://quotes.rest/qod.json?category=funny&maxlength=300'
    // request({ url: urlProjects, json: true }, (err1, res1, body1) => {
    //     if (err1) {
    //         console.log(err1)
    //         return
    //     }
    //     console.log(body1)
    //     res.render('quotes', body1.contents.quotes[0])
    // })
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


            _.each(body1.data.daily.data, function (item, index) {

                item.temperatureMinInt = Math.floor(item.temperatureMin)
                item.temperatureMaxInt = Math.ceil(item.temperatureMax)

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

            res.render('weather', body1.data)

        }
    })
})

app.listen(3002, () => console.log('Forecast listening on port 3002!'))

