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
        this.emailInput = page.getByRole('textbox', { name: 'Enter your email address' });
        this.passwordInput = page.getByRole('textbox', { name: '••••••••••' });
        this.loginButton = page.getByRole('button', { name: 'Log in' });
        this.confirmCodeButton = page.getByRole('button', { name: /confirm code/i });
    }

    async navigate() {
        await this.page.goto('https://sit-bayambang.aris.ph/sign-in',
            { waitUntil: 'networkidle' });
    }

    async login(email: string, password: string) {

        // ======================================================
        // ENTER LOGIN CREDENTIALS
        // ======================================================

        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();

        // ======================================================
        // WAIT FOR OTP MODAL
        // ======================================================

        try {
            await this.page.getByText('One Time Password').waitFor({ timeout: 30000 });
        } catch (error) {
            // Check if already logged in
            const currentUrl = this.page.url();
            if (!currentUrl.includes('sign-in')) {
                console.log('Already logged in, skipping OTP');
                return;
            }
            throw error;
        }

        // ======================================================
        // OPEN MAILINATOR
        // ======================================================

        const mailPage = await this.context.newPage();

        try {
            await mailPage.goto('https://www.mailinator.com/v4/public/inboxes.jsp?to=adnan',
                { waitUntil: 'domcontentloaded' }
            );

            await mailPage.getByRole('cell').first().waitFor({ timeout: 30000 });

            // Retry search for OTP email
            const latestMail = mailPage.getByRole('cell', { name: /is your ARIS/i }).first();

            await expect(latestMail).toBeVisible({ timeout: 60000 });

            // Extract OTP
            const subjectText = await latestMail.textContent() || '';

            const otp = subjectText.match(/\d{5}/)?.[0] || '';

            console.log('OTP FOUND:', otp);

            expect(otp).not.toBe('');

            // Open email
            await latestMail.click();

            // Wait for email content to load
            await mailPage.waitForTimeout(6000);

            // ======================================================
            // RETURN TO MAIN PAGE
            // ======================================================

            await this.page.bringToFront();

            const otpBoxes = this.page.getByRole('textbox');
            await expect(otpBoxes.first()).toBeVisible({ timeout: 10000 });

            // Fill OTP
            for (
                let i = 0;
                i < otp.length;
                i++
            ) {
                await otpBoxes.nth(i).fill(otp[i]);
            }
            await this.confirmCodeButton.click();
            await this.page.waitForLoadState('networkidle');

        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        } finally {

            await mailPage.close();
        }
    }
}