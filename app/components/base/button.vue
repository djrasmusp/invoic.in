<script setup lang="ts">
type Button = {
  variant: 'link' | 'solid' | 'outline'
  label?: string
  icon?: string | undefined
  loading?: boolean
  disabled?: boolean
  href?: string | undefined
  target?: '_self' | '_blank'
}

withDefaults(defineProps<Button>(), {
  variant: 'solid',
  label: '',
  icon: undefined,
  loading: false,
  disabled: false,
  href: undefined,
  target: '_self'
})

defineOptions({
  inheritAttrs: false
})

</script>

<template>
  <div class="rounded-md w-full lg:w-fit inline-flex bg-red-400 p-2.5 justify-center items-center focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0">
    <NuxtLink v-if="href" :to="href" :target v-bind="$attrs">
      <slot name="leading"></slot>
      <slot>{{ label }}</slot>
      <slot name="trailing"></slot>
    </NuxtLink>
    <button v-else v-bind="$attrs">
      <slot name="leading"></slot>
      <slot>{{ label }}</slot>
      <slot name="trailing"></slot>
    </button>
  </div>
</template>

<style scoped></style>
