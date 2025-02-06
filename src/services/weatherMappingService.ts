import errorImg from '../assets/images/broken-image.svg';
// icon import
import rainyIcon from '../assets/images/weather-icon/rainy001.svg';
import clearIcon from '../assets/images/weather-icon/clear001.svg';
import cloudyIcon from '../assets/images/weather-icon/cloudy001.svg';
import thunderStormIcon from '../assets/images/weather-icon/thunder-storm001.svg';
import fogIcon from '../assets/images/weather-icon/foggy001.svg';
import snowIcon from '../assets/images/weather-icon/snowy001.svg';
// background import
import clearBg001 from '../assets/images/weather/clear001.jpg';
import clearBg002 from '../assets/images/weather/clear002.jpg';
import rainyBg001 from '../assets/images/weather/rainy001.jpg';
import rainyBg002 from '../assets/images/weather/rainy002.jpg';
import cloudyBg001 from '../assets/images/weather/cloudy001.jpg';
import cloudyBg002 from '../assets/images/weather/cloudy002.jpg';
import cloudyBg003 from '../assets/images/weather/cloudy003.jpg';
import thunderBg001 from '../assets/images/weather/thunder001.jpg';
import fogBg001 from '../assets/images/weather/fog001.jpg';
import snowBg001 from '../assets/images/weather/snow.jpg';

export enum WeatherType {
    notFound = 0,
    clear,
    mostlyClear,
    partlyClear,
    partlyCloudy,
    cloudy,
    occasionalRainy,
    rainy,
    thunderShower,
    thunderStorm,
    snow,
    fog,
    localRain,
}

// 可參照氣象代碼 https://www.cwa.gov.tw/V8/assets/pdf/Weather_Icon.pdf
const WeatherCode = new Map<WeatherType, number[]>([
    [WeatherType.clear, [1]],
    [WeatherType.mostlyClear, [2]],
    [WeatherType.partlyClear, [3]],
    [WeatherType.partlyCloudy, [4]],
    [WeatherType.cloudy, [5, 6, 7]],
    [WeatherType.occasionalRainy, [8, 9, 10, 11, 19, 20, 21, 22, 37, 38]],
    [WeatherType.rainy, [12, 13, 14, 39]],
    [WeatherType.thunderShower, [15, 16, 33, 34, 35, 36, 41]],
    [WeatherType.thunderStorm, [17, 18]],
    [WeatherType.snow, [23, 42]],
    [WeatherType.fog, [24, 25, 26, 27, 28]],
    [WeatherType.localRain, [29, 30, 31, 32]],
]);

const codeToWeatherType = new Map<number, WeatherType>();
WeatherCode.forEach((codes, weatherType) => {
    codes.forEach((code) => codeToWeatherType.set(code, weatherType));
});

const typeToWeatherIconUrl = new Map<WeatherType, string>([
    [WeatherType.notFound, errorImg],
    [WeatherType.clear, clearIcon],
    [WeatherType.mostlyClear, clearIcon],
    [WeatherType.partlyClear, clearIcon],
    [WeatherType.partlyCloudy, cloudyIcon],
    [WeatherType.cloudy, cloudyIcon],
    [WeatherType.occasionalRainy, rainyIcon],
    [WeatherType.rainy, rainyIcon],
    [WeatherType.thunderShower, thunderStormIcon],
    [WeatherType.thunderStorm, thunderStormIcon],
    [WeatherType.snow, snowIcon],
    [WeatherType.fog, fogIcon],
    [WeatherType.localRain, rainyIcon],
]);

const typeToWeatherBgUrl = new Map<WeatherType, string[]>([
    [WeatherType.notFound, [errorImg]],
    [WeatherType.clear, [clearBg001, clearBg002]],
    [WeatherType.mostlyClear, [clearBg001, clearBg002]],
    [WeatherType.partlyClear, [clearBg001, clearBg002]],
    [WeatherType.partlyCloudy, [cloudyBg001, cloudyBg002, cloudyBg003]],
    [WeatherType.cloudy, [cloudyBg001, cloudyBg002, cloudyBg003]],
    [WeatherType.occasionalRainy, [rainyBg001, rainyBg002]],
    [WeatherType.rainy, [rainyBg001, rainyBg002]],
    [WeatherType.thunderShower, [thunderBg001]],
    [WeatherType.thunderStorm, [thunderBg001]],
    [WeatherType.snow, [snowBg001]],
    [WeatherType.fog, [fogBg001]],
    [WeatherType.localRain, [rainyBg001, rainyBg002]],
]);

export function getWeatherIconUrlBycode(code: number): string {
    return typeToWeatherIconUrl.get(codeToWeatherType.get(code) ?? WeatherType.notFound) ?? errorImg;
}

export function getWeatherBgUrlByCode(code: number): string {
    const url = typeToWeatherBgUrl.get(codeToWeatherType.get(code) ?? WeatherType.notFound) ?? [errorImg];
    return url[Math.floor(Math.random() * url.length)];
}

// const DEMO_DAY_WEATHER_DATA: DayWeatherData = {
//   date: new Date(),
//   weather: '大雨',
//   weatherCode: '11',
//   maxTemperature: '16',
//   minTemperature: '9',
// }