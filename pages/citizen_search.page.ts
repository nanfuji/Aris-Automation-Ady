import {
    Page,
    Locator,
    expect
} from '@playwright/test';

export class CitizenSearchPage {

    readonly page: Page;

    readonly citizensButton: Locator;
    readonly filterButton: Locator;
    readonly applyFilterButton: Locator;
    readonly lastNameFilterInput: Locator;

    readonly validIDTab: Locator;
    readonly photoSigTab: Locator;
    readonly relationshipTab: Locator;
    readonly addressTab: Locator;
    readonly proofOfBillingTab: Locator;
    readonly contactTab: Locator;
    readonly cardsTab: Locator;
    readonly otherInfoTab: Locator;

    readonly homeButton: Locator;
    readonly closeButton: Locator;

    readonly saveChangesButton: Locator;
    readonly saveButton: Locator;

    constructor(page: Page) {

        this.page = page;
        this.citizensButton = page.getByRole('button', { name: 'Citizens' });
        this.filterButton = page.getByRole('button', { name: 'Filter' });
        this.applyFilterButton = page.getByRole('button', { name: 'Apply Filter' });
        this.lastNameFilterInput = page.getByRole('textbox', { name: 'e.g. DELA CRUZ' });
        this.validIDTab = page.getByRole('tab', { name: 'Valid ID' });
        this.photoSigTab = page.getByRole('tab', { name: 'Photo & Sig' });
        this.relationshipTab = page.getByRole('tab', { name: 'Relationship' });
        this.addressTab = page.getByRole('tab', { name: 'Address' });
        this.proofOfBillingTab = page.getByRole('tab', { name: 'Proof of Billing' });
        this.contactTab = page.getByRole('tab', { name: 'Contact' });
        this.cardsTab = page.getByRole('tab', { name: 'Card' });
        this.otherInfoTab = page.getByRole('tab', { name: 'Other Info' });
        this.homeButton = page.locator('div').nth(4);
        this.closeButton = page.getByRole('button', { name: 'Close' });
        this.saveChangesButton = page.getByRole('button', { name: 'Save Changes' });
        this.saveButton = page.getByRole('button', { name: 'Save' });
    }

    async navigateToCitizens() {
        await this.citizensButton.waitFor();
        await this.citizensButton.click();
    }

    async clickHome() {
        await this.homeButton.waitFor();
        await this.homeButton.click();
    }

    async closeWindow() {
        await this.closeButton.waitFor();
        await this.closeButton.click();
    }

    async applyFilterByLastName(lastName: string) {
        await this.filterButton.click();
        await this.lastNameFilterInput.click();
        await this.lastNameFilterInput.fill(lastName);
        await this.applyFilterButton.click();
        await this.page.waitForTimeout(2000);
    }

    async verifySearchResult(expectedLastName: string) {
        await this.page.waitForTimeout(2000);

        const targetCell = this.page.getByRole('cell', { name: expectedLastName, exact: true }).first();

        await targetCell.waitFor({ state: 'visible', timeout: 10000 });
        await expect(targetCell).toBeVisible();

        const actualText = await targetCell.textContent();
        expect(actualText?.trim().toUpperCase()).toBe(expectedLastName.toUpperCase());

        console.log(`✓ Search result verified: Found "${expectedLastName}"`);
    }

    // async applyFilterByGender(gender: string) {
    //     await this.filterButton.click();
    //     await this.page.getByRole('button', { name: 'Open' }).first().click();
    //     await this.page.getByRole('option', { name: gender, exact: true }).click();
    //     await this.applyFilterButton.click();
    // }

    async openCitizenRecord(citizenName: string) {
        await this.page.getByRole('cell', { name: citizenName, exact: true }).first().click();
    }

    async openCitizenRecordByIndex(rowIndex: number) {
        await this.page.locator(`tr:nth-child(${rowIndex}) > td:nth-child(2)`).click();
    }

    async openCitizenRecordByCellIndex(cellIndex: number) {
        await this.page.getByRole('cell').nth(cellIndex).click();
    }

    async openValidIDTab() {
        await this.validIDTab.click();
    }

    async openPhotoSigTab() {
        await this.photoSigTab.click();
    }

    async openRelationshipTab() {
        await this.relationshipTab.click();
    }

    async openAddressTab() {
        await this.addressTab.click();
    }

    async openProofOfBillingTab() {
        await this.proofOfBillingTab.click();
    }

    async openContactTab() {
        await this.contactTab.click();
    }

