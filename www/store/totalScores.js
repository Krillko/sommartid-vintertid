export const state = () => ({
  summary: {
    keepChanging: 0,
    onlySummer: 0,
    onlyWinter: 0
  }
})

export const mutations = {
  setValues(state, values) {
    state.summary = values
  }
}
