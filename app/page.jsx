"use client";
import Image from "next/image";
import React from "react";
import searchIcon from "@public/assets/icons/search.png";
import sunIcon from "@public/assets/icons/clear.png";
import humidityIcon from "@public/assets/icons/humidity.png";
import windIcon from "@public/assets/icons/wind.png";
import { useState, useEffect, useRef } from "react";
import { stateList } from "@utils/utils.js";
import { dayjs } from "@utils/utils.js";
const Home = () => {
  const city = useRef();
  const [data, setData] = useState({});
  const [weatherOk, setWeatherOk] = useState(false);
  const [countries, setCountries] = useState([]);
  const [chosenCountry, setChosenCountry] = useState("United States");
  const [chosenState, setChosenState] = useState("CA");
  const [forecastWeather, setForecastWeather] = useState([]);
  const [showDesc, setShowDesc] = useState(false);
  const now = dayjs();

  useEffect(() => {
    const getAllCountries = async () => {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all");
        if (res.ok) {
          const list = await res.json();
          setCountries(() =>
            list.map((each) => ({ name: each.name.common, code: each.cca2 }))
          );
        }
      } catch (e) {}
    };
    getAllCountries();
  }, []);
  useEffect(() => {
    const getForecastWeather = async () => {
      const Weather_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${data.lat}&lon=${data.lon}&units=metric&appid=${process.env.NEXT_PUBLIC_WEATHER_API}`;
     
      try {
        const res = await fetch(Weather_API_URL);

        if (res.ok) {
          let checkDays = [];
          const fiveDays = await res.json();
          const newDays = fiveDays.list
            .filter((eachDay) => {
              if (
                !checkDays.includes(eachDay.dt_txt.split(" ")[0]) &&
                eachDay.dt_txt.split(" ")[0] !== now.format("YYYY-MM-DD")
              ) {
                checkDays.push(eachDay.dt_txt.split(" ")[0]);
                return true;
              }
              return false;
            })
            .map((dayInfo) => ({
              date: dayInfo.dt_txt.split(" ")[0],
              temp: Math.floor(dayInfo.main.temp),
              humidity: dayInfo.main.humidity,
              windSpeed: dayInfo.wind.speed,
              iconCode: dayInfo.weather[0].icon,
            }));
          setForecastWeather(() => newDays);
        }
      } catch (e) {
        alert(Weather_API_URL);
      }
    };
    if (data.lat && data.lon) {
      getForecastWeather();
    }
  }, [data]);
  const getWeatherData = async (city) => {
    if (city === "") {
      alert("Enter City Name");
      return;
    }
    if (city !== "") {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}${
            chosenCountry === "United States" ? `,${chosenState}` : ""
          },${chosenCountry}&units=metric&appid=${
            process.env.NEXT_PUBLIC_WEATHER_API
          }`
        );

        if (res.ok) {
          const currentData = await res.json();
          setData({
            temp: Math.floor(currentData.main.temp),
            humidity: currentData.main.humidity,
            windSpeed: currentData.wind.speed,
            location: currentData.name,
            iconCode: currentData.weather[0].icon,
            desc: currentData.weather[0].description,
            maxTemp: Math.floor(currentData.main.temp_max),
            minTemp: Math.floor(currentData.main.temp_min),
            lat: currentData.coord.lat,
            lon: currentData.coord.lon,
          });
          setWeatherOk(true);
        } else {
          setWeatherOk(false);
        }
      } catch (e) {
        alert("Something went wrong");
      }
    }
  };
  return (
    <section className="overflow-x-hidden">
      <div className="flex flex-col items-center justify-center w-full h-full gap-3">
        <h1 className="text-[2rem]">Hong An Weather App</h1>
        <div
          className="border-[1px] p-1 border-black bg-gray-100 hover:bg-gray-200 cursor-pointer active:bg-gray-300"
          onClick={(e) => {
            setShowDesc(!showDesc);
          }}
        >
          PM Accelerator description
        </div>
        {showDesc && (
          <p className="text-center w-[60%]">
            <p>
              The Product Manager Accelerator Program is designed to support PM
              professionals through every stage of their career. From students
              looking for entry-level jobs to Directors looking to take on a
              leadership role, our program has helped over hundreds of students
              fulfill their career aspirations.
            </p>
            <p>
              Our Product Manager Accelerator community are ambitious and
              committed. Through our program they have learnt, honed and
              developed new PM and leadership skills, giving them a strong
              foundation for their future endeavours.
            </p>
          </p>
        )}
        <div className="flex flex-row items-center gap-2">
          <div
            className="w-fit p-10 bg-gradient-to-b from-indigo-500 
      to-indigo-900 flex flex-col items-center rounded-[10px] gap-[2rem]"
          >
            <div className="flex flex-row justify-between w-full gap-2 relative">
              <input
                placeholder="Search"
                type="text"
                className="p-2 rounded-[20px] pl-3 "
                ref={city}
                defaultValue="Irvine"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    getWeatherData(city.current.value);
                  }
                }}
              />
              {chosenCountry === "United States" && (
                <select
                  className="flex flex-col w-fit relative"
                  onChange={(e) => {
                    setChosenState(e.target.value);
                  }}
                >
                  <option value="" selected>
                    California
                  </option>
                  {stateList &&
                    stateList.map((state) => (
                      <option
                        value={state.abbreviation}
                        key={state.abbreviation}
                      >
                        {state.name}
                      </option>
                    ))}
                </select>
              )}
              <select
                className="flex flex-col w-[10rem] relative "
                onChange={(e) => {
                  setChosenCountry(e.target.value);
                }}
              >
                <option value="" selected>
                  United States
                </option>
                {countries &&
                  countries.map((country) => (
                    <option value={country.name} key={country.code}>
                      {country.name}
                    </option>
                  ))}
              </select>

              <div
                className="bg-white p-3 rounded-full flex items-center justify-center cursor-pointer"
                onClick={(e) => {
                  getWeatherData(city.current.value);
                }}
              >
                <Image src={searchIcon} className="w-[0.9rem]" />
              </div>
            </div>
            {weatherOk && (
              <div className="flex flex-col items-center w-full">
                <div className="flex flex-col items-center text-white">
                  <div>
                    <Image
                      src={`https://openweathermap.org/img/wn/${data.iconCode}@2x.png`}
                      width={150}
                      height={150}
                    />
                  </div>
                  <div className="flex flex-col font-bold items-center text-center">
                    <div className="flex flex-col items-center text-center w-full">
                      <span className="text-[3rem] m-0 p-0">{data.temp}°C</span>
                      <span className="text-[1rem] m-0 p-0">{data.desc}</span>
                      <p className="flex flex-row items-center justify-between w-full ">
                        <span className="text-[1rem] m-0 p-0">
                          H: {data.maxTemp}°C
                        </span>
                        <span className="text-[1rem] m-0 p-0">
                          L: {data.minTemp}°C
                        </span>
                      </p>
                    </div>
                    <span className="text-[1.5rem]">My Location</span>
                    <span className="text-[1rem] m-0 p-0">{data.location}</span>
                  </div>
                </div>
                <div className="flex flex-row justify-between text-white w-full mt-[3rem]">
                  <div className="flex flex-row">
                    <div>
                      <Image
                        src={humidityIcon}
                        className="w-[1rem] h-[1rem] m-1 mt-2"
                      />
                    </div>
                    <div className="p-0 ">
                      <p>{data.humidity}%</p>
                      <p>Humidity</p>
                    </div>
                  </div>
                  <div className="flex flex-row">
                    <div>
                      <Image
                        src={windIcon}
                        className="w-[1rem] h-[1rem] m-1 mt-2"
                      />
                    </div>
                    <div className="p-0">
                      <p>{data.windSpeed} Km/h</p>
                      <p>Wind Speed</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {forecastWeather.length !== 0 && weatherOk && (
            <div className="h-full flex flex-col items-start w-[40rem]">
              <ul className="flex-1 p-5 grid grid-cols-3 w-full gap-3">
                {forecastWeather.map((eachDay) => (
                  <li
                    className="text-white bg-gradient-to-b from-indigo-500 to-indigo-900 p-5 rounded-[10px] gap-2"
                    key={eachDay.date}
                  >
                    <h2>{eachDay.date}</h2>
                    <Image
                      src={`https://openweathermap.org/img/wn/${eachDay.iconCode}@2x.png`}
                      width={150}
                      height={150}
                    />
                    <h3>Temp: {eachDay.temp}°C</h3>
                    <h3>Wind: {eachDay.windSpeed}Km/h</h3>
                    <h3>Humidity: {eachDay.humidity}%</h3>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Home;
