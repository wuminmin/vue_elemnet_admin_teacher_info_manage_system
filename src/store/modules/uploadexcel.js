import { upload_canteen_list } from '@/api/upload-excel'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  message:'',
}

const mutations = {
    SET_MESSAGE:(state,message) => {
        state.message = message
    },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
    upload_canteen_list_charge({ commit }, in_data) {
    let token = state.token
    return new Promise((resolve, reject) => {
        upload_canteen_list({ 
            data:in_data.data,
            flag:in_data.flag,
            key:in_data.key,
            token:in_data.token,
        }).then(response => {
        const { message } = response
        console.log('store upload_canteen_list_charge --------------------', message)
        commit('SET_MESSAGE', message)
        // setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  upload_canteen_list_add_member({ commit }, in_data) {
    return new Promise((resolve, reject) => {
        upload_canteen_list({ 
            data:in_data.data,
            flag:in_data.flag,
            key:in_data.key,
            token:in_data.token,
        }).then(response => {
        const { message } = response
        console.log('store upload_canteen_list_charge --------------------', message)
        commit('SET_MESSAGE', message)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  query_res({ commit }, in_data) {
    return new Promise((resolve, reject) => {
        upload_canteen_list({ 
            data:in_data.data,
            flag:in_data.flag,
            key:in_data.key,
            token:in_data.token,
        }).then(response => {
        const { message } = response
        console.log('store query_res --------------------', message)
        commit('SET_MESSAGE', message)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
