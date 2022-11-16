export const state = () => ({
  user: {},
})

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
}

export const actions = {
  async getSubmissionsDetails({ commit }, id) {
    const submissionsDetails = await this.$axios
      .$get(`${process.env.GEOCITY_API}/submissions_details/${id}/`, {
        withCredentials: true,
      })
      .then((response) => response)
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      })

    return submissionsDetails
  },
}
