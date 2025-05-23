<script setup lang="ts">
import { useQuerySyncedState } from '~/composables/useQuerySyncedState'

const { state: data, rawQueryValue } = useQuerySyncedState<{ label: string; value: number, color: string }[]>(
    'data',
    [
      { label: 'Alex', value: 30, color: '#ff6b6b' },
      { label: 'Bob', value: 30, color: '#4ecdc4' },
      { label: 'Charlie', value: 30, color: '#ffe66d' },
      { label: 'Diana', value: 30, color: '#1a535c' },
      { label: 'Eve', value: 30, color: '#f7fff7' },
    ]
)

const angle = ref(0)
const prize = ref<{ label: string; value: number, color: string } | null>(null)
const input = ref('')

function spin() { angle.value += Math.random() * 360 * 10 }

function add() {
  if (!input.value.trim()) return
  const color = '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')
  data.value.push({ label: input.value, value: 30, color })
  input.value = ''
}

function remove(i: number) {
  data.value.splice(i, 1)
}
</script>

<template>
  <UPageSection>
    <UModal v-model:open="prize">
      <template #content>
        <UPageCard title="Winner" :description="prize?.label" />
      </template>
    </UModal>

    <UPageCTA
        title="Wheel Minimal"
        orientation="horizontal"
        reverse
    >
      <template #description>
        <UPageList class="space-y-4">
          <UChatPrompt
            v-model="input"
            placeholder="Add a new label"
            @submit="add"
          />

          <UPageCard>
            <p v-if="data.length === 0" class="text-center">No participants yet. Add some!</p>

            <div
                v-for="(item, index) in data"
                :key="item.label + index"
                class="flex justify-between"
            >
              <UUser :name="item.label" />
              <div class="flex gap-3">
                <UPopover>
                  <UButton icon="i-lucide-settings" />

                  <template #content>
                    <UPageCard>
                      <UInputNumber v-model="item.value" />
                      <UColorPicker v-model="item.color" />
                    </UPageCard>
                  </template>
                </UPopover>
                <UButton icon="i-lucide-x" @click="() => remove(index)" />
              </div>
            </div>
          </UPageCard>
        </UPageList>
      </template>

      <template #links>
        <UButton
            label="Spin the Wheel"
            :disabled="data.length === 0"
            @click="spin"
        />
      </template>

      <Wheel :key="rawQueryValue" :angle="angle" :data="data" @result="result => prize = result" />
    </UPageCTA>
  </UPageSection>
</template>
