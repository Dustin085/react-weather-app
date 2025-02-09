/**
 * 全台縣市英文名稱(enum)
 */
enum CountryNamesEnum {
    Kaohsiung_City = 'Kaohsiung_City',
    NewTaipei_City = 'NewTaipei_City',
    Taipei_City = 'Taipei_City',
    Keelung_City = 'Keelung_City',
    Yilan_County = 'Yilan_County',
    Taichung_City = 'Taichung_City',
    Tainan_City = 'Tainan_City',
    Taoyuan_City = 'Taoyuan_City',
    Hsinchu_County = 'Hsinchu_County',
    Hsinchu_City = 'Hsinchu_City',
    Miaoli_County = 'Miaoli_County',
    Nantou_County = 'Nantou_County',
    Changhua_County = 'Changhua_County',
    Yunlin_County = 'Yunlin_County',
    Chiayi_County = 'Chiayi_County',
    Chiayi_City = 'Chiayi_City',
    Pingtung_County = 'Pingtung_County',
    Taitung_County = 'Taitung_County',
    Hualien_County = 'Hualien_County',
    Kinmen_County = 'Kinmen_County',
    Penghu_County = 'Penghu_County',
    Lienchiang_County = 'Lienchiang_County',
}

/**
 * 全台縣市中文名稱 (對應到CountryNamesEnum)
 */
const countryNameMapChinese = {
    [CountryNamesEnum.Kaohsiung_City]: '高雄市',
    [CountryNamesEnum.NewTaipei_City]: '新北市',
    [CountryNamesEnum.Taipei_City]: '臺北市',
    [CountryNamesEnum.Keelung_City]: '基隆市',
    [CountryNamesEnum.Yilan_County]: '宜蘭縣',
    [CountryNamesEnum.Taichung_City]: '臺中市',
    [CountryNamesEnum.Tainan_City]: '臺南市',
    [CountryNamesEnum.Taoyuan_City]: '桃園市',
    [CountryNamesEnum.Hsinchu_County]: '新竹縣',
    [CountryNamesEnum.Hsinchu_City]: '新竹市',
    [CountryNamesEnum.Miaoli_County]: '苗栗縣',
    [CountryNamesEnum.Nantou_County]: '南投縣',
    [CountryNamesEnum.Changhua_County]: '彰化縣',
    [CountryNamesEnum.Yunlin_County]: '雲林縣',
    [CountryNamesEnum.Chiayi_County]: '嘉義縣',
    [CountryNamesEnum.Chiayi_City]: '嘉義市',
    [CountryNamesEnum.Pingtung_County]: '屏東縣',
    [CountryNamesEnum.Taitung_County]: '臺東縣',
    [CountryNamesEnum.Hualien_County]: '花蓮縣',
    [CountryNamesEnum.Kinmen_County]: '金門縣',
    [CountryNamesEnum.Penghu_County]: '澎湖縣',
    [CountryNamesEnum.Lienchiang_County]: '連江縣',
}

/**
 * 全台縣市中文名稱清單
 */
export const countryNamesChinese = Object.values(countryNameMapChinese);

/**
 * 全台縣市中文名稱對應的英文名稱 (對應到CountryNamesEnum)
 */
export const reverseCountryNameMapChinese = Object.entries(countryNameMapChinese).reduce((acc, [key, value]) => {
    acc[value] = key as keyof typeof countryNameMapChinese;
    return acc;
}, {} as Record<string, keyof typeof countryNameMapChinese>);

/**
 * 各縣市的氣象觀測站代號，代號清單在README.md中 
 * */
export const countryNameToObservationStationId = {
    [CountryNamesEnum.Kaohsiung_City]: '467441',
    [CountryNamesEnum.NewTaipei_City]: '466881',
    [CountryNamesEnum.Taipei_City]: '466920',
    [CountryNamesEnum.Keelung_City]: '466940',
    [CountryNamesEnum.Yilan_County]: '467080',
    [CountryNamesEnum.Taichung_City]: '467490',
    [CountryNamesEnum.Tainan_City]: '467410',
    [CountryNamesEnum.Taoyuan_City]: '467050',
    [CountryNamesEnum.Hsinchu_County]: '467571',
    [CountryNamesEnum.Hsinchu_City]: '467571',
    [CountryNamesEnum.Miaoli_County]: '467280',
    [CountryNamesEnum.Nantou_County]: '467550',
    [CountryNamesEnum.Changhua_County]: '467270',
    [CountryNamesEnum.Yunlin_County]: '467290',
    [CountryNamesEnum.Chiayi_County]: '467480',
    [CountryNamesEnum.Chiayi_City]: '467480',
    [CountryNamesEnum.Pingtung_County]: '467590',
    [CountryNamesEnum.Taitung_County]: '467410',
    [CountryNamesEnum.Hualien_County]: '466990',
    [CountryNamesEnum.Kinmen_County]: '467110',
    [CountryNamesEnum.Penghu_County]: '467350',
    [CountryNamesEnum.Lienchiang_County]: '467990',
};

// console.log(`高雄市觀測站的站號是: ${countryNameToObservationStationId[reverseCountryNameMapChinese['高雄市']]}`);

// console.log(countryNamesChinese);

// const countryNamesObj: Record<CountryNamesEnum, string> = {} as Record<CountryNamesEnum, string>;

// for (const country in CountryNamesEnum) {
//     if (isNaN(Number(country))) continue;
//     countryNamesObj[Number(country) as CountryNamesEnum] = country;
// }

// const countryNamesArray = [];

// for (const country in CountryNamesEnum) {
//     if (isNaN(Number(country))) continue;
//     countryNamesArray[Number(country)] = country;
// }

// countryNamesArray[CountryNamesEnum.Kaohsiung_City] = '高雄市';
// countryNamesArray[CountryNamesEnum.NewTaipei_City] = '新北市';
// console.log(countryNamesArray);

// export const countryNames = [
//     '高雄市',
//     '新北市',
//     '臺北市',
//     '基隆市',
//     '宜蘭縣',
//     '臺中市',
//     '臺南市',
//     '桃園市',
//     '新竹縣',
//     '新竹市',
//     '苗栗縣',
//     '南投縣',
//     '彰化縣',
//     '雲林縣',
//     '嘉義縣',
//     '嘉義市',
//     '屏東縣',
//     '臺東縣',
//     '花蓮縣',
//     '金門縣',
//     '澎湖縣',
//     '連江縣',
// ];