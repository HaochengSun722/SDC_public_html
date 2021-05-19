var moment = require('moment');

var portNumber = 8894;

var mysql = require('mysql');

// MySQL Connection Variables
var connection = mysql.createConnection({
  host     : 'dev.spatialdatacapture.org',
  user     : 'ucfnhsu',
  password : 'cheng19970722@',
  database : 'ucfnhsu'
});

connection.connect();

//  Setup the Express Server
var express = require('express')
var app = express()
app.set('view engine', 'ejs');

// Provides the static folders we have added in the project to the web server.
app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/images'));

// Default API Endpoint - return the index.ejs file in the views folder
app.get('/', function(req, res) {
    return res.render('index');
})


//  API EndPoint to get data from specific area - /data/51.1/0.0/30 
app.get('/data/:year/:day/:dir/:time', function (req, res) {

      // Alows data to be downloaded from the server with security concerns
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      //👆默认不用改
      // If all the variables are provided connect to the database
      if(req.params.year != "" && req.params.day != "" && req.params.dir != "" && req.params.time != ""){
               
                // Parse the values from the URL into numbers for the query
                var year = parseInt(req.params.year);
                var day = mysql_real_escape_string(req.params.day);
                var dir = mysql_real_escape_string(req.params.dir);
				var time = mysql_real_escape_string(req.params.time);

                // SQL Statement to run
                //var sql = "SELECT * FROM photo_locations WHERE DISTANCE(points, POINT("+lon+","+lat+") ) <= " + radius;
                var sql = "SELECT * FROM london_tube_map WHERE year =" + year + "AND day =" + day + "AND dir =" + dir + "AND time ="+ time;
                // Log it on the screen for debugging
                console.log(sql);

                // Run the SQL Query
                connection.query(sql, function(err, rows, fields) {
                        if (err) console.log("Err:" + err);
                        if(rows != undefined){
                                // If we have data that comes bag send it to the user.
                                res.send(rows);
                        }else{
                                res.send("");
                        }
                });
        }else{
                // If all the URL variables are not passed send an empty string to the user
                res.send("");
        }
});

// Setup the server and print a string to the screen when server is ready
var server = app.listen(portNumber, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
})


function mysql_real_escape_string (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}