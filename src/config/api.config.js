/**
 * API配置文件
 * 集中管理所有API相关的配置
 */

// 环境变量配置
const ENV = {
  development: {
    // 开发环境使用相对路径，通过代理转发请求
    // 注意：这里使用相对路径，请求会被代理到vite.config.js中配置的目标服务器
    baseURL: '',
    timeout: 10000
  },
  production: {
    // 生产环境使用完整URL
    baseURL: 'https://api.example.com', // 生产环境API地址，需要替换为实际地址
    timeout: 15000
  },
  test: {
    baseURL: 'http://test-api.example.com', // 测试环境API地址，需要替换为实际地址
    timeout: 10000
  }
}

// 当前环境，根据实际情况修改
const currentEnv = import.meta.env.MODE || 'development'

// API路径配置
const API_PATHS = {
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    register: '/api/auth/register',
    refreshToken: '/api/auth/refresh-token'
  },
  user: {
    profile: '/api/user/profile',
    getUserInfo: '/api/user/info', // 获取用户详细信息
    updateProfile: '/api/user/profile',
    updateUserInfo: '/api/user/info', // 更新用户详细信息
    changePassword: '/api/user/change-password',
    uploadAvatar: '/api/user/avatar' // 上传用户头像
  },
  posts: {
    list: '/api/posts',
    detail: (id) => `/api/posts/${id}`,
    create: '/api/posts',
    update: (id) => `/api/posts/${id}`,
    delete: (id) => `/api/posts/${id}`
  }
}

// 导出配置
export const apiConfig = {
  baseURL: ENV[currentEnv].baseURL,
  timeout: ENV[currentEnv].timeout,
  paths: API_PATHS
}

export default apiConfig
