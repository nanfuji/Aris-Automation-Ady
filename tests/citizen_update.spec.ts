import {
    test,
    expect,
    BrowserContext,
    Page
} from '@playwright/test';

import { LoginPage } from '../pages/login.page';
import { CitizenSearchPage } from '../pages/citizen_search.page';

let context: BrowserContext;
let page: Page;
let loginCompleted = false;

// test.describe('Citizen Search Functionality', () => {

    // ======================================================
    // LOGIN ONCE
    // ======================================================

    test.beforeAll(async ({ browser }) => {
        if (!loginCompleted) {
            console.log('Starting browser and logging in...');
            context = await browser.newContext();
            page = await context.newPage();

            const loginPage = new LoginPage(page, context);

            await loginPage.navigate();
            await loginPage.login('adnan@mailinator.com', 'P@ssw0rd');
            await expect(page).not.toHaveURL('https://sit-bayambang.aris.ph/sign-in');
            await page.waitForLoadState('networkidle');
            loginCompleted = true;
            console.log('Login completed successfully');
        }
    });

    // ======================================================
    // BACK TO DASHBOARD BEFORE EACH TEST
    // ======================================================

    test.beforeEach(async () => {
        // Skip if page is not available
        if (!page || page.isClosed()) {
            console.log('Page is closed, cannot reset state');
            return;
        }
        
        console.log('Resetting to dashboard before test...');
        const citizenSearchPage = new CitizenSearchPage(page);

        try { 
            // Try to click home button
            await citizenSearchPage.clickHome();
            await page.waitForLoadState('networkidle');
            console.log('Successfully returned to dashboard');
        } catch (error) {
            console.log('Could not click home button, navigating directly...');
            try {

                await page.goto('https://sit-bayambang.aris.ph');
                await page.waitForLoadState('networkidle');
                console.log('Successfully navigated to dashboard');
            } catch (navError) {
                console.log('Failed to navigate to dashboard:', navError);

            }
        }
        
        await page.waitForTimeout(1000);
    });

    // ======================================================
    // AFTER EACH TEST - Always return to dashboard, even after failure
    // ======================================================

    test.afterEach(async () => {
        console.log('After test cleanup - returning to dashboard...');
        
        // Skip if page is not available
        if (!page || page.isClosed()) {
            console.log('Page is closed, skipping cleanup');
            return;
        }
        
        try {
            await returnToDashboard();
            console.log('Successfully returned to dashboard after test');
        } catch (error) {
            console.log('Failed to return to dashboard after test:', error);
            // Last resort: navigate directly to home
            try {
                await page.goto('https://sit-bayambang.aris.ph');
                await page.waitForLoadState('networkidle');
                console.log('Navigated directly to dashboard as fallback');
            } catch (navError) {
                console.log('Could not navigate to dashboard even as fallback');
            }
        }
        
        await page.waitForTimeout(1000);
    });

    async function returnToDashboard() {
        const citizenSearchPage = new CitizenSearchPage(page);
        
        try { 
            await citizenSearchPage.clickHome();
            await page.waitForLoadState('networkidle');
            console.log('Clicked home button');
        } catch (error) {
            console.log('Could not click home button, trying navigation...');
            try {
                await page.goto('https://sit-bayambang.aris.ph');
                await page.waitForLoadState('networkidle');
                console.log('Navigated to dashboard');
            } catch (navError) {
                console.log('Failed to navigate to dashboard');
                throw navError;
            }
        }
    }
