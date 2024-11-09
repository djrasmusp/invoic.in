<script setup lang="ts">
try {
  const data = fetch('https://randomuser.me/api/')
}catch (e){
  createError({ statusMessage: 'FEJL', fatal: true})
}
</script>

<template>
  <div >
    <div data-testid="azure">
    Page: test
      {{ data }}
    </div>
  </div>
</template>

<style scoped></style>
