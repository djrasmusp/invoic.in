// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt().prepend({
    ignores: ['.nuxt-storybook/**/*'],
})