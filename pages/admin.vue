<template lang="pug">
  v-container
    v-btn Publish changes
</template>
<script>
export default {
  validate({ isDev }) {
    return isDev
  },
}
</script>
