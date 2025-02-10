import { describe, expect, test } from "vitest";
import { BackgroundImagesCategories, filteredBackgroundImages, getWeatherBgUrlByCode, getWeatherIconUrlBycode } from "./weatherMappingService";
import rainyIcon from '../assets/images/weather-icon/rainy001.svg';
import errorImg from '../assets/images/broken-image.svg';

test('背景圖片應包含所有天氣類型(BackgroundImagesCategories)的圖片', () => {
    for (const category in BackgroundImagesCategories) {
        expect(filteredBackgroundImages[category as BackgroundImagesCategories]).toBeDefined();
    };
});

describe('getWeatherIconUrlBycode是否正確運作', () => {
    test('code 12 回傳 rainyIcon', () => {
        expect(getWeatherIconUrlBycode(12)).toBe(rainyIcon);
    });

    test('不存在的 code 99 回傳 errorImg', () => {
        expect(getWeatherIconUrlBycode(99)).toBe(errorImg);
    });
});

describe('getWeatherBgUrlByCode是否正確運作', () => {
    test('code 12 回傳其中一張rainy背景圖', () => {
        expect(getWeatherBgUrlByCode(12)).toBeOneOf(filteredBackgroundImages.rainy);
    });

    test('code 3 回傳其中一張clear背景圖', () => {
        expect(getWeatherBgUrlByCode(3)).toBeOneOf(filteredBackgroundImages.clear);
    });

    test('不存在的 code 99 回傳 errorImg', () => {
        expect(getWeatherBgUrlByCode(99)).toBe(errorImg);
    });
});
