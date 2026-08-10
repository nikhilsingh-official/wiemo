import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

export function useWordLimit(value: MaybeRefOrGetter<string>, limit: number) {
  const wordCount = computed(() => toValue(value).trim().match(/\S+/g)?.length ?? 0)
  const isOverLimit = computed(() => wordCount.value > limit)

  return { wordCount, isOverLimit }
}
