import { test, expect } from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import { faker } from '@faker-js/faker'
import { argosScreenshot } from "@argos-ci/playwright";

test.beforeEach( async ({ page }) => {
    await page.goto('/')
})

test('Navigate to form page @regression', async ({ page }) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datePickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()  
    await pm.navigateTo().tooltipPage()
})

test('Parameterized Methods @smoke', async ({ page }) => {
    const pm = new PageManager(page)
    const randomFullName = faker.person.fullName({ lastName: 'Tester' })
    const randomEmail = `${randomFullName.toLowerCase().replace(' ', '')}${faker.number.int(1000)}@test.com`

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.EMAIL, process.env.PASSWORD, 'Option 2')
    // await page.screenshot({ path: 'screenshots/formLayoutsPage.png' })
    // const buffer = page.screenshot()
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, false)
    // await page.locator('nb-card', { hasText: 'Inline form' }).screenshot({ path: 'screenshots/inlineForm.jpg'})
    // await pm.navigateTo().datePickerPage()
    // await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(5)
    // await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(1, 5)
})

test.only('Testing with argos ci', async ({ page }) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await argosScreenshot(page, "form layouts page")
    await pm.navigateTo().datePickerPage()
    await argosScreenshot(page, "datepicker page")
})