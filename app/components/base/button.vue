<script setup lang="ts">
type Button = {
  type: 'primary' | 'secondary' | 'simple'
  label: string
  icon?: string | undefined
  state?: 'loading' | undefined
  href?: string | undefined
  target?: '_self' | '_blank'
}

withDefaults(defineProps<Button>(), {
  type: 'primary',
  label: '',
  icon: undefined,
  state: undefined,
  href: undefined,
  target: '_self'
})

</script>

<template>
  <div>
    <NuxtLink v-if="href" :to="href" :target>{{ label }}</NuxtLink>
    <button v-else>{{ label}}</button>
  </div>
</template>

<style scoped></style>
