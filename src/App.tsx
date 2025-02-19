import { Col, Container, Form, Row, Tab, Tabs } from 'react-bootstrap'
import pinThin from './assets/images/pin-thin.png';
import defaultBg from './assets/images/default-bg001.webp'
import './App.scss'
import { useEffect, useRef, useState } from 'react';
import { getWeatherBgUrlByCode, getWeatherIconUrlBycode } from './services/weatherMappingService';
import { countryNameMapChinese, countryNamesChinese as countryNames, countryNameToObservationStationId, isCountryNameValid, reverseCountryNameMapChinese } from './constants/countryNames';
import { logger } from './utils/logger';
import { ToastContainer } from 'react-toastify';
import { handleError } from './utils/errorHandler';
import { hanlePromiseToastify } from './utils/toastify';

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

interface WeatherObservationData {
  GeoInfo: Record<string, unknown>,
  ObsTime: {
    DateTime: string, // "ex. 2021-10-06T14:00:00+08:00"
  },
  StationId: string,
  StationName: string,
  WeatherElement: {
    AirPressure: number,
    AirTemperature: number,
    DailyExtreme: {
      DailyHigh: {
        AirTemperature: number,
        Occurred_at: {
          DateTime: string,
        }
      },
      DailyLow: {
        AirTemperature: number,
        Occurred_at: {
          DateTime: string,
        }
      }
    },
    RelativeHumidity: number,
    SunshineDuration: number,
    UVIndex: number,
    Weather: string,
    WindDirection: number,
    WindSpeed: number,
  }
}

