const http = require('http');
const fetch = require('node-fetch');
const url = require('url');
const mysql = require("mysql2");
const INSERT = "insert into cities (id, city) values (?, ?)";
const GET = "select * from cities";
const DELETE = "delete from cities where city=?";


const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "fav",
    password: "password"
});
connection.connect(function(err){
    if (err) {
        return console.error("Ошибка: " + err.message);
    }
    else{
        console.log("Подключение к серверу MySQL успешно установлено");
    }
});

function insert(id, city) {
    connection.query(INSERT, [id, city],
        function(err) {
            if (err) console.error(err);
        });
}
function update (city, response) {
    fetch(encodeURI(`https://community-open-weather-map.p.rapidapi.com/weather?q=${city}&units=metric`), {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "0a4a55c410mshdf19a50d55f3647p101e49jsn9f35e66d7077",
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com"
        }
    })
        .then((res) => {
            if (res.status >= 200 && res.status < 300) {
                return res.json();
            } else {
                let error = new Error();
                error.response = res;
                response.statusCode = 404;
                response.end();
                throw error;
            }
        })
        .then(function (data) {
            connection.query(GET,
                function (err, results) {
                    if (err) console.error(err);
                    if (results.length !== 0) {
                        for (let i = 0; i < results.length; i++) {
                            console.log(results[i].id == data.id);
                            if (results[i].id == data.id) {
                                response.write('101');
                            }
                        }
                        if (response.statusCode !== 101) {
                            insert(data.id, data.name);
                            response.write(JSON.stringify(data));
                        }
                        response.end();
                    } else {
                        insert(data.id, data.name);
                        response.write(JSON.stringify(data));
                        response.end();
                    }
                });
        })
        .catch ((e) => {
            console.log(e.message);
        });
}
function getByCity (city, response) {
    fetch(encodeURI(`https://community-open-weather-map.p.rapidapi.com/weather?q=${city}&units=metric`), {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "0a4a55c410mshdf19a50d55f3647p101e49jsn9f35e66d7077",
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com"
        }
    })
        .then((res) => {
            if (res.status >= 200 && res.status < 300) {
                return res.json();
            } else {
                let error = new Error();
                error.response = res;
                response.statusCode = 404;
                response.end();
                throw error;
            }
        })
        .then(function (data) {
                connection.query(GET,
                    function (err, results) {
                        if (err) console.error(err);
                        if (results.length !== 0) {
                            for (let i = 0; i < results.length; i++) {
                                console.log(results[i].id == data.id);
                                if (results[i].id == data.id) {
                                    response.write('101');
                                }
                            }
                            if (response.statusCode !== 101) {
                                insert(data.id, data.name);
                                response.write(JSON.stringify(data));
                            }
                            response.end();
                        } else {
                            insert(data.id, data.name);
                            response.write(JSON.stringify(data));
                            response.end();
                        }
                    });
        })
        .catch ((e) => {
            console.log(e.message);
        });
}
function favCity (city, response) {
    fetch(encodeURI(`https://community-open-weather-map.p.rapidapi.com/weather?q=${city}&units=metric`), {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "0a4a55c410mshdf19a50d55f3647p101e49jsn9f35e66d7077",
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com"
        }
    })
        .then((res) => {
            if (res.status >= 200 && res.status < 300) {
                return res.json();
            } else {
                let error = new Error();
                error.response = res;
                response.statusCode = 404;
                response.end();
                throw error;
            }
        })
        .then(function (data) {
            response.write(JSON.stringify(data));
            response.end();
        })
        .catch ((e) => {
            console.log(e.message);
        });
}
const getByCoords = (latitude, longitude, response) => {
    fetch(`https://community-open-weather-map.p.rapidapi.com/forecast?units=metric&lat=${latitude}&lon=${longitude}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "0a4a55c410mshdf19a50d55f3647p101e49jsn9f35e66d7077",
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com"
        }
    })
        .then((res) => {
            if (res.status >= 200 && res.status < 300) {
                return res.json();
            } else {
                let error = new Error();
                error.response = res;
                throw error;
            }
        })
        .then(function (data) {
            response.write(JSON.stringify(data));
            response.end();
        })
        .catch ((e) => {
            console.log(e.message);
        });

}

http.createServer(function(request,response){
    let urlRequest = url.parse(request.url, true);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', '*');
    response.setHeader('Access-Control-Allow-Methods', '*');
    switch (urlRequest.pathname) {
        case "/weather/city":
            switch (request.method) {
                case "GET":
                    let city = JSON.parse(JSON.stringify(urlRequest.query)).q;
                    getByCity(city, response);
                    break;
                case "POST":
                    let postCity = JSON.parse(JSON.stringify(urlRequest.query)).q;
                    favCity(postCity, response);
                    break;
            }
            break;
        case "/weather/coordinates":
            let lat = JSON.parse(JSON.stringify(urlRequest.query)).lat;
            let lon = JSON.parse(JSON.stringify(urlRequest.query)).lon;
            getByCoords(lat, lon, response);
            break;
        case "/favorites":
            switch (request.method) {
                case "GET":
                    connection.query(GET,
                        function(err, results) {
                            if (err) console.error(err);
                            console.log(results);
                            response.write(JSON.stringify(results));
                            response.end();
                        });
                    break;
                case "POST":
                    let newCity = JSON.parse(JSON.stringify(urlRequest.query)).q;
                    update(newCity, response);
                    break;
                default:
                    let oldCity = JSON.parse(JSON.stringify(urlRequest.query)).q;
                    connection.query(DELETE, [oldCity],
                        function(err, results) {
                            if (err) console.error(err);
                            response.write(JSON.stringify(results));
                            response.end();
                        });
                    break;
            }
            break;
    }
}).listen(3000, "localhost",function(){
    console.log("Сервер начал прослушивание запросов на порту 3000");
});