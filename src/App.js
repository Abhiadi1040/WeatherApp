import React, { useState } from 'react';
import './App.css';
import MiddlePageWeather from './components/MiddlePageWeather';
import LoadingOverlay from 'react-loading-overlay'
import FooterWeatherlist from './components/FooterWeatherlist';

  const App =()=> {
    
  const[city,setcity]=useState();
  const[loading,setloading]=useState(false);
  const[days,setdays]=useState([])
  //Api Key for api call
  const API_KEY="6557810176c36fac5f0db536711a6c52";

 
   const updateState = data => {
    const city = data.city.name;
    const days = [];
    const dayIndices = getDayIndices(data);

    for (let i = 0; i < 5; i++) {
      days.push({
        date: data.list[dayIndices[i]].dt_txt,
        weather_desc: data.list[dayIndices[i]].weather[0].description,
        icon: data.list[dayIndices[i]].weather[0].icon,
        temp: data.list[dayIndices[i]].main.temp
      });
    }

    
    setcity(city)
    setdays(days)
  };

  //  API call 
 const weatherApiCall = async (city) => {
  setloading(true)
    const api_data = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${API_KEY}`
    ).then(resp => resp.json());
    setloading(false)
    if (api_data.cod === '200') {
      updateState(api_data);
      return true;
    } else return false;
  };

  // returns array with Indices of the next five days in the list
  // from the API data (every day at 12:00 pm)
  const getDayIndices = (data )=> {
    let dayIndices = [];
    dayIndices.push(0);

    let index = 0;
    let tmp = data.list[index].dt_txt.slice(8, 10);

    for (let i = 0; i < 4; i++) {
      while (
        tmp === data.list[index].dt_txt.slice(8, 10) ||
        data.list[index].dt_txt.slice(11, 13) !== '15'
      ) {
        index++;
      }
      dayIndices.push(index);
      tmp = data.list[index].dt_txt.slice(8, 10);
    }
    return dayIndices;
  };


  const onKeypressHandler = async(e)=> {
    e.persist();
    const eventKey = e.which ? e.which : e.keyCode;
    const city = e.target.value;

    // check if input contains only letters after Enter was pressed
    if (eventKey === 13) {
      if (/^[a-zA-ZäöüÄÖÜß ]+$/.test(city)) {
       

        if (weatherApiCall(city))
         e.target.placeholder = 'Enter a City...';
        else e.target.placeholder = 'City was not found, try again...';
      } else e.target.placeholder = 'Please enter a valid city name...';
      
      e.target.value = '';
    }
  };
 
    const WeatherBoxes = () => {
      const weatherBoxes = days.slice(1).map(day => (
        <li>
          <FooterWeatherlist {...day} />
        </li>
      ));

      return <ul className='weather-box-list'>{weatherBoxes}</ul>;
    };

    return (
      <div className='App'>
         <LoadingOverlay
      active={loading}
      spinner
    
      fadeSpeed={10}
      text='Loading...'
      >
        <header className='App-header'>
       
          <MiddlePageWeather data={days[0]} city={city}>
            {/* <CityInput city={city} makeApiCall={makeApiCall} /> */}
            <input
        className='city-input'
        style={{
          top: city ? '-380px' : '-20px',
          width: '600px',
          display: 'inline-block',
          padding: '10px 0px 10px 30px',
          lineHeight: '120%',
          position: 'relative',
          borderRadius: '20px',
          outline: 'none',
          fontSize: '20px',
          transition: 'all 0.5s ease-out'
        }}
        type='text'
        placeholder='Enter a City...'
        onKeyPress={onKeypressHandler}
      />
            <WeatherBoxes />
          </MiddlePageWeather>
          
        </header>
        </LoadingOverlay>
      </div>
    );
  }


export default App;
