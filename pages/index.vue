<script setup>
const data = [
  { label: 'Alex', value: 40 },
  { label: 'Bob', value: 25 },
  { label: 'Charlie', value: 35 }
]

const angle = ref(0)
const prize = ref('No prize')

function spin() {
  angle.value += 5 * 360 + Math.random() * 5 * 360
}
</script>

<template>
  <UPageSection>
    <UPageCTA
        :description="`Prize: ${prize}`"
        orientation="horizontal"
        title="D3 Wheel"
    >
      <template #links>
        <UButton label="Spin the Wheel" @click="spin"/>
      </template>
      <Wheel :angle="angle" :data="data" @result="result => prize = result"/>
    </UPageCTA>
  </UPageSection>
</template>
