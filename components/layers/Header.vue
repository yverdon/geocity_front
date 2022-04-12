<template>
  <header>
    <div class="my-4 lg:mb-12 md:flex justify-between items-center">
      <Logo />
      <template v-if="isLogged">
        <UserMenu />
      </template>
      <template v-else>
        <a :href="setLoginLink" class="btn btn--primary mt-6 md:mt-0">
          {{ $t('connexion') }}
        </a>
      </template>
    </div>
    <Introduction />
  </header>
</template>

<script>
import Logo from '@/components/layers/Logo'
import Introduction from '@/components/layers/Introduction'
import UserMenu from '@/components/layers/UserMenu'

export default {
  components: {
    Logo,
    Introduction,
    UserMenu,
  },

  computed: {
    setLoginLink() {
      return `${process.env.CTA_LINK}/account/login/?next=${process.env.PRODUCTION_PATH}`
    },

    isLogged() {
      return this.$store.state.user.is_logged
    },
  },

  created() {
    this.syncUserConnection()
  },

  methods: {
    /**
     * Check if user is still logged one hours after first load
     * If not a page reload is trigger to ensure right app state.
     */
    syncUserConnection() {
      setInterval(() => {
        fetch(`${process.env.GEOCITY_API}/current_user/`, {
          credentials: 'include',
        })
          .then((response) => response.json())
          .then((data) =>
            data.is_logged === false ? window.location.reload() : null
          )
      }, 3600000)
    },
  },
}
</script>
