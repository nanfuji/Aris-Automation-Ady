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

test.describe.serial('Citizen Search', () => {

    // ======================================================
    // LOGIN GROUP
    // ======================================================

    test.describe('Login Functionality', () => {

        test('Successful Login - ARIS User', async ({ browser }) => {

            // Create ONE persistent browser session
            context = await browser.newContext();

            page = await context.newPage();

            const loginPage = new LoginPage(page, context);

            // Navigate to Login Page
            await loginPage.navigate();

            // Login
            await loginPage.login( 'adnan@mailinator.com','P@ssw0rd');

            // Verification
            await expect(page).not.toHaveURL( 'https://sit-bayambang.aris.ph/sign-in');

            page.pause();

        });
    });

    

    // ======================================================
    // CITIZEN SEARCH GROUP
    // ======================================================

    test.describe('Citizen Search Functionality', () => {

        test('Filter and Open Citizen Record', async () => {

            const citizenSearchPage = new CitizenSearchPage(page);

            // Navigate to Main Page
            await citizenSearchPage.clickHome();

            await page.pause();

            // Open Citizens Module
            await citizenSearchPage.navigateToCitizens();

            // Apply Filter
            await citizenSearchPage.applySingleFilter();

            // Open Citizen Record
            await citizenSearchPage.openCitizenRecord('MICHAEL');

            // Open Valid ID Tab
            await citizenSearchPage.openValidIDTab();

            // Enable Edit
            await citizenSearchPage.enableEdit();

            // Edit Valid ID
            await citizenSearchPage.editValidID();

            // Verification
            await expect.soft(citizenSearchPage.validIDTab).toBeVisible();

            await citizenSearchPage.clickHome();
        
        });
    });

 // Logout User

    test.afterAll(async () => {

    // Logout User

    await page.getByRole('button', {

        name: /log out/i

    }).click();



    // await context.close();

});

});