import { expect, test } from 'vitest'
import { countryNameMapChinese, CountryNamesEnum, countryNameToObservationStationId, isCountryNameValid, reverseCountryNameMapChinese } from './countryNames'

test('縣市中文名稱對應英文名稱的對照表應該要正常處理', () => {
    expect(reverseCountryNameMapChinese[countryNameMapChinese[CountryNamesEnum.Changhua_County]]).toBe(CountryNamesEnum.Changhua_County);
});

test('isCountryNameValid應該要能正確辨識輸入的參數是否為有效的coutryName', () => {
    expect(isCountryNameValid(CountryNamesEnum.Changhua_County)).toBe(true);
    expect(isCountryNameValid('倫敦')).toBe(false);
});

test('高雄的氣象觀測站站號是467441', () => {
    expect(countryNameToObservationStationId[CountryNamesEnum.Kaohsiung_City]).toBe('467441');
});

test('countryNameMapChinese和countryNameToObservationStationId應該要枚舉CountryNamesEnum內的每一項', () => {
    for (const country in CountryNamesEnum) {
        expect(countryNameMapChinese[country as CountryNamesEnum]).toBeDefined();
        expect(countryNameToObservationStationId[country as CountryNamesEnum]).toBeDefined();
    };
});