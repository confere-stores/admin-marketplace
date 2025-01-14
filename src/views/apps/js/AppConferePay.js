import { $ecomConfig } from '@ecomplus/utils'
import ecomApps from '@ecomplus/apps-manager'
import EcAdminSettingsForm from './../../../components/EcAdminSettingsForm.vue'
import WindowMessage from '../../../lib/WindowMessage'
import Application from './../../Application.vue'
import axios from 'axios'
import LogRocket from 'logrocket';

const appClient = axios.create({
  baseURL: 'https://api.confere.com.br/',
  headers: {
    'x-store-id': $ecomConfig.get('store_id'),
    'x-my-id': localStorage.getItem('my_id'),
    'x-access-token': localStorage.getItem('access_token')
  }
})

export default {
  name: 'AppConferePay',

  components: {
    EcAdminSettingsForm,
    Application
  },

  data () {
    return {
      currentUrl: location.toString() || 'admin-homolog.confere.shop',
      showModalError: false,
      ipModal: false,
      isSaving: false,
      application: {
        admin_settings: {}
      }
    }
  },

  beforeMount () {
    LogRocket.init('ip0-checkout/infinite-checkout');
  },

  computed: {
    message () {
      return WindowMessage.message
    },
    confereData () {
      return {}
      // if (!window.confereData) return window.confereLogin()
      // return window.confereData
    }
  },

  methods: {
    openCreateModal () {
      this.showModalError = false
      this.loadConfereData()
      this.ipModal = true
    },

    loadConfereData () {
      if (!window.confereData) return window.confereLogin()
      return window.confereData
    },

    handleAppLoad (application) {
      this.application = application
    },

    integrateIp () {
      this.isSaving = true
      if (!this.application.data) this.application.data = {}
      const editingData = this.application.data
      appClient({
        url: '/store/integrateIP',
        method: 'post',
        data: {
          id: this.application._id
        }
      })
        .then(({ data }) => {
          return ecomApps.edit(this.application._id, { data: data })
            .then(() => {
              Object.assign(editingData, data)
              window.location.reload(true)
              return data
            })
        })
        .catch(() => {
          this.showModalError = true
        })
        .finally(() => {
          this.isSaving = false
        })
    }
  },

  mounted () {
    this.$root.$on('openIPModal', () => {
      this.ipModal = true
    })
  },

  watch: {
    message: {
      handler (newMessage) {
        if (
          !newMessage.origin ||
          !newMessage.data
        ) return false
        else if (
          newMessage.origin !== 'http://localhost:3000' &&
          newMessage.origin !== 'https://checkout.confere.shop' &&
          newMessage.origin !== 'https://checkout.confere.com.br'
        ) return false
        else if (
          newMessage.data !== 'closeModal'
        ) return false
        else this.ipModal = false
      },
      deep: true
    }
  }
}