// });

    // ======================================================
    // TEST 1 - Valid ID
    // ======================================================

    test('Citizen Update - Edit Valid ID', async () => {
        const citizenSearchPage = new CitizenSearchPage(page);


        await citizenSearchPage.navigateToCitizens();
        await citizenSearchPage.applyFilterByLastName('DURANT');
        await citizenSearchPage.verifySearchResult('DURANT');
        await citizenSearchPage.openCitizenRecord('DURANT');
        await citizenSearchPage.openValidIDTab();
        await expect(citizenSearchPage.validIDTab).toBeVisible();
        page.pause();
        await citizenSearchPage.editValidID();
        await citizenSearchPage.saveChanges();
    });

    // ======================================================
    // TEST 2 - Relationship
    // ======================================================

    test('Citizen Update - Edit Relationship', async () => {
        const citizenSearchPage = new CitizenSearchPage(page);

        await citizenSearchPage.navigateToCitizens();
        await citizenSearchPage.applyFilterByLastName('DURANT');
        await citizenSearchPage.verifySearchResult('DURANT');
        await citizenSearchPage.openCitizenRecord('DURANT');
        await citizenSearchPage.openRelationshipTab();
        await expect(citizenSearchPage.relationshipTab).toBeVisible();
        await citizenSearchPage.enableEdit();
        await citizenSearchPage.editRelationship('WAYNe', 'a', 'PRATt', 'WANDAa', 'a', 'DURANt'); 
        await citizenSearchPage.saveChanges();
    });

    // // ======================================================
    // // TEST 3 - Address Tab
    // // ======================================================

    test('Citizen Update - Edit Address Tab', async () => {
        const citizenSearchPage = new CitizenSearchPage(page);

        await citizenSearchPage.navigateToCitizens();
        await citizenSearchPage.applyFilterByLastName('DURANT');
        await citizenSearchPage.verifySearchResult('DURANT');
        await citizenSearchPage.openCitizenRecord('DURANT');
        await citizenSearchPage.openAddressTab();
        await expect(citizenSearchPage.addressTab).toBeVisible();
        await citizenSearchPage.enableEdit();
        await citizenSearchPage.editAddress('PHILIPPINES', 'ABRA', 'BANGUED (CAPITAL)' , 'AGTANGAO');
        await citizenSearchPage.saveChanges();
    });

    // // ======================================================
    // // TEST 4 - Proof of Billing
    // // ======================================================

    test('Citizen Update - Edit Proof of Billing', async () => {
        const citizenSearchPage = new CitizenSearchPage(page);

        await citizenSearchPage.navigateToCitizens();
        await citizenSearchPage.applyFilterByLastName('DURANT');
        await citizenSearchPage.verifySearchResult('DURANT');
        await citizenSearchPage.openCitizenRecord('DURANT');
        await citizenSearchPage.openProofOfBillingTab();
        await expect(citizenSearchPage.proofOfBillingTab).toBeVisible();
        await citizenSearchPage.editProofOfBilling();
        page.pause();
        await citizenSearchPage.saveChanges();
    
    });

    // // ======================================================
    // // TEST 5 - Contact (ERROR,CANNOT EDIT)
    // // ======================================================

    // test('Citizen Update - Edit Contact', async () => {
    //     const citizenSearchPage = new CitizenSearchPage(page);

    //     await citizenSearchPage.navigateToCitizens();
    //     await citizenSearchPage.applyFilterByLastName('DURANT');
    //     await citizenSearchPage.verifySearchResult('DURANT');
    //     await citizenSearchPage.openCitizenRecord('DURANT');
    //     await citizenSearchPage.openContactTab();
    //     await expect(citizenSearchPage.contactTab).toBeVisible();
    //     await citizenSearchPage.verifyContactFields();
    // });

    // // ======================================================
    // // TEST 6 - Basic Information
    // // ======================================================

    test('Citizen Update - Edit Basic Information', async () => {
        const citizenSearchPage = new CitizenSearchPage(page);

        await citizenSearchPage.navigateToCitizens();
        await citizenSearchPage.applyFilterByLastName('DURANT');
        await citizenSearchPage.verifySearchResult('DURANT');
        await citizenSearchPage.openCitizenRecord('DURANT');
        await citizenSearchPage.verifyBasicInformationFields();
        await citizenSearchPage.enableEdit();
        await citizenSearchPage.editBasicInformation('KEVIN', 'DURANT', 'JR', '03/11/1986', 'MALE', 'SINGLE', 'FILIPINO', 'PHILIPPINES', 'CAMARINES NORTE','BASUD');
        await citizenSearchPage.saveChanges();
    });

    // // ======================================================
    // // TEST 7 - Cards (CANNOT DO TEST, NO CARD READER)
    // // ======================================================

    // test('Citizen Update - Edit Cards', async () => {
    //     const citizenSearchPage = new CitizenSearchPage(page);

    //     await citizenSearchPage.navigateToCitizens();
    //     await citizenSearchPage.applyFilterByLastName('DURANT');
    //     await citizenSearchPage.verifySearchResult('DURANT');
    //     await citizenSearchPage.openCitizenRecord('DURANT');
    //     await citizenSearchPage.openCardsTab();
    //     await expect(citizenSearchPage.cardsTab).toBeVisible();
    //     await citizenSearchPage.verifyCardInformation();
    // });

    // // ======================================================
    // // TEST 8 - Other Information
    // // ======================================================

    test('Citizen Update - Edit Other Information', async () => {
        const citizenSearchPage = new CitizenSearchPage(page);

        await citizenSearchPage.navigateToCitizens();
        await citizenSearchPage.applyFilterByLastName('DURANT');
        await citizenSearchPage.verifySearchResult('DURANT');
        await citizenSearchPage.openCitizenRecord('DURANT');
        await citizenSearchPage.openOtherInfoTab();
        await expect(citizenSearchPage.otherInfoTab).toBeVisible();
        await citizenSearchPage.enableEdit();
        await citizenSearchPage.editOtherInfo('BANGKAL', 'NOT EMPLOYED', 'YES', 'NO', 'NO', 'NOT APPLICABLE', 'SAMPLE HOA');
        await citizenSearchPage.saveChanges();
    });

    // // ======================================================
    // // TEST 9 - Photo & Signature
    // // ======================================================

    test('Citizen Update - Photo & Signature', async () => {
        const citizenSearchPage = new CitizenSearchPage(page);

        await citizenSearchPage.navigateToCitizens();
        await citizenSearchPage.applyFilterByLastName('DURANT');
        await citizenSearchPage.verifySearchResult('DURANT');
        await citizenSearchPage.openCitizenRecord('DURANT');
        await citizenSearchPage.openPhotoSigTab();
        await expect(citizenSearchPage.photoSigTab).toBeVisible();
        await citizenSearchPage.enableEdit();
        page.pause();
        await citizenSearchPage.editPhotoSignature();
        await citizenSearchPage.saveChanges();
    });

    // ======================================================
    // CLEANUP AFTER ALL TESTS - Only runs once at the very end
    // ======================================================

    test.afterAll(async () => {
        console.log('Running final cleanup after all tests...');
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        try {
            if (page && !page.isClosed()) {
                try {

                    const logoutButton = page.getByRole('button', { name: /log out/i });
                    await logoutButton.waitFor({ state: 'visible', timeout: 5000 });
                    await logoutButton.click();
                    await page.waitForLoadState('networkidle');
                    console.log('Logout successful');
                } catch (error) {
                    console.log('Could not find logout button, just closing context');
                }
            }
        } catch (error) {
            console.log('Cleanup error:', error);
        } finally {
            try {
                if (context) {
                    await context.close();
                    console.log('Context closed');
                }
            } catch (error) {
                console.log('Error closing context:', error);
            }
        }
});