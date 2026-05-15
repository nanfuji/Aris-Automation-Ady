import {
    Page,
    Locator,
    BrowserContext,
    expect
} from '@playwright/test';

export class LoginPage {

    readonly page: Page;
    readonly context: BrowserContext;

    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly confirmCodeButton: Locator;

    constructor(
        page: Page,
        context: BrowserContext
    ) {

        this.page = page;
        this.context = context;

        this.emailInput =
            page.getByRole('textbox', {
                name: 'Enter your email address'
            });

        this.passwordInput =
            page.getByRole('textbox', {
                name: '••••••••••'
            });

        this.loginButton =
            page.getByRole('button', {
                name: 'Log in'
            });

        this.confirmCodeButton =
            page.getByRole('button', {
                name: /confirm code/i
            });

    }

    async navigate() {

        await this.page.goto('https://sit-bayambang.aris.ph/sign-in');
    }

    async login(
        email: string,
        password: string
    ) {

        // Enter Credentials
        await this.emailInput.fill(email);

        await this.passwordInput.fill(password);

        await this.loginButton.click();


        // Wait for OTP Modal
        await this.page.getByText('One Time Password').waitFor();


        // Open Mailinator
        const mailPage = await this.context.newPage();

        await mailPage.goto('https://www.mailinator.com/v4/public/inboxes.jsp?to=adnan');

        await mailPage.waitForLoadState('domcontentloaded');

        await mailPage.waitForTimeout(20000);


        // Get Latest OTP Email
        const latestMail = mailPage.getByRole('cell', { name: /is your ARIS/i }).first();

        await latestMail.waitFor();

        const subjectText = await latestMail.textContent() || '';

        const otp = subjectText.match(/\d{5}/)?.[0] || '';

        console.log('OTP FOUND:', otp);

        expect(otp).not.toBe('');

        await latestMail.click();


        // Return to ARIS Page
        await this.page.bringToFront();


        // OTP Inputs
        const otpBoxes = this.page.getByRole('textbox');

        await expect(otpBoxes.first()).toBeVisible();

        // Fill OTP
        for (let i = 0; i < otp.length; i++) {
            await otpBoxes
                .nth(i)
                .fill(otp[i]);
        }
        // Confirm OTP
        await this.confirmCodeButton.click();

    }

}