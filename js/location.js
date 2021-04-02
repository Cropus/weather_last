//                      CHECK FOR GEOLOCATION API
if (navigator.geolocation) {
    console.log('Geolocation is supported!');
} else {
    alert("Geolocation is not supported for this Browser/OS version yet.");
}

//                      CALLBACKS FOR GEOLOCATION
// Callback for success
const geoSuccess = (position) => {
    return fetchByLocation(position.coords.latitude, position.coords.longitude)
};
// Callback for error
const geoError = (error) => {
    console.error(error);
    return fetchByLocation(59.937500, 30.308611);
};




//                      FETCH-METHODS
// Use only for current-section
const fetchByLocation = (latitude, longitude) => {
    fetch(`http://localhost:3000/weather/coordinates?units=metric&lat=${latitude}&lon=${longitude}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "294cdc2942msh00e9cefa5ffe8d7p1dd66ejsncbd442974b97",
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com"
        }
    })
        .then((res) => {
            if (res.status >= 200 && res.status < 300) {
                return res.json();
            } else {
                let error = new Error();
                if (res.status >= 500 && res.status < 600) {
                    alert("server error, " + res.status);
                } else if (res.status === 404) {
                    alert("not found");
                } else if (res.status >= 400 && res.status < 500) {
                    alert("client error, " + res.status);
                } else if (res.status >= 300 && res.status < 400) {
                    alert("redirection, " + res.status);
                }
                error.response = res;
                throw error;
            }
        })
        .then(function (data) {
            // Set regular location weather-data
            setCurrent(data);
        })
        .catch ((e) => {
            if (!navigator.onLine) {
                alert("Please, check your network connection");
            }
            console.log(e);
            document.querySelector('h1').textContent = "Ошибка";
        });

}
// Use only for regular-section
function fetchByCity (city) {
    let already = false;
    fetch(`http://localhost:3000/weather/city?q=${city}&units=metric`, {
        "method": "GET",
        "port": 3000,
    })
        .then((res) => {
            if (res.status >= 200 && res.status < 300) {
                return res.json();
            } else {
                console.log(res.status);
                let error = new Error();
                if (res.status >= 500 && res.status < 600) {
                    alert("server error, " + res.status);
                } else if (res.status === 404) {
                    alert("Not Found, 404");
                    already = true;
                } else if (res.status >= 400 && res.status < 500) {
                    alert("client error, " + res.status);
                } else if (res.status >= 300 && res.status < 400) {
                    alert("redirection, " + res.status);
                }
                error.response = res;
                throw error;
            }
        })
        .then(function (data) {
            setRegular(city, data);
        })
        .catch ((e) => {
            if (!navigator.onLine) {
                alert("Please, check your network connection");
            }
            console.error(e);
            if (document.getElementById(`li-${city}`) !== null) {
                document.getElementById(`li-${city}`).remove();
                if (!already) {
                    alert("Already exists");
                }
            }
        });
}
function postByCity (city) {
    fetch(`http://localhost:3000/weather/city?q=${city}&units=metric`, {
        "method": "POST",
        "port": 3000,
    })
        .then((res) => {
            if (res.status >= 200 && res.status < 300) {
                return res.json();
            } else {
                console.log(res.status);
                let error = new Error();
                if (res.status >= 500 && res.status < 600) {
                    alert("server error, " + res.status);
                } else if (res.status === 404) {
                    alert("Not Found");
                } else if (res.status >= 400 && res.status < 500) {
                    alert("client error, " + res.status);
                } else if (res.status >= 300 && res.status < 400) {
                    alert("redirection, " + res.status);
                }
                error.response = res;
                throw error;
            }
        })
        .then(function (data) {
            if (data == 101) {
                document.getElementById(`li-${city}`).remove();
                alert("Already exists");
            } else {
                setRegular(city, data);
            }
        })
        .catch ((e) => {
            if (!navigator.onLine) {
                alert("Please, check your network connection");
            }
            console.error(e);
            if (document.getElementById(`li-${city}`) !== null) {
                document.getElementById(`li-${city}`).remove();
                alert("Already exists");
            }
        });
}

