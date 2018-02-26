const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const express = require('express')
const _ = require('lodash')

const path = require("path")
const http = require("http")
const morgan = require("morgan")
const request = require('request')

var app = express();
app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', '.hbs');
var server = http.createServer(app);
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, './public')));

const port = process.env.PORT || 3002;

app.get('/', (req, res1) => {
    var url = 'http://192.168.1.70:3600/forecast'

    request({ url: url, json: true }, (err, res, body) => {
        if (err) {
            console.log(err)
            return
        }


        if (body) {

            // var parsedDate = moment(currently.time * 1000);
            // var date = parsedDate.format('dddd MMMM Do YYYY hh:mm:ss a');
            // var dayAndWeek = parsedDate.format('[(]DDD[th day) (]w[th week)]');
            // info += `</br>${date}`

            //$(".result").html(info)
            
            _.each(body.data.daily.data, function(item){
                item.minTempLeft = 20
                item.barWidth = 20
                item.barML = 20
                item.maxTempLeft = 20
                item.name = "test"
            })

            res1.render('home', body.data)





        }
    })


})

app.listen(3002, () => console.log('Forecast listening on port 3002!'))

