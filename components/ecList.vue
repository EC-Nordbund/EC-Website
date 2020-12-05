<template lang="pug">
  p testlist
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
