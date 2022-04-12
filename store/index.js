export const state = () => ({
  user: {},
})

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
}

export const actions = {
  async getPermitsDetails({ commit }, id) {
    const permitsDetails = await this.$axios.$get(
      `${process.env.GEOCITY_API}/permits_details/${id}/`,
      { withCredentials: true }
    )
    return permitsDetails
  },
}
