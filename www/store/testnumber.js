export const state = () => ({
  currentnumber: 5
})

export const mutations = {
  change(state, value) {
    state.currentnumber = value
    console.log(value)
  },
  setFromInput(state, e) {
    console.log(e.target.value)
  }
}
