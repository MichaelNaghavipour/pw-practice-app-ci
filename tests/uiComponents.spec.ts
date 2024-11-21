import { test, expect } from '@playwright/test'
import { Tooltip } from 'leaflet'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test.describe('Form Layouts Page @block', () => {
    test.beforeEach( async ({ page }) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('input fields', async ({ page }) => {
        const usingTheGridEmailInput = page.locator('nb-card', { hasText: 'Using the Grid' })
        .getByRole('textbox', { name: /email/i }) // making 'Email' Case-Insensitive

        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test@gmail.com', { delay: 250 })

        // generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test@gmail.com')

        // locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test@gmail.com')
    })

    test('Radio buttons', async ({ page }) => {
        const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"})
        // await usingTheGridForm.getByLabel('Option 1').check({ force: true })
        await usingTheGridForm.getByRole('radio', { name: "Option 1"}).check({ force: true })
        const radioStatus = await usingTheGridForm.getByRole('radio', { name: "Option 1"}).isChecked()
        await expect(usingTheGridForm).toHaveScreenshot()
        // expect(radioStatus).toBeTruthy()
        // await expect(usingTheGridForm.getByRole('radio', { name: "Option 1"})).toBeChecked()

        // await usingTheGridForm.getByRole('radio', { name: "Option 2"}).check({ force: true })
        // expect(await usingTheGridForm.getByRole('radio', { name: "Option 2"}).isChecked()).toBeTruthy()
        // expect(await usingTheGridForm.getByRole('radio', { name: "Option 1"}).isChecked()).toBeFalsy()
    })
})

test('checkboxes', async ({ page }) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()

    await page.getByRole('checkbox', { name: "Hide on click"}).uncheck({ force: true })
    await page.getByRole('checkbox', { name: "Prevent arising of duplicate toast"}).check({ force: true })

    const allBoxes = page.getByRole('checkbox')
    for (const box of await allBoxes.all()) {
        await box.check({ force: true })
        expect(await box.isChecked()).toBeTruthy()
    }

    for (const box of await allBoxes.all()) {
        await box.uncheck({ force: true })
        expect(await box.isChecked()).toBeFalsy
    }
})

test('Lists and Dropdowns', async ({ page }) => {
    const dropDownMenu = page.locator('ngx-header nb-select')
    await dropDownMenu.click()

    // await page.locator('ngx-header nb-select').click()
    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await optionList.filter({hasText: "Dark"}).click()
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(34, 43, 69)')

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }

    await dropDownMenu.click()
    for(const color in colors) {
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if(color !== 'Corporate')
            await dropDownMenu.click()
    }
})

test('Tooltips', async ({ page }) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const toolTipCard = page.locator('nb-card', {hasText: 'Tooltip Placements'})
    await toolTipCard.getByRole('button', { name: 'TOP'}).hover()
    // const tooltip = await page.locator('nb-tooltip').textContent()
    // expect(tooltip).toEqual('This is a tooltip')
    await expect(page.locator('nb-tooltip')).toHaveText('This is a tooltip')
})

test('dialog box', async ({ page }) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()
    
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })
    await page.getByRole('table').locator('tr', {hasText: 'mdo@gmail.com'}).locator('.nb-trash').click()
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
})

test('web tables', async ({ page }) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    // get the row by any text in this row
    await page.getByRole('row', {name: 'twitter@outlook.com'}).locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('34')
    await page.locator('.nb-checkmark').click()

    // await expect(page.getByRole('row', {name: 'twitter@outlook.com'}).locator('td:nth-child(7)')).toHaveText('34') // using CSS selector
    await expect(page.getByRole('row', {name: 'twitter@outlook.com'}).locator('td').nth(6)).toHaveText('34') // using index-based locator


    // get the row based on the value in the specific column
    await page.locator('.ng2-smart-pagination').getByText('2').click()
    const targetRowById = page.getByRole('row', {name: '11'}).filter({has: page.locator('td').nth(1).getByText('11')})
    await targetRowById.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
    await page.locator('.nb-checkmark').click()
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

    // test filter of the table
    const ages = ["13", "15", "20", "150"]

    for (let age of ages) {
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500)
        const ageRows = page.locator('tbody tr')

        for (let row of await ageRows.all()) {
            const cellValue = await row.locator('td').last().textContent()

            if (age == '150') {
                expect(await page.getByRole('table').textContent()).toContain('No data found')
            }
            else {
                expect(cellValue).toEqual(age)
            }
        }
    }
})

test('datepicker', async ({ page }) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()

    let date = new Date()
    date.setDate(date.getDate() + 120 )
    const expectedDate = date.getDate().toString()
    const expectedYear = date.getFullYear()
    const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
    const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `

    while(!calendarMonthAndYear.includes(expectedMonthAndYear)) {
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, { exact: true }).click()
    await expect(calendarInputField).toHaveValue(dateToAssert)
})

test('sliders', async ({ page }) => {
    // const tempGauge = await page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    // await tempGauge.evaluate(node => {
    //     node.setAttribute('cx', '232.630')
    //     node.setAttribute('cy', '232.630')
    // })
    // await tempGauge.click()

    // mouse movement
    const tempBox = await page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()
    await expect(tempBox).toBeVisible()

    const box = await tempBox.boundingBox()
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    await page.mouse.move( x, y)
    await page.mouse.down()
    await page.mouse.move( x + 100, y)
    await page.mouse.move( x + 100, y + 100)
    await page.mouse.up()
    await expect(tempBox).toContainText('30')
})