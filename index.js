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
            displayerror(error);
        }
    } 
    else{
        displayerror("please enter a city");
    }
});

async function getmeteo(city){
    const apiurl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
    const response = await fetch (apiurl);
    if(!response.ok){
        throw new Error("enter a valid city name");
    }
    return await response.json();
}

function displayweatherinfo(data){
    const {name: city,
            main :{temp,humidity},
            weather :[{description,id}] } = data;

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
card.appendChild(descdisplay)
card.appendChild(weatheremojie)
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