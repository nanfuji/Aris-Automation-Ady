import { Page, Locator } from '@playwright/test';

export class CitizenSearchPage {
    readonly page: Page;
    readonly citizensButton: Locator;
    readonly filterButton: Locator;
    readonly applyFilterButton: Locator;
    readonly validIDTab: Locator;

    readonly homeButton: Locator;
    readonly closeButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.citizensButton = page.getByRole('button', { name: 'Citizens' });
        this.filterButton = page.getByRole('button', { name: 'Filter' });
        this.applyFilterButton = page.getByRole('button', { name: 'Apply Filter' });
        this.validIDTab = page.getByRole('tab', { name: 'Valid ID' });
        
        
        this.homeButton = page.locator('div').nth(4);
        this.closeButton = page.getByRole('button', { name: 'close' });
    }

    async navigateToCitizens() {
        await this.citizensButton.click();
    }

    
    async clickHome() {
        await this.homeButton.click();
    }

    async closeWindow() {
        await this.closeButton.click();
    }

    async applySingleFilter() {
        await this.filterButton.click();
        await this.page.getByRole('button', { name: 'Open' }).nth(1).click();
        await this.page.getByRole('option', { name: 'SINGLE' }).click();
        await this.applyFilterButton.click();
    }

    async openCitizenRecord(citizenName: string) {
        await this.page.getByRole('cell', { name: citizenName }).click();
    }

    async openValidIDTab() {
        await this.validIDTab.click();
    }

    async enableEdit() {
        await this.page.getByRole('button', { name: 'Edit' }).nth(1).click();
        await this.page.getByRole('button', { name: 'Yes, enable edit' }).click();
    }

    async editValidID() {
        await this.page.getByRole('button', { name: 'Edit' }).click();
        await this.page.getByRole('button').first().click();
        await this.page.locator('.cropper-face').click();
        await this.page.locator('.cropper-point.point-se').click();
        await this.page.locator('.cropper-drag-box').click();
        await this.page.getByRole('button', { name: 'Crop' }).click();
        await this.page.getByRole('button', { name: 'Save Changes' }).click();
        await this.page.getByRole('button', { name: 'Save' }).click();
        await this.page.getByRole('button', { name: 'Close' }).click();
    }
}