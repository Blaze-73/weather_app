const weatherform = document.querySelector(".weatherform");
const cityinput = document.querySelector(".cityinput");
const card = document.querySelector(".card");
const apikey = "0020dc50c43b7687b8fce538249dbd6a";

weatherform.addEventListener("submit", async event => {
event.preventDefault();
const city = cityinput.value;

    if(city){
        try{
            const weatherdata = await getmeteo(city);
            displayweatherinfo(weatherdata);
        }
        catch(error){
            console.error(error);
            displayerror(error.message);
        }
    } 
    else{
        displayerror("please enter a city");
    }
});

async function getmeteo(city){
    const geourl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apikey}`;
    const georesponse = await fetch(geourl);
    
    if(!georesponse.ok){
        throw new Error("uhh sorry couldnt get location's weather");
    }
    const geodata = await georesponse.json();

    if(geodata.length === 0){
        throw new Error("City not found enter a valid city name please");
    }
    const {lat,lon,name} = geodata[0];

    const weatherurl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`;
    const weatherresponse = await fetch(weatherurl);

    if(!weatherresponse.ok){
        throw new Error("couldnt get weather");
    }
    const currentweather = await weatherresponse.json();

    const forecasturl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apikey}`;
    const forecastresponse = await fetch(forecasturl);
    if(!forecastresponse.ok){
        throw new Error("couldnt get forecast");
    }
    const forecastdata = await forecastresponse.json();
    return {
        current: currentweather,
        hourly: forecastdata.list.slice(0,8)

    };
}
function displayweatherinfo(data){
    const {name: city,
            main :{temp,humidity},
            weather :[{description,id}] } = data.current;

card.textContent = "";
card.style.display = "flex";

const citydisplay = document.createElement("h1");
const temdisplay = document.createElement("p");
const humiditydisplay = document.createElement("p");
const descdisplay = document.createElement("p");
const weatheremojie = document.createElement("p");

citydisplay.textContent = city;
temdisplay.textContent = `${(temp - 273.15).toFixed(1)}C`;
humiditydisplay.textContent = `humidity: ${humidity}%`;
descdisplay.textContent = `${description}`
weatheremojie.textContent =getweatheremojie(id);

citydisplay.classList.add("citydisplay");
temdisplay.classList.add("temdisplay");
humiditydisplay.classList.add("humiditydisplay");
descdisplay.classList.add("descdiplay");
weatheremojie.classList.add("weatheremojie");

card.appendChild(citydisplay);
card.appendChild(temdisplay);
card.appendChild(humiditydisplay)
card.appendChild(descdisplay);
card.appendChild(weatheremojie);
displayhourlyforecast(data.hourly);
}

function displayhourlyforecast(hourlydata){
    const hourlysection = document.createElement("div");
    hourlysection.classList.add("hourly-section");

    const hourlytitle = document.createElement("h2");
    hourlytitle.textContent = "Hourly forecast";
    hourlytitle.classList.add("hourly-title");

    const hourlycontainer = document.createElement("div");
    hourlycontainer.classList.add("hourly-container");

    hourlydata.forEach(hour => {
        const houritem = document.createElement("div");
        houritem.classList.add("hourly-item");

        const time = new Date(hour.dt*1000);
        const timestring = time.toLocaleTimeString('en-US', {hour: 'numeric', hour12: true});

        const hourtime = document.createElement("div");
        hourtime.classList.add("hourly-time");
        hourtime.textContent = timestring;

        const houremojie = document.createElement("div");
        houremojie.classList.add("hourly-emoji");
        houremojie.textContent = getweatheremojie(hour.weather[0].id)

        const hourtemp = document.createElement("div");
        hourtemp.classList.add("hourly-tmep");
        hourtemp.textContent = `${(hour.main.temp - 273.15).toFixed(1)}°C`;

        const hourdesc = document.createElement("div");
        hourdesc.classList.add("hourly-desc");
        hourdesc.textContent = hour.weather[0].description;

        houritem.appendChild(hourtime);
        houritem.appendChild(houremojie);
        houritem.appendChild(hourtemp);
        houritem.appendChild(hourdesc);
        hourlycontainer.appendChild(houritem);
    });
    hourlysection.appendChild(hourlytitle);
    hourlysection.appendChild(hourlycontainer);
    card.appendChild(hourlysection);
}

function getweatheremojie(weatherid){
switch(true){
    case(weatherid >= 200 && weatherid <300):
    return "🌩️";
    case(weatherid >= 300 && weatherid <400):
    return "🌧️ ";
    case(weatherid >= 500 && weatherid <600):
    return "🌧️ ";
    case(weatherid >= 600 && weatherid <700):
    return "❄️";
    case(weatherid >= 700 && weatherid <800):
    return "😶‍🌫️";
    case(weatherid = 800):
    return "☀️ ";
    case(weatherid >= 800 && weatherid <810):
    return "☁️ ";
    default: return "?";
}
}
function displayerror(message){
const errordisplay = document.createElement("p");
errordisplay.textContent = message;
errordisplay.classList.add("errordisplay");

card.textContent= "";
card.style.display="flex";
card.appendChild(errordisplay)
}