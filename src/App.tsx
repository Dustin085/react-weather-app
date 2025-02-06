import { Col, Container, Form, Row, Tab, Tabs } from 'react-bootstrap'
import pinThin from './assets/images/pin-thin.png';
import defaultBg from './assets/images/default-bg001.webp'
import './App.scss'
import { useEffect, useRef, useState } from 'react';
import { getWeatherBgUrlByCode, getWeatherIconUrlBycode } from './services/weatherMappingService';
import { countryNames } from './constants/countryNames';

interface WeatherElement<ElementName extends "最高溫度" | "最低溫度" | "天氣現象"> {
  ElementName: ElementName,
  Time: Array<{ ElementValue: ElementValueType<ElementName>, EndTime: string, StartTime: string }>
}

type ElementValueType<T extends "最高溫度" | "最低溫度" | "天氣現象"> =
  T extends "天氣現象" ? Array<{ Weather: string, WeatherCode: string }> :
  T extends "最低溫度" ? Array<{ MinTemperature: string }> :
  T extends "最高溫度" ? Array<{ MaxTemperature: string }> : never;

interface DayWeatherData {
  date: Date,
  weather: string,
  weatherCode: string,
  maxTemperature: string,
  minTemperature: string,
}

function App() {
  const API_KEY = import.meta.env.VITE_API_URL;
  const API_AUTH = import.meta.env.VITE_API_AUTH;
  const API_ROUTE = {
    oneWeekPerTwelveHrs: 'F-D0047-091',
    weatherObservation: 'O-A0003-001',
  };
  const [weatherData, setWeatherData] = useState<DayWeatherData[] | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const handleLocationChange = (ev: React.ChangeEvent<HTMLSelectElement>) => { setLocation(ev.target.value); };
  const locationSelectRef = useRef<HTMLSelectElement>(null);

  // const DEMO_DAY_WEATHER_DATA: DayWeatherData = {
  //   date: new Date(),
  //   weather: '大雨',
  //   weatherCode: '11',
  //   maxTemperature: '16',
  //   minTemperature: '9',
  // }

  // 初始化
  useEffect(() => {
    if (locationSelectRef.current) setLocation(locationSelectRef.current.value);
  }, []);

  useEffect(() => {
    if (location) {
      console.log(`fetching ${location} weather data`);
      try {
        fetch(API_KEY + API_ROUTE.oneWeekPerTwelveHrs + '?' + 'Authorization=' + API_AUTH + '&LocationName=' + location + '&ElementName=天氣現象,最低溫度,最高溫度')
          .then(res => res.json())
          .then(result => {
            if (!result.success) { throw Error('成功取得預報資料，但預報資料被標註為未完成'); };
            const data = result.records.Locations[0].Location[0].WeatherElement as WeatherElement<"最高溫度" | "最低溫度" | "天氣現象">[];
            // 取得預報的日期，已知日期會有序排列，末段的filter是為了刪除重複元素
            const dates = data[0].Time.map(ele => new Date(ele.StartTime).getDate()).filter((value, index, arr) => arr[index + 1] != value);
            // const dayNoDup = dates.filter((value, index, arr) => arr[index + 1] != value);
            // console.log(dates);
            const dayWeatherData: DayWeatherData[] = dates.map((date) => {
              const weatherData = data.find(ele => ele.ElementName === '天氣現象') as WeatherElement<"天氣現象">;
              const weatherThisDay = weatherData.Time.find(time => new Date(time.StartTime).getDate() === date)?.ElementValue[0].Weather;
              const weatherCode = weatherData.Time.find(time => new Date(time.StartTime).getDate() === date)?.ElementValue[0].WeatherCode;
              const maxTData = data.find(ele => ele.ElementName === '最高溫度') as WeatherElement<"最高溫度">;
              const maxT = maxTData.Time.filter(time => new Date(time.StartTime).getDate() === date).reduce((acc, cur, _index, arr) => Math.floor((Number(cur.ElementValue[0].MaxTemperature)) / arr.length) + acc, 0);
              const minTData = data.find(ele => ele.ElementName === '最低溫度') as WeatherElement<"最低溫度">;
              const minT = minTData.Time.filter(time => new Date(time.StartTime).getDate() === date).reduce((acc, cur, _index, arr) => Math.floor((Number(cur.ElementValue[0].MinTemperature)) / arr.length) + acc, 0);
              // ?.Time.find(time => new Date(time.StartTime).getDate() === date)
              return {
                date: new Date(data[0].Time.find(time => { return new Date(time.StartTime).getDate() === date })?.StartTime as string),
                weather: weatherThisDay ? weatherThisDay : '無法取得天氣資料',
                weatherCode: weatherCode ? weatherCode : '無法取得天氣代碼',
                maxTemperature: maxT.toString(),
                minTemperature: minT.toString(),
              }
            });
            // console.log(dayWeatherData);
            setWeatherData(dayWeatherData);

          });
      } catch (error) {
        console.log(error);
      }
    }
  }, [API_AUTH, API_KEY, API_ROUTE.oneWeekPerTwelveHrs, location]);

  useEffect(() => {
    console.log('weather data:', weatherData);
  }, [weatherData]);

  return (
    <>
      <div
        className="root-wrap vh-100"
        style={{
          backgroundImage: `url(${weatherData ? getWeatherBgUrlByCode(Number(weatherData[0].weatherCode)) : defaultBg})`,
          borderRadius: '20px',
          transition: '.5s',
        }}
      >
        <Container
          className='app-wrap h-100 w-100 px-4'
          fluid
        >
          <Row style={{ height: '33%' }}>
            <Col className='col-12 p-3' >
              <div className="today-weather-wrap h-100 d-flex flex-column">
                {/* <Dropdown className='w-100 my-3'>
                  <Dropdown.Toggle className='mx-auto d-flex justify-content-between align-items-center' variant='custom-dropdown' size='sm' style={{ width: '80%' }}>
                    <span className='d-flex justify-content-between align-items-center'>
                      <img className='me-2' src={pinThin} alt="" style={{ height: '20px', width: '20px' }} />
                      <span>新北市</span>
                    </span>
                  </Dropdown.Toggle> */}
                <div className="select-wrap my-3 mx-auto" style={{ width: '80%' }}>
                  <img src={pinThin} alt="" className="icon" />
                  <Form.Select className='w-100' style={{ height: '34px' }} onChange={(ev) => { handleLocationChange(ev) }} ref={locationSelectRef} defaultValue={"高雄市"}>
                    {countryNames.map(cuntry => <option key={cuntry} value={cuntry}>{cuntry}</option>)}
                    {/* <option value="臺北市">臺北市</option>
                    <option value="新北市">新北市</option>
                    <option value="高雄市">高雄市</option> */}
                  </Form.Select>
                </div>
                {/* </Dropdown> */}
                <div className='flex-grow-1 d-flex flex-column justify-content-center align-items-center'>
                  <h2 className='hero-title'>{weatherData && Math.floor((Number(weatherData[0].minTemperature) + Number(weatherData[0].maxTemperature)) / 2) + '°C'}</h2>
                  <div className='weather-info'>{weatherData && weatherData[0].weather}</div>
                </div>
              </div>
            </Col>
          </Row>
          <div className='divider'></div>
          <Row style={{ height: '67%' }}>
            <Col className='col-12 p-3 h-100'>
              <div className="weather-forecast-tabs-wrap h-100 d-flex flex-column align-items-center">
                <h3 className='fw-bold mt-4 mb-3' style={{
                  letterSpacing: '.8rem',
                  marginRight: '-.8rem',
                }}>近日天氣預報</h3>
                <Tabs
                  defaultActiveKey="5days"
                  className='weather-forecast-tabs mb-3'
                  id="justify-tab-example"
                  variant='pills'
                  justify
                  style={{
                    width: '80%'
                  }}
                >
                  <Tab eventKey="5days" title="7日">
                    <ul className='d-flex flex-column gap-2'>
                      {
                        weatherData && weatherData.map(dayData => <li key={dayData.date.getDate()}><WeatherForecastCard data={dayData} /></li>)
                      }
                      {/* <li><WeatherForecastCard data={DEMO_DAY_WEATHER_DATA} /></li>
                      <li><WeatherForecastCard data={DEMO_DAY_WEATHER_DATA} /></li> */}
                    </ul>
                  </Tab>
                  <Tab eventKey="14days" title="14日">
                    Tab content for Profile
                  </Tab>
                  <Tab eventKey="30days" title="30日">
                    Tab content for Loooonger Tab
                  </Tab>
                </Tabs>
              </div>
            </Col>
          </Row>
        </Container>
      </div >
    </>
  )
}

function WeatherForecastCard({ data }: { data: DayWeatherData }) {
  return (
    <div className="weather-forecast-card">
      <div className="card-head">
        <picture className='weather-icon'>
          <img src={getWeatherIconUrlBycode(Number(data.weatherCode))} alt={data.weatherCode} />
        </picture>
      </div>
      <div className="card-body">
        <div className='date'>{data.date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) + `(${data.date.toLocaleDateString(undefined, { weekday: 'narrow' })})`}</div>
        <div className='weather-forecast'>{data.weather}</div>
      </div>
      <div className="card-footer">
        <div>{data.minTemperature}°</div>
        <div>{data.maxTemperature}°</div>
      </div>
    </div>
  )
}

export default App