function App() {
  // API相關設定
  const API_KEY = import.meta.env.VITE_API_URL;
  const API_AUTH = import.meta.env.VITE_API_AUTH;
  const API_ROUTE = {
    oneWeekPerTwelveHrs: 'F-D0047-091',
    weatherObservation: 'O-A0003-001',
  };

  // 使用者選擇的地點，依此取得氣象資料
  const [location, setLocation] = useState<string>(() => {
    const localStorageLocation = localStorage.getItem('locationSelected');
    if (!localStorageLocation) return countryNames[0];

    // 如果localStorageLocation是合法的地點名稱，則使用localStorage內的地點名稱
    if (isCountryNameValid(localStorageLocation)) return countryNameMapChinese[localStorageLocation];

    return countryNames[0];
  });

  // 七日天氣預報資料
  const [sevenDaysForecastData, setSevenDaysForecastData] = useState<DayWeatherData[] | null>(null);
  // 當前地點天氣觀測資料
  const [weatherObservationData, setWeatherObservationData] = useState<WeatherObservationData | null>(null);

  // 背景圖片URL
  const [bgUrl, setBgUrl] = useState(defaultBg);

  // 使用者選擇地點時的事件處理
  const handleLocationChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    localStorage.setItem('locationSelected', reverseCountryNameMapChinese[ev.target.value]);
    setLocation(ev.target.value);
  };

  // 地點選擇的ref，初始化使用
  const locationSelectRef = useRef<HTMLSelectElement>(null);

  // 初始化
  useEffect(() => {
    if (locationSelectRef.current) setLocation(locationSelectRef.current.value);

    // 預載背景圖片
    function preLoadImg(src: string) {
      const preLoadImg = new Image();
      preLoadImg.src = src;
    }
    preLoadImg(defaultBg);

    // css變數設定vh
    function setViewportHeight() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    window.addEventListener('resize', setViewportHeight);
    setViewportHeight();
    return () => { window.removeEventListener('resize', setViewportHeight); };
  }, []);

  // 設定背景圖片，包含預載圖片
  useEffect(() => {
    if (!sevenDaysForecastData) return;
    const preLoadImg = new Image();
    const newBgUrl = getWeatherBgUrlByCode(Number(sevenDaysForecastData[0].weatherCode));
    preLoadImg.src = newBgUrl;
    preLoadImg.onload = () => {
      setBgUrl(newBgUrl);
    };
  }, [sevenDaysForecastData]);

  // fetch氣象資料
  useEffect(() => {
    if (!location) { return };

    // 取得兩種天氣資料
    const promiseForSevenDaysForecastData = fetchSevenDaysForecastData(location);
    const promiseForWeatherObservationData = fetchWeatherObservationData(location);

    // 依照有無promise來處理toastify(無promise代表local有尚未過期的暫存資料)

    // 因為大部分使用者不會了解暫存的意思，可能會有所誤會，故須再考慮是否執行此通知
    // if (!promiseForSevenDaysForecastData && !promiseForWeatherObservationData) {
    //   toast.success('已使用本地暫存資料', { autoClose: 1500 });
    //   return;
    // };

    let promises: Promise<unknown> | undefined = undefined;
    if (promiseForSevenDaysForecastData && promiseForWeatherObservationData) {
      promises = Promise.all([promiseForSevenDaysForecastData, promiseForWeatherObservationData]);
    } else {
      promises = promiseForSevenDaysForecastData || promiseForWeatherObservationData;
    }
    if (!promises) return;
    hanlePromiseToastify(promises, {
      pending: '更新天氣資料中...',
      success: '成功更新天氣資料',
    });

    /**
     *  取得當前地點的天氣觀測資料，localStorage 或 中央氣象署API
     * @param location - 地點
     * @returns API取得資料的promise | undefined
     */
    function fetchWeatherObservationData(location: string) {
      // 檢查localstorage是否有資料，且是否過期
      const localWeatherObservationData = localStorage.getItem(`${reverseCountryNameMapChinese[location]}_weatherObservationData`);
      if (localWeatherObservationData) {
        try {
          const localDataJson = JSON.parse(localWeatherObservationData) as { weatherObservationData: WeatherObservationData, expireTime: string };
          if (localDataJson.weatherObservationData && localDataJson.expireTime) {
            if (new Date(localDataJson.expireTime).getTime() > new Date().getTime()) {
              logger('WeatherObservationData local資料有效期限: ' + new Date(localDataJson.expireTime).toLocaleString());
              setWeatherObservationData(localDataJson.weatherObservationData);
              return;
            }
          }
        } catch (error) {
          handleError(error);
        }
      }
      // 使用氣象局api取得當前地點的天氣觀測資料
      logger(`fetching ${location} today weather observation data`);
      let promiseForWeatherObservationData: Promise<unknown> | undefined = undefined;
      try {
        promiseForWeatherObservationData = fetch(API_KEY + API_ROUTE.weatherObservation + '?' + 'Authorization=' + API_AUTH + '&StationId=' + countryNameToObservationStationId[reverseCountryNameMapChinese[location]])
          .then(res => res.json())
          .then(result => {
            if (!result.success) { throw Error('成功取得預報資料，但預報資料被標註為未完成'); };
            const data = result.records.Station[0] as WeatherObservationData;
            logger(data);
            setWeatherObservationData(data);

            const numOfPreserveHours = 1;
            const HOUR_TO_MILLISECOND = 3600000;
            localStorage.setItem(`${reverseCountryNameMapChinese[location]}_weatherObservationData`, JSON.stringify({ weatherObservationData: data, expireTime: new Date(Date.now() + numOfPreserveHours * HOUR_TO_MILLISECOND).toISOString() }));
          });

      } catch (error) {
        handleError(error);
      }
      return promiseForWeatherObservationData;
    }

    /**
     * 取得七日天氣預報資料，localStorage 或 中央氣象署API
     * @param location - 地點
     * @returns API取得資料的promise | undefined
     */
    function fetchSevenDaysForecastData(location: string) {
      // 檢查localstorage是否有資料，且是否過期
      const localSevenDaysForecastData = localStorage.getItem(`${reverseCountryNameMapChinese[location]}_sevenDaysForecastData`);
      if (localSevenDaysForecastData) {
        try {
          const localDataJson = JSON.parse(localSevenDaysForecastData) as { dayWeatherData: DayWeatherData[], expireTime: string };
          if (localDataJson.dayWeatherData.length > 0 && localDataJson.expireTime) {
            if (new Date(localDataJson.expireTime).getTime() > new Date().getTime()) {
              logger('sevenDaysForecastData local資料有效期限: ' + new Date(localDataJson.expireTime).toLocaleString());
              setSevenDaysForecastData(localDataJson.dayWeatherData.map((ele) => {
                return { ...ele, date: new Date(ele.date) };
              }));
              return;
            }
          }
        } catch (error) {
          handleError(error);
        }
      };

      // 使用氣象局api取得七日天氣預報
      logger(`fetching ${location} 7 days forecast data`);
      let promiseForSevenDaysForecastData: Promise<unknown> | undefined = undefined;
      try {
        promiseForSevenDaysForecastData = fetch(API_KEY + API_ROUTE.oneWeekPerTwelveHrs + '?' + 'Authorization=' + API_AUTH + '&LocationName=' + location + '&ElementName=天氣現象,最低溫度,最高溫度')
          .then(res => res.json())
          .then(result => {
            if (!result.success) { throw Error('成功取得預報資料，但預報資料被標註為未完成'); };
            const data = result.records.Locations[0].Location[0].WeatherElement as WeatherElement<"最高溫度" | "最低溫度" | "天氣現象">[];
            // 取得預報的日期，已知日期會有序排列，末段的filter是為了刪除重複元素
            const dates = data[0].Time.map(ele => new Date(ele.StartTime).getDate()).filter((value, index, arr) => arr[index + 1] != value);

            const dayWeatherData: DayWeatherData[] = dates.map((date) => {
              const sevenDaysForecastData = data.find(ele => ele.ElementName === '天氣現象') as WeatherElement<"天氣現象">;
              const weatherThisDay = sevenDaysForecastData.Time.find(time => new Date(time.StartTime).getDate() === date)?.ElementValue[0].Weather;

              const weatherCode = sevenDaysForecastData.Time.find(time => new Date(time.StartTime).getDate() === date)?.ElementValue[0].WeatherCode;

              const maxTData = data.find(ele => ele.ElementName === '最高溫度') as WeatherElement<"最高溫度">;
              const maxT = maxTData.Time.filter(time => new Date(time.StartTime).getDate() === date).reduce((acc, cur, _index, arr) => Math.floor((Number(cur.ElementValue[0].MaxTemperature)) / arr.length) + acc, 0);

              const minTData = data.find(ele => ele.ElementName === '最低溫度') as WeatherElement<"最低溫度">;
              const minT = minTData.Time.filter(time => new Date(time.StartTime).getDate() === date).reduce((acc, cur, _index, arr) => Math.floor((Number(cur.ElementValue[0].MinTemperature)) / arr.length) + acc, 0);

              return {
                date: new Date(data[0].Time.find(time => { return new Date(time.StartTime).getDate() === date })?.StartTime as string),
                weather: weatherThisDay ?? '無法取得天氣資料',
                weatherCode: weatherCode ?? '無法取得天氣代碼',
                maxTemperature: maxT.toString(),
                minTemperature: minT.toString(),
              }
            });

            setSevenDaysForecastData(dayWeatherData);

            // 儲存至localStorage
            const localDayWeatherData = {
              dayWeatherData: dayWeatherData,
              expireTime: data[0].Time[0].EndTime,
            };
            localStorage.setItem(`${reverseCountryNameMapChinese[location]}_sevenDaysForecastData`, JSON.stringify(localDayWeatherData));

          });
      } catch (error) {
        handleError(error);
      }

      return promiseForSevenDaysForecastData;
    }


  }, [API_AUTH, API_KEY, API_ROUTE.oneWeekPerTwelveHrs, API_ROUTE.weatherObservation, location]);

  useEffect(() => {
    logger('7 days forecast data:', sevenDaysForecastData);
  }, [sevenDaysForecastData]);

  useEffect(() => {
    logger('weather observation data:', weatherObservationData);
  }, [weatherObservationData]);

  return (
    <>
      <div
        className="root-wrap"
        style={{
          backgroundImage: `url(${bgUrl})`,
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
                <div className="select-wrap my-3 mx-auto" style={{ width: '80%' }}>
                  <img src={pinThin} alt="" className="icon" />
                  <Form.Select className='w-100' style={{ height: '34px' }} onChange={(ev) => { handleLocationChange(ev) }} ref={locationSelectRef} value={location}>
                    {countryNames.map(cuntry => <option key={cuntry} value={cuntry}>{cuntry}</option>)}
                  </Form.Select>
                </div>
                <div className='flex-grow-1 d-flex flex-column justify-content-center align-items-center'>
                  <h2 className='hero-title'>{weatherObservationData && weatherObservationData.WeatherElement.AirTemperature + '°C'}</h2>
                  <div className='weather-info'>{sevenDaysForecastData && sevenDaysForecastData[0].weather}</div>
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
                  defaultActiveKey="7daysForecast"
                  className='weather-forecast-tabs mb-3'
                  id="justify-tab-example"
                  variant='pills'
                  justify
                  style={{
                    width: '80%'
                  }}
                >
                  <Tab eventKey="7daysForecast" title="7日預報">
                    <ul className='d-flex flex-column gap-2 justify-content-evenly h-100'>
                      {
                        sevenDaysForecastData && sevenDaysForecastData.map(dayData => <li key={dayData.date.getDate()}><WeatherForecastCard data={dayData} /></li>)
                      }
                    </ul>
                  </Tab>
                  <Tab eventKey="weatherObservation" title="今日綜合">
                    {weatherObservationData &&
                      (
                        <div className='d-flex flex-column gap-2 justify-content-evenly h-100' style={{ width: '80%', margin: '0 auto' }}>
                          <div>{'觀測自: ' + weatherObservationData.StationName + '站' + `(站號${weatherObservationData.StationId})`}</div>
                          <div>{'觀測時間: ' + new Date(weatherObservationData.ObsTime.DateTime).toLocaleString(undefined, {
                            month: 'short',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</div>
                          <div>{'相對溼度: ' + weatherObservationData.WeatherElement.RelativeHumidity + '%'}</div>
                          <div>{'氣溫: ' + weatherObservationData.WeatherElement.AirTemperature + '°C'}</div>
                          <div>{'氣壓: ' + weatherObservationData.WeatherElement.AirPressure + '百帕'}</div>
                          <div>{'紫外線指數: ' + weatherObservationData.WeatherElement.UVIndex}</div>
                        </div>
                      )
                    }
                  </Tab>
                </Tabs>
              </div>
            </Col>
          </Row>
        </Container>
        <ToastContainer position='bottom-center' />
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