    async openCardsTab() {
        await this.cardsTab.click();
    }

    async openOtherInfoTab() {
        await this.otherInfoTab.click();
    }

    async clickValidIDImage() {
        await this.page.getByRole('img').first().click();
    }

    async verifyRelationshipContainer() {
        await this.page.locator('.MuiGrid-root.MuiGrid-container.MuiGrid-direction-xs-row.MuiGrid-spacing-xs-4').waitFor({
            state: 'visible',
            timeout: 30000
        });
    }

    async verifyAddressComboboxes() {
        await this.page.getByRole('combobox', { name: 'Select an item...' }).first().waitFor({
            state: 'visible',
            timeout: 30000
        });
    }

    async verifyProofOfBillingCombobox() {
        await this.page.getByRole('combobox', { name: 'Select an item...' }).waitFor({
            state: 'visible',
            timeout: 30000
        });
    }

    async verifyContactFields() {
        await this.page.locator('input[name="mobileNos"]').waitFor({
            state: 'visible',
            timeout: 30000
        });
    }

    async verifyBasicInformationFields() {
        await this.page.getByRole('textbox', { name: 'e.g. JUAN' }).waitFor({
            state: 'visible',
            timeout: 30000
        });
    }

    async verifyCardInformation() {
        // Try multiple possible selectors
        const cardSelectors = [
            this.page.getByText(/ARIS Bayambang Card/i),
            this.page.getByText(/Card/i),
            this.page.locator('[class*="card"]'),
            this.page.locator('.MuiCard-root')
        ];
        
        let cardFound = false;
        
        for (const selector of cardSelectors) {
            try {
                await selector.first().waitFor({ 
                    state: 'visible', 
                    timeout: 8000 
                });
                cardFound = true;
                console.log('✓ Card information found');
                break;
            } catch (error) {
                continue;
            }
        }
        
        if (!cardFound) {
            throw new Error('Card information not found on the page. Tried multiple selectors.');
        }
    }

    async verifyOtherInfoComboboxes() {
        await this.page.getByRole('combobox').first().waitFor({
            state: 'visible',
            timeout: 30000
        });
    }

    async verifyPhotoSignatureImages() {
        await this.page.getByRole('img').first().waitFor({
            state: 'visible',
            timeout: 30000
        });
    }

    async saveChanges() {
        await this.saveChangesButton.click();
        await this.saveButton.click();
        await this.closeButton.click();
    }

    async enableEdit() {
        await this.page.getByRole('button', { name: 'Edit' }).first().click();
        await this.page.getByRole('button', { name: 'Yes, enable edit' }).click();
    }

    async editValidID() {
        await this.page.getByRole('button', { name: 'Edit' }).nth(1).click();
        await this.page.getByRole('button', { name: 'Yes, enable edit' }).click();
        await this.page.getByRole('button', { name: 'Edit' }).click();
        await this.page.getByRole('button').first().click();
        await this.page.getByRole('button', { name: 'Crop' }).click();
    }

    async editRelationship(firstName1: string, middleName1: string, lastName1: string, firstName2: string, middleName2: string, lastName2: string) {
        await this.page.getByRole('textbox', { name: 'e.g. JUAN', exact: true }).click();
        await this.page.getByRole('textbox', { name: 'e.g. JUAN', exact: true }).fill(firstName1);
        await this.page.locator('input[name="relationship.0.middleName"]').click();
        await this.page.locator('input[name="relationship.0.middleName"]').fill(middleName1);
        await this.page.locator('input[name="relationship.0.lastName"]').click();
        await this.page.locator('input[name="relationship.0.lastName"]').fill(lastName1);
        await this.page.getByRole('textbox', { name: 'e.g. JUANA' }).click();
        await this.page.getByRole('textbox', { name: 'e.g. JUANA' }).fill(firstName2);
        await this.page.locator('input[name="relationship.1.middleName"]').click();
        await this.page.locator('input[name="relationship.1.middleName"]').fill(middleName2);
        await this.page.locator('input[name="relationship.1.lastName"]').click();
        await this.page.locator('input[name="relationship.1.lastName"]').fill(lastName2);
    }

