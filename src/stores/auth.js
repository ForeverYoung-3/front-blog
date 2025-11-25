import { defineStore } from 'pinia'
import request from '../utils/request'
import apiConfig from '../config/api.config'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    user: null,
    token: null,
    role: null,
    userInfo: null // 存储用户详细信息
  }),

  getters: {
    userAvatar: (state) => {
      return state.userInfo?.avatar || state.user?.avatar || '../assets/default-avatar.png'
    },
    userName: (state) => {
      return state.userInfo?.nickname || state.user?.name || '游客'
    },
    isAdmin: (state) => {
      return state.role === 'ADMIN'
    }
  },

  actions: {
    async login(username, password, rememberMe = false) {
      try {
        const response = await request.post(apiConfig.paths.auth.login, {
          username,
          password
        })

        // 请求成功，response已经是处理过的数据
        const { token, role } = response.data

        this.isLoggedIn = true
        this.token = token
        this.role = role

        // 设置用户基本信息
        this.user = {
          name: username,
          avatar: '../assets/default-avatar.png'
        }

        // 保存到本地存储
        if (rememberMe) {
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify({
            name: username,
            role: role
          }))
        } else {
          sessionStorage.setItem('token', token)
          sessionStorage.setItem('user', JSON.stringify({
            name: username,
            role: role
          }))
        }

        // 登录成功后自动获取用户详细信息
        await this.getUserInfo()

        return { success: true }
      } catch (error) {
        console.error('登录失败:', error)
        return {
          success: false,
          message: error.message || '登录失败，请检查网络连接'
        }
      }
    },

    // 获取用户详细信息
    async getUserInfo() {
      try {
        const response = await request.get(apiConfig.paths.user.getUserInfo)

        // 请求成功，更新用户详细信息
        this.userInfo = response.data

        // 更新本地存储中的用户信息
        const storage = localStorage.getItem('token') ? localStorage : sessionStorage
        const savedUser = storage.getItem('user')

        if (savedUser) {
          const userData = JSON.parse(savedUser)
          userData.userInfo = this.userInfo
          storage.setItem('user', JSON.stringify(userData))
        }

        return { success: true, data: this.userInfo }
      } catch (error) {
        console.error('获取用户信息失败:', error)
        return {
          success: false,
          message: error.message || '获取用户信息失败'
        }
      }
    },

    // 更新用户信息
    async updateUserInfo(userInfo) {
      try {
        const response = await request.put(apiConfig.paths.user.updateUserInfo, userInfo)

        // 请求成功，更新用户详细信息
        this.userInfo = response.data

        // 更新本地存储中的用户信息
        const storage = localStorage.getItem('token') ? localStorage : sessionStorage
        const savedUser = storage.getItem('user')

        if (savedUser) {
          const userData = JSON.parse(savedUser)
          userData.userInfo = this.userInfo
          storage.setItem('user', JSON.stringify(userData))
        }

        return { success: true, data: this.userInfo }
      } catch (error) {
        console.error('更新用户信息失败:', error)
        return {
          success: false,
          message: error.message || '更新用户信息失败'
        }
      }
    },

    // 修改密码
    async changePassword(oldPassword, newPassword) {
      try {
        const response = await request.post(apiConfig.paths.user.changePassword, {
          oldPassword,
          newPassword
        })

        return { success: true, message: '密码修改成功' }
      } catch (error) {
        console.error('修改密码失败:', error)
        return {
          success: false,
          message: error.message || '修改密码失败'
        }
      }
    },

    // 上传头像
    async uploadAvatar(formData) {
      try {
        const response = await request.upload(apiConfig.paths.user.uploadAvatar, formData)

        // 更新用户头像
        if (this.userInfo) {
          this.userInfo.avatar = response.data.avatarUrl
        }

        return { success: true, data: response.data }
      } catch (error) {
        console.error('上传头像失败:', error)
        return {
          success: false,
          message: error.message || '上传头像失败'
        }
      }
    },

    logout() {
      this.isLoggedIn = false
      this.user = null
      this.token = null
      this.role = null
      this.userInfo = null

      // 清除存储
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
    },

    // 检查本地存储中是否有登录信息
    checkAuth() {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user')

      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser)
          this.isLoggedIn = true
          this.token = token
          this.role = userData.role
          this.user = {
            name: userData.name,
            avatar: '../assets/default-avatar.png'
          }

          // 如果本地存储中有用户详细信息，则加载
          if (userData.userInfo) {
            this.userInfo = userData.userInfo
          } else {
            // 否则，自动获取用户详细信息
            this.getUserInfo()
          }

          return true
        } catch (e) {
          this.clearAuth()
          return false
        }
      }
      return false
    },

    // 清除认证信息
    clearAuth() {
      this.isLoggedIn = false
      this.user = null
      this.token = null
      this.role = null
      this.userInfo = null

      localStorage.removeItem('token')
      localStorage.removeItem('user')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
    }
  }
})
