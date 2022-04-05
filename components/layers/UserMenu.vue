<template>
  <VDropdown :distance="6">
    <button
      class="btn btn--primary flex items-center"
      aria-haspopup="true"
      aria-expanded="false"
    >
      <svg-icon name="user" class="icon--100 mr-2" aria-hidden="true" />
      {{ $store.state.user.email }}
    </button>

    <template #popper>
      <ul role="menu">
        <li role="menuitem">
          <a :href="setLogoutLink" class="hover:bg-gray-100 block py-3 px-8">
            {{ $t('logout') }}
          </a>
        </li>
      </ul>
    </template>
  </VDropdown>
</template>

<script>
import 'floating-vue/dist/style.css'

export default {
  name: 'UserMenu',

  computed: {
    setLogoutLink() {
      return `${process.env.CTA_LINK}/account/logout`
    },
  },
}
</script>
