function initWeather () {
    const searchPanel = document.querySelector('.forecast__search');
    const locationInput = document.querySelector('#input_location');
    const locationUl = document.querySelector('#locations');
    const localityEl = document.querySelector('.forecast__location-title');
    const searchTrigger = document.querySelector('.forecast__search-trigger');

    const coord =  localStorage.getItem('coord-lat') ? [localStorage.getItem('coord-lat'), localStorage.getItem('coord-lon')] : [45.040216, 38.975996];   // krasnodar
    let locality = localStorage.getItem('locality') ? localStorage.getItem('locality') : 'Краснодар';

    setWeather();
    searchTrigger.addEventListener('click', () => {
        showSearchPanel();
        locationInput.addEventListener('input', (e) => setSearchLocations(e.target.value));
    })


    async function setWeather () {
        const tempEl = document.querySelector('.forecast__temp');
        const weatherEl = document.querySelector('.forecast__weather-title');
        const weatherIcon = document.querySelector('.forecast__weather-icon');
        let weatherIconUrl = '';

        // loading
        localityEl.innerText = '';
        tempEl.innerText = '';
        weatherEl.innerText = '';
        searchTrigger.style.display = 'none';
        setIconBg('./img/spinner.svg');

        // request
        const {temp, weather} = await getWeather(coord);

        // loaded
        localityEl.innerText = (temp || weather) ? locality : 'Ошибка, попробуйте другой город';
        tempEl.innerText = temp ? `${temp} °C` : '';
        weatherEl.innerText = weather;
        searchTrigger.style.display = 'flex';
        switch (weather) {
            case 'ясно': 
                weatherIconUrl = './img/weather/clear.png';
                break;
            case 'дождь': 
                weatherIconUrl = './img/weather/rain.png';
                break;
            case 'снег': 
                weatherIconUrl = './img/weather/snow.png';
                break;
            case 'облачно': 
                weatherIconUrl = './img/weather/clouds.png';
                break;
            case '':
                weatherIconUrl = './img/weather/error.png';
                break;
        }
        setIconBg(weatherIconUrl);

        function setIconBg (url) {
            weatherIcon.style.background = `url(${url}) center center / contain no-repeat`;
        }
    }

    // получение предложенных локаций в поиске
    async function setSearchLocations (query) {
        const locationArray = await getSearchLocations(query);
        showLocations(locationArray);
        locationUl.style.display = 'block';
    }

    async function getSearchLocations (locationQuery) {
        const url = 'http://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
        const _token = '52fd0d81d9acc4a4ba2cf6a967f3b0e56077d231';
        const options = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Token ' + _token
            },
            body: JSON.stringify({query: locationQuery, 
                from_bound: {value: 'city'},
                to_bound: {value: 'settlement'},
                locations: [
                    {settlement_type_full: 'село'},
                    {settlement_type_full: 'поселок'},
                    {settlement_type_full: 'деревня'},
                    {settlement_type_full: 'поселок городского типа'},
                    {settlement_type_full: 'рабочий поселок'},
                    {city_type_full: 'город'}
                ]
            })
        }
        let locationArray;
        
        try {
            locationArray = await fetch(url, options)
                .then(responce => responce.json())
                .then(responce => responce.suggestions);
        } catch(error) {
            console.log('error', error);
            locationArray = [];
        }
        return locationArray
    }

    // запрос погоды
    async function getWeather (coord) {
        let weather = '';
        let temp = '';
        try {
            const url = 'https://api.weatherbit.io/v2.0/current';
            const _apiKey = '41601d25fa3b4e07865770cba731510a';
            const responce = await fetch(`${url}?lat=${coord[0]}&lon=${coord[1]}&key=${_apiKey}`)
                .then(responce => responce.json())
                .then(responce => responce.data[0]);
            const id = responce.weather.code;
            if (id >= 200 && id <= 599) {
                weather = 'дождь'
            } else if (id >= 600 && id <= 699) {
                weather = 'снег'
            } else if ((id >= 700 && id <= 799) || (id >= 801 && id <= 900)) {
                weather = 'облачно'
            } else if (id == 800) {
                weather = 'ясно'
            }
            temp = parseInt(responce.app_temp);
        } catch(error) {
            console.log('error', error);
        }
        return {temp, weather}
    }

    // отображение поисковой строки
    function showSearchPanel () {
        localityEl.style.display = 'none';
        searchPanel.style.display = 'block';
        locationInput.focus();
        locationInput.addEventListener('focusout', () => {
            setTimeout(hideSearchPanel, 100)
        })
    }

    function hideSearchPanel () {
        localityEl.style.display = 'flex';
        searchPanel.style.display = 'none';
        locationInput.value = '';
        locationUl.style.display = 'none';
    }

    // отображение предложенных локаций в поиске
    function showLocations (locationArray) {
        locationUl.innerHTML = '';
        locationArray.forEach((loc) => {
            const locEl = document.createElement('li');
            locEl.classList.add('forecast__location-li')
            locEl.innerText = loc.value;
            locEl.setAttribute('data-geo-lat', loc.data.geo_lat);
            locEl.setAttribute('data-geo-lon', loc.data.geo_lon);
            locEl.setAttribute('data-settlement', loc.data.settlement ? loc.data.settlement : loc.data.city);
            locationUl.append(locEl);
        });
        // выбор локации
        locationUl.querySelectorAll('.forecast__location-li').forEach(li => {
            li.addEventListener('click', (e) => {
                coord[0] = e.target.getAttribute('data-geo-lat');
                coord[1] = e.target.getAttribute('data-geo-lon');
                locality = e.target.getAttribute('data-settlement');
                localStorage.setItem('coord-lat', coord[0]);
                localStorage.setItem('coord-lon', coord[1]);
                localStorage.setItem('locality', locality);
                setWeather();
            })
        });
    }
}