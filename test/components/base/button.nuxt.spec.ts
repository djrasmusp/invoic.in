import { it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { BaseButton } from '#components'

const label = 'test text'
const href = 'http://localhost'
it('can mount BaseButton', async () => {
    const component = await mountSuspended(BaseButton, { props: { variant: 'solidh' } })
    expect(component.exists)
})

it('can mount BaseButton with custom props', async () => {
    const component = await mountSuspended(BaseButton, { props: { variant: 'link', label: label }})
    expect(component.text()).toContain(label)
})

it('BaseButton can have href', async () => {
    const component = await mountSuspended(BaseButton, { props: { variant: 'link', label: label, href: href }})
    expect(component.get('a').html()).contains(`href="${href}"`)
})