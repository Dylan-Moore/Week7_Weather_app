//Background image//
const accessId="SnWxsUZvTRUpqj_7w3c2kDw_py9SJ5nxF6ZN4ZikEFo"
const SecretKey = "gW378aBqfUXDm7G_Soip4kA9USMzzYpRV8EZ-ZaKFyo"
// const getToken2 = async() => {
//     const result = await fetch(`https://api.unsplash.com/photos/?client_id=${accessId}`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//             'Authorization': 'Basic ' +btoa(accessId + ':' + SecretKey)
//         },
//         body: 'grant_type=client_credentials'
//     });

//     const data = await result.json()
//     return data.access_token
// }
async function getBG(weather_pic) {
    console.log(weather_pic)
    let request = await fetch(`https://api.unsplash.com/search/photos?page=1&query=${weather_pic}&client_id=SnWxsUZvTRUpqj_7w3c2kDw_py9SJ5nxF6ZN4ZikEFo`,{method: 'GET'}); 
    
    let response = await request.json()
    let data = response.results
    let pic_url = data[0].urls.raw
    console.log(pic_url)
    console.log(response)
    console.log(data)
    const html = '<p></p>'
    let bg_photo = document.querySelector(DOM_Elements.background_picture);//.insertAdjacentHTML('beforeend', html);
    console.log(bg_photo)
    document.getElementById("weather_time").style.backgroundImage="url('" + `${pic_url}` +  "')";
}









// Spotify Call //
let song;
let playSong;

const clientId ="891f92b4d3d54ae9bbc89e534820389b"
const clientSecret = "f91de2ec5c494f8583ad804e9c3adb2b"

const getToken = async() => {
    const result = await fetch(`https://accounts.spotify.com/api/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' +btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await result.json()
    return data.access_token
}


async function getTrack(track) {
    console.log(track)
    let token = await getToken();
    let headers = new Headers([
        ['Content-Type', 'application/json'],
        ['Accept', 'application/json'],
        ['Authorization', `Bearer ${token}`]
    ]);

    let request = new Request(`https://api.spotify.com/v1/search?q=ambient${track}&type=track&limit=15`,{
        method: 'GET',
        headers: headers
    });
    let result = await fetch(request);
    
    let response = await result.json()
    console.log(response.tracks)
    item_index = 0
    song = response.tracks.items[item_index].preview_url
    while (song == null) {
        item_index += 1
        song = response.tracks.items[item_index].preview_url
    }
    console.log(song)


    

    if (playSong){
        stopSnippet();
    }
    songSnippet(song);
}

// function getSong(id, event){
//         event.stopPropagation();
//         clickedEvent(0, 0)
    
// }

/**
 * @param {string}url
 */

function songSnippet(url){
    playSong = new Audio(url);
    return playSong.play()
}

function stopSnippet(){
    return playSong.pause()
}



















// Weather API Call //

const form = document.querySelector('#testDataForm')
console.log('a')
console.log(form)
form.addEventListener('submit', (event) => {
    event.preventDefault()
    let query_zipcode = document.querySelector('#zipcode');
    zipcode = query_zipcode.value
    console.log(query_zipcode.value)
    load_data(zipcode)
})

const getData = async(zipcode) => {
    //zipcode = toString(zipcode)
    //console.log(typeof(zipcode))
    let response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?zip=${zipcode}&appid=30c5b67538c93f580caf00b5810cf517`)
    console.log(response.data)
    return response.data;
}

const DOM_Elements = {
    weather_info: '.weather-info',
    background_picture: '.background-pic'
}

const create_weather_data = (id, city, temp, feels_like, low_temp, high_temp, humidity, forecast, forecast_desc) => {
     tempf = Math.round((temp - 273.15) * (9/5) + 32)
    feels_likef = Math.round((feels_like - 273.15) * (9/5) + 32)
    low_tempf = Math.round((low_temp - 273.15) * (9/5) + 32)
    high_tempf = Math.round((high_temp - 273.15) * (9/5) + 32)
    const html = `<a href="#" class = "list-group-item list-group-item-action list-group-item-light" id="${id}"> ${temp}, ${high_temp}, ${low_temp} 
    <table class="table">
    <thead>
        <tr>
        <th scope="col">City</th>
        <th scope="col">Current Temperature</th>
        <th scope="col">But, it feels like!</th>
        <th scope="col">Low for the Day! </th>
        <th scope="col">High for the Day!</th>
        <th scope="col">Humidity!</th>
        <th scope="col">Forecast!</th>
        </tr>
    </thead>
    <tbody>
        
        <th scope="row">${city}</th>
        <td>${tempf} \u00B0</td>
        <td>${feels_likef} \u00B0</td>
        <td>${low_tempf} \u00B0</td>
        <td>${high_tempf} \u00B0</td>
        <td>${humidity}</td>
        <td>${forecast} ${forecast_desc}</td>
        
    </tbody>
    </table>
    </a>`
    console.log(id,temp,high_temp,low_temp,forecast)
    document.querySelector(DOM_Elements.weather_info).insertAdjacentHTML('beforeend', html)
}

const load_data = async(zipcode) => {
    clear_data()
    const weather = await getData(zipcode);
    // console.log(temp)
    create_weather_data(weather.weather[0].id, weather.name, weather.main.temp, weather.main.feels_like, weather.main.temp_min, weather.main.temp_max, weather.main.humidity, weather.weather[0].main, weather.weather[0].description)
    getTrack(weather.weather[0].main)
    getBG(weather.weather[0].main)
}
const clear_data = async() => {
    document.querySelector(DOM_Elements.weather_info).innerHTML = '';
}