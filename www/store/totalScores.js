export const state = () => ({
  summary: {
    keepChanging: -1,
    onlySummer: -1,
    onlyWinter: -1
  }
})

export const mutations = {
  setValues(state, values) {
    state.summary = values
  }
}