function deleteCity (city) {
    fetch(`http://localhost:3000/favorites?q=${city}&units=metric`, {
        "method": "DELETE",
        "port": 3000,
    })
        .catch ((e) => {
            if (!navigator.onLine) {
                alert("Please, check your network connection");
            }
            console.error(e);
        });
}
function updateCity (city) {
    fetch(`http://localhost:3000/favorites?q=${city}&units=metric`, {
        "method": "POST",
        "port": 3000,
    })
        .catch ((e) => {
            if (!navigator.onLine) {
                alert("Please, check your network connection");
            }
            console.error(e);
        });
}
function getCity () {
    fetch(`http://localhost:3000/favorites`, {
        "method": "GET",
        "port": 3000,
    })
        .then((res) => {
            if (res.status >= 200 && res.status < 300) {
                return res.json();
            } else {
                console.log(res.status);
                let error = new Error();
                if (res.status >= 500 && res.status < 600) {
                    alert("server error, " + res.status);
                } else if (res.status === 404) {
                    alert("Not Found");
                } else if (res.status >= 400 && res.status < 500) {
                    alert("client error, " + res.status);
                } else if (res.status >= 300 && res.status < 400) {
                    alert("redirection, " + res.status);
                }
                error.response = res;
                throw error;
            }
        })
        .then((data) => {
            let i = 0;
            while (data[i]) {
                add(data[i].city);
                i = i + 1;
            }
            i = 0;
            while (data[i]) {
                setTimeout(postByCity, (i+1) * 1000, data[i].city);
                i = i + 1;
            }
        })
        .catch ((e) => {
            if (!navigator.onLine) {
                alert("Please, check your network connection");
            }
            console.error(e);
        });
}


//                      SET-METHODS FOR SECTIONS
function setCurrent(data) {
    document.querySelector('h1').textContent = data.city.name;
    document.querySelector('.current-temperature').innerHTML = Math.round(data.list[0].main.temp) + '&deg;';
    document.getElementById("wind-0").innerHTML = `${data.list[0].wind.speed}km/h`;
    document.getElementById("cloud-0").innerHTML = `${data.list[0].clouds.all}%`;
    document.getElementById("pressure-0").innerHTML = `${data.list[0].main.pressure}`;
    document.getElementById("humidity-0").innerHTML = `${data.list[0].main.humidity}%`;
    document.getElementById("cords-0").innerHTML = `${data.city.coord.lat} && ${data.city.coord.lon}`;
    document.querySelector('.current-image').src = `./icons/${data.list[0].weather[0].icon}.png`;
}
function setRegular(city, data) {
    document.getElementById(`temp-${city}`).innerHTML = Math.round(data.main.temp) + '&deg;';
    document.getElementById(`wind-${city}`).innerHTML = `${data.wind.speed}km/h`;
    document.getElementById(`cloud-${city}`).innerHTML = `${data.clouds.all}%`;
    document.getElementById(`pressure-${city}`).innerHTML = `${data.main.pressure}`;
    document.getElementById(`humidity-${city}`).innerHTML = `${data.main.humidity}%`;
    document.getElementById(`cords-${city}`).innerHTML = `${data.coord.lat} && ${data.coord.lon}`;
    document.getElementById(`img-${city}`).src = `./icons/${data.weather[0].icon}.png`;
}



//                      OTHER METHODS
// Add template-container on page (and close-button for it)
function add(value) {
    // Create template-container for regular city
    if ('content' in document.createElement('template')) {
        let template = document.querySelector('#template');
        let container = document.querySelector('.reg-container');
        let c = template.content;
        c.querySelector('h3').textContent = value;
        c.querySelector('button').id = `close-${value}`;
        c.querySelector('span').id = `temp-${value}`;
        c.querySelector('img').id = `img-${value}`;
        c.querySelector('.fav').id = `li-${value}`;
        let features = c.querySelectorAll('.feature-content');
        features[0].id = `wind-${value}`;
        features[1].id = `cloud-${value}`;
        features[2].id = `pressure-${value}`;
        features[3].id = `humidity-${value}`;
        features[4].id = `cords-${value}`;
        container.appendChild(c.cloneNode(true));
    }
    // Set close-button for template-container
    document.getElementById(`close-${value}`).onclick = () => {
        document.getElementById(`close-${value}`).disabled = true;
        deleteCity(value);
        document.getElementById(`li-${value}`).remove();
    }
}



//                      BUTTONS
// Set refresh-button for desktop version
document.querySelector(".desktop-ref").onclick = function () {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}
// Set refresh-button for mobile version
document.querySelector(".mobile-ref").onclick = function () {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}
// Set add-button for favorite-section
document.querySelector(".add-button").onclick = function () {
    const value = document.querySelector(".search-type").value;
    document.querySelector(".search-type").value = "";

    if (value !== "") {
        add(value);
        fetchByCity(value);
    }
    return false;
}



//                      PAGE START
window.onload = () => {
    // Get geolocation
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);

    getCity();
}