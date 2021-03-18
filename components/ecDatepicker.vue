<template>
    <v-dialog
      v-model="menu2"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="auto"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="computedDateFormatted"
          readonly
          v-bind="{...attrs, ...$attrs}"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="date"
        no-title
        @input="menu2 = false"
      ></v-date-picker>
    </v-dialog>
</template>
<script>
  export default {
    data: vm => ({
      date: '',
      dateFormatted: null,
      menu2: false,
    }),

    computed: {
      computedDateFormatted () {
        return this.formatDate(this.date)
      },
    },

    watch: {
      date (val) {
        this.dateFormatted = this.formatDate(this.date)
        this.$emit('input', this.date)
      },
    },

    methods: {
      formatDate (date) {
        if (!date) return null

        return date.split('-').reverse().join('.')
      },
      parseDate (date) {
        if (!date) return null

        return date.split('.').reverse().join('-')
      },
    },
  }
</script>