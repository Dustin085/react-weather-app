import rainyIcon from '../assets/images/weather-icon/rainy001.svg';
import clearIcon from '../assets/images/weather-icon/clear001.svg';
import cloudyIcon from '../assets/images/weather-icon/cloudy001.svg';
import thunderStormIcon from '../assets/images/weather-icon/thunder-storm001.svg';
import fogIcon from '../assets/images/weather-icon/foggy001.svg';
import snowIcon from '../assets/images/weather-icon/snowy001.svg';
import errorImg from '../assets/images/broken-image.svg'

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

export const codeToWeatherType = new Map<number, WeatherType>();
WeatherCode.forEach((codes, weatherType) => {
    codes.forEach((code) => codeToWeatherType.set(code, weatherType));
});

export const typeToWeatherIconUrl = new Map<WeatherType, string>([
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

export function getWeatherIconUrlBycode(code: number): string {
    return typeToWeatherIconUrl.get(codeToWeatherType.get(code) ?? WeatherType.notFound) ?? errorImg;
    // const weatherType = codeToWeatherType.get(code);
    // if (weatherType) {
    //     const iconUrl = typeToWeatherIconUrl.get(weatherType);
    //     if (iconUrl) return iconUrl;
    // };

    // return 'icon error url';
}

// export function getWeatherTypeByCode(code: number): WeatherType | undefined {
//     for (const [key, value] of WeatherCode) {
//         if (value.includes(code)) return key;
//     }
//     return undefined;
// }