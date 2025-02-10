import { expect, test } from "vitest";
import { BackgroundImagesCategories, filteredBackgroundImages } from "./weatherMappingService";

test('背景圖片應包含所有天氣類型(BackgroundImagesCategories)的圖片', () => {
    for(const category in BackgroundImagesCategories){
        expect(filteredBackgroundImages[category as BackgroundImagesCategories]).toBeDefined();
    };
});