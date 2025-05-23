export function useQuerySyncedState<T>(key: string, defaultValue: T) {
    const route = useRoute(), router = useRouter()
    const state = ref<T>(defaultValue)

    function encode(v: T) { return btoa(JSON.stringify(v)) }
    function decode(v: any) { try { return JSON.parse(atob(v)) } catch { return defaultValue } }

    onMounted(() => state.value = decode(route.query[key]))
    watch(state, v => router.replace({ query: { ...route.query, [key]: encode(v) } }), { deep: true })

    return { state, rawQueryValue: computed(() => encode(state.value)) }
}
