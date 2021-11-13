<template lang="pug">
.ec-shop-container(style='min-height: 50vh')
  #shop
    slot
      v-container
        v-row(justify='center', v-if='shopIsLoading')
          v-progress-circular.mt-10(:size='50', indeterminate, color='primary')
        v-alert(v-else, type='info', align='center', prominent)
          h2 Der Shop steht zur Zeit nicht zur Verfügung.
</template>
<script>
import {
  defineComponent,
  onMounted,
  useMeta,
  toRefs,
  ref,
} from '@nuxtjs/composition-api'

export default defineComponent({
  head: {},
  props: {
    shopName: {
      type: String,
      required: true,
    },
    shopUrl: {
      type: String,
      required: true,
    },
    locale: {
      type: String,
      default: 'de_DE',
    },
  },
  setup(props) {
    const { shopName, shopUrl, locale } = toRefs(props)

    const shopIsLoading = ref(true)

    const timeoutForLoadingShop = 5000
    const delayAfterLoaded = 500

    const shopConfigAvalable = ref(false)

    onMounted(() => {
      setTimeout(() => (shopIsLoading.value = false), timeoutForLoadingShop)
    })

    useMeta(() => {
      // set spreadshirt-config only on client
      if (process.browser) {
        window.spread_shop_config = {
          shopName: shopName.value,
          locale: locale.value,
          prefix: shopUrl.value,
          baseId: 'shop',
          swipeMenu: true,
        }

        shopConfigAvalable.value = true
      }

      return {
        script: [
          {
            vmid: 'spreadshirt',
            src: 'https://nordbund.myspreadshop.net/js/shopclient.nocache.js',
            body: true,
            skip: !shopConfigAvalable.value,
            callback: () =>
              // stop loading animation with some delay after script has been loaded
              setTimeout(() => (shopIsLoading.value = false), delayAfterLoaded),
          },
        ],
      }
    })

    return { shopIsLoading }
  },
})
</script>

<style lang="scss" scoped>
#shop::v-deep {
  .SprdMain {
    isolation: isolate;
  }

  #sprd-container > * {
    margin-left: 0;
  }

  .sprd-social-bar,
  .sprd-breadcrumb {
    display: none;
  }

  .sprd-header-container {
    padding-bottom: 1em;
  }

  .sprd-navigation {
    border-top-width: 2px;

    .sprd-department-filter {
      padding-left: 0;
    }
  }

  .sprd-header {
    justify-content: end;
    padding: 0 10px;

    .sprd-header__title {
      padding-left: 0;
    }

    .sprd-header__actions > * {
      > :not(.sprd-search-form) {
        padding-top: 6px;
        padding-bottom: 10px;
      }

      > [class$='__button--open'],
      > .sprd-search__button--open,
      > .sprd-basket-indicator__button--open,
      > :focus {
        padding-bottom: 7px;
      }
    }
  }

  .sprd-search .sprd-search-form {
    background: #fff;
  }

  .sprd-product-list {
    gap: 20px;

    .sprd-product-list-item {
      margin: 0;
      border: thin solid rgba(0, 0, 0, 0.12);
    }
  }

  .sprd-mobilefilter__modal {
    //   Modal below the header
    top: 96px;
    height: unset;
    height: calc(100% - 96px);
  }
}
</style>


<style lang="scss">
// Highlight rejection button like acception button
#onetrust-consent-sdk #onetrust-banner-sdk {
  #consent-settings,
  #consent-reject {
    display: inline-block;
    box-sizing: border-box;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 2px;
    text-decoration: none;
    padding: 12px 32px;
    letter-spacing: 0.02rem;
  }

  #consent-reject {
    color: #fff !important;
    background: #333;
    &:hover {
      background: #222;
    }
  }

  #consent-settings {
    border: 1px solid #333;
    box-shadow: inset 0 0 0 1px #333;

    &:hover {
      background: #eee;
      box-shadow: inset 0 0 0 1px #222;
    }
  }

  #onetrust-policy-text {
    position: relative;
    top: 0;
    max-height: 50vh;
  }
}
</style>