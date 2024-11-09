import { setup, createPage } from '@nuxt/test-utils/e2e'
import { describe, it, expect } from 'vitest'

describe('login page', async () => {
    await setup({
        browser: true,
        server: true,  // Ensures the server starts if not already running
        url: 'http://localhost:3000', // Use `url` instead of `host`
    })

    it('displays an error message if the page fails to load properly', async () => {
        const page = await createPage('/azure')
        const content = await page.content()

        // Tjekker om ordet "Error" vises på siden
        expect(content.includes('Error')).toBe(false)
    })

    it('is page display able', async () => {
        const page = await createPage('/azure')
        await page.waitForSelector('[data-testid="azure"]', { visible: true })
        expect(await page.getByTestId('azure').isVisible()).toBe(true)
    })
})