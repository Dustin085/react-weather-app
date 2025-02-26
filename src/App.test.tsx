import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import App from "./App";
import { CountryNamesEnum } from "./constants/countryNames";

describe('App元件測試', () => {
    beforeEach(() => {
        render(<App />);
        localStorage.clear();
    });

    afterEach(() => {
        // 清除所有DOM
        cleanup();
    });

    test('App元件應該要正常渲染', () => {
        expect(screen.getByText('高雄市')).toBeTruthy();
    });


    test('應該要可以正常切換地區選單到新北市', () => {
        const locationSelectEle = screen.getByRole('combobox');
        fireEvent.change(locationSelectEle, { target: { value: '新北市' } });
        expect(screen.getByText('新北市')).toBeTruthy();
    });

    test('應該要在localStorage儲存有新北市的天氣資料', async () => {
        const locationSelectEle = screen.getByRole('combobox');
        fireEvent.change(locationSelectEle, { target: { value: '高雄市' } });
        fireEvent.change(locationSelectEle, { target: { value: '新北市' } });
        // waitFor會等待UI更新，確保api請求完成
        await waitFor(() => {
            expect(localStorage.getItem(CountryNamesEnum.NewTaipei_City + '_sevenDaysForecastData')).toBeTruthy();
        }, { timeout: 3000 });
    });
});