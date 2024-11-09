import { describe, it, expect, test } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { BaseButton } from '#components'
import { axe, toHaveNoViolations } from 'jest-axe'
import {mount} from "@vue/test-utils";

const label = 'test text'
const href = 'http://localhost'

expect.extend(toHaveNoViolations)
it('can mount BaseButton', async () => {
    const component = await mountSuspended(BaseButton, { props: { variant: 'solid' } })
    expect(component.exists)
})

it('can mount BaseButton with custom props', async () => {
    const component = await mountSuspended(BaseButton, { props: { variant: 'link', label: label }})
    expect(component.text()).toContain(label)
})

it('BaseButton is a button', async () => {
    const component = await mountSuspended(BaseButton, { props: { variant: 'link', label: label }})
    expect(component.get('button').html()).contains('<button')
})


it('BaseButton can have href', async () => {
    const component = await mountSuspended(BaseButton, { props: { variant: 'link', label: label, href: href }})
    expect(component.get('a').html()).contains(`href="${href}"`)
})