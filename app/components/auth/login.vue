<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types'
import { type AuthLoginForm, AuthLoginFormSchema } from '#shared/schemas'

const form = useTemplateRef('form')

const state = reactive<Partial<AuthLoginForm>>({
  email: undefined,
  password: undefined,
})

async function handleSubmit(event: FormSubmitEvent<AuthLoginForm>) {
  console.log('submit')
  console.log('event', event.data)
  console.log(form.value?.errors)
}
</script>

<template>
  <UCard
    class="w-4xl"
    variant="soft"
  >
    <template #header>
      <h1>Login</h1>
    </template>
    <UForm
      ref="form"
      :schema="AuthLoginFormSchema"
      :state="state"
      class="space-y-4"
      @submit="handleSubmit"
    >
      <UFormField
        description="We'll never share your email with anyone else."
        label="Email"
        name="email"
      >
        <UInput
          v-model="state.email"
          class="w-full"
          placeholder="Email"
          type="email"
        />
      </UFormField>
      <UFormField
        label="Password"
        name="password"
      >
        <UInput
          v-model="state.password"
          placeholder="password"
          type="password"
        />
      </UFormField>
      <UButton type="submit">Login</UButton>
    </UForm>
  </UCard>
</template>

<style scoped></style>