    async editAddress(
        country: string,
        province: string,
        municipality: string,
        barangay: string
    ) {
        await this.page.getByRole('button', { name: 'Open' }).first().click();
        await this.page.getByRole('option', { name: country }).click();
        await this.page.getByRole('button', { name: 'Open' }).nth(1).click();
        await this.page.getByRole('option', { name: province }).click();
        await this.page.getByRole('button', { name: 'Open' }).nth(3).click();
        await this.page.getByRole('option', { name: municipality }).click();
        await this.page.getByRole('button', { name: 'Open' }).nth(4).click();
        await this.page.getByRole('option', { name: barangay }).click();
    }

    async editProofOfBilling() {
        await this.page.getByRole('button', { name: 'Edit' }).nth(1).click();
        await this.page.getByRole('button', { name: 'Yes, enable edit' }).click();
        await this.page.getByRole('button', { name: 'Edit' }).click();
        await this.page.getByRole('button').first().click();
        await this.page.getByRole('button', { name: 'Crop' }).click();
    }

    async editBasicInformation(
        firstName: string, 
        lastName: string, 
        suffix: string, 
        birthdate: string, 
        gender: string, 
        civilStatus: string, 
        nationality: string, 
        birthPlace: string, 
        province: string, 
        municipality: string, 
    ) {
        await this.page.getByRole('textbox', { name: 'e.g. JUAN' }).click();
        await this.page.getByRole('textbox', { name: 'e.g. JUAN' }).fill(firstName);
        await this.page.getByRole('textbox', { name: 'e.g. DELA CRUZ' }).click();
        await this.page.getByRole('textbox', { name: 'e.g. DELA CRUZ' }).fill(lastName);
        await this.page.getByRole('textbox', { name: 'e.g. JR' }).click();
        await this.page.getByRole('textbox', { name: 'e.g. JR' }).fill(suffix);
        await this.page.getByRole('textbox', { name: 'MM/DD/YYYY' }).click();
        await this.page.getByRole('textbox', { name: 'MM/DD/YYYY' }).fill(birthdate);
        await this.page.getByRole('button', { name: 'Open' }).first().click();
        await this.page.getByRole('option', { name: gender, exact: true }).click();
        await this.page.getByRole('button', { name: 'Open' }).nth(1).click();
        await this.page.getByRole('option', { name: civilStatus }).click();
        await this.page.getByRole('button', { name: 'Open' }).nth(2).click();
        await this.page.getByRole('option', { name: nationality }).click();
        await this.page.getByRole('button', { name: 'Open' }).nth(3).click();
        await this.page.getByRole('option', { name: birthPlace, exact: true }).click();
        await this.page.getByRole('button', { name: 'Open' }).nth(4).click();
        await this.page.getByRole('option', { name: province }).click();
        await this.page.getByRole('button', { name: 'Open' }).nth(5).click();
        await this.page.getByRole('option', { name: municipality }).click();
    }

    async editOtherInfo(
        barangaySector: string,
        employmentStatus: string,
        registeredVoter: string,
        isPWD: string,
        isDependent: string,
        qFamily: string,
        hoaMembership: string
    ) {
        await this.page.getByRole('button', { name: 'Open' }).first().click();
        await this.page.getByRole('option', { name: barangaySector }).click();
        await this.page.getByRole('button', { name: 'Open' }).nth(1).click();
        await this.page.getByRole('option', { name: employmentStatus }).click();
        await this.page.getByRole('button', { name: 'Open' }).nth(2).click();
        await this.page.getByRole('option', { name: registeredVoter }).click();
        await this.page.getByRole('button', { name: 'Open' }).nth(3).click();
        await this.page.getByRole('option', { name: isPWD }).click();
        await this.page.getByRole('button', { name: 'Open' }).nth(4).click();
        await this.page.getByRole('option', { name: isDependent }).click();
        await this.page.getByRole('button', { name: 'Open' }).nth(5).click();
        await this.page.getByRole('option', { name: qFamily }).click();
        await this.page.locator('.MuiGrid-root > .MuiGrid-root.MuiGrid-container > div:nth-child(2) > .MuiFormControl-root.MuiFormControl-fullWidth.css-17qa0m8 > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root > .MuiAutocomplete-endAdornment > .MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeMedium.MuiAutocomplete-popupIndicator').click();
        await this.page.getByRole('option', { name: hoaMembership, exact: true }).click();
    }

    async editPhotoSignature() {
        await this.page.getByRole('button', { name: 'Edit' }).first().click();
        await this.page.getByRole('button', { name: 'Use Webcam' }).click();
        await this.page.getByRole('button', { name: 'Edit' }).nth(1).click();
        await this.page.getByRole('button', { name: 'Use Touchscreen' }).click();
}
}