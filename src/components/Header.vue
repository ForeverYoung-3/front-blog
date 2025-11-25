<template>
  <header class="header">
    <div class="container">
      <div class="logo-container">
        <router-link to="/">
          <img src="../assets/logo.png" alt="Logo" class="logo" />
          <span class="site-name">诗词博客</span>
        </router-link>
      </div>

      <nav class="nav-links">
        <router-link to="/" class="nav-link">
          <i class="icon home-icon"></i>
          首页
        </router-link>
        <router-link to="/favorites" class="nav-link">
          <i class="icon heart-icon"></i>
          收藏
        </router-link>
        <router-link to="/random" class="nav-link">
          <i class="icon random-icon"></i>
          随笔
        </router-link>
        <router-link to="/notes" class="nav-link">
          <i class="icon note-icon"></i>
          记录
        </router-link>
        <router-link to="/album" class="nav-link">
          <i class="icon album-icon"></i>
          相册
        </router-link>
        <router-link to="/inbox" class="nav-link">
          <i class="icon inbox-icon"></i>
          百宝箱
        </router-link>
        <router-link to="/about" class="nav-link">
          <i class="icon about-icon"></i>
          留言
        </router-link>
        <router-link to="/contact" class="nav-link">
          <i class="icon contact-icon"></i>
          联系我
        </router-link>
      </nav>

      <div class="user-area">
        <!-- 已登录状态显示用户头像 -->
        <div v-if="authStore.isLoggedIn" class="user-profile">
          <div class="user-dropdown"
               @mouseenter="handleMouseEnter"
               @mouseleave="handleMouseLeave">
            <img :src="authStore.userAvatar" alt="用户头像" class="avatar" @click="toggleDropdown" />
            <div class="dropdown-content" v-show="showDropdown" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
              <a href="#" class="dropdown-item" @click.prevent="showProfileModal = true; showDropdown = false">个人中心</a>
              <router-link to="/settings" class="dropdown-item" @click="showDropdown = false">设置</router-link>
              <!-- 管理员角色显示管理后台入口 -->
              <router-link v-if="authStore.isAdmin" to="/admin" class="dropdown-item admin-link" @click="showDropdown = false">
                管理后台
              </router-link>
              <a href="#" class="dropdown-item" @click.prevent="handleLogout">退出登录</a>
            </div>
          </div>
        </div>

        <!-- 未登录状态显示登录按钮 -->
        <router-link v-else to="/login" class="login-button">
          登录
        </router-link>
      </div>
    </div>

    <!-- 个人信息修改弹窗 -->
    <ProfileModal
      :show="showProfileModal"
      @close="showProfileModal = false"
      @update="handleProfileUpdate"
    />
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import ProfileModal from './ProfileModal.vue'

const router = useRouter()
const authStore = useAuthStore()

// 检查是否已登录
authStore.checkAuth()

// 控制下拉菜单显示
const showDropdown = ref(false)
// 控制个人信息弹窗显示
const showProfileModal = ref(false)
let closeTimer = null

// 鼠标进入头像或下拉菜单
const handleMouseEnter = () => {
  // 清除关闭计时器
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
  showDropdown.value = true
}

// 鼠标离开头像或下拉菜单
const handleMouseLeave = () => {
  // 设置延迟关闭，给用户足够时间移动到下拉菜单
  closeTimer = setTimeout(() => {
    showDropdown.value = false
  }, 300)
}

// 点击头像切换下拉菜单显示状态
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

// 处理个人信息更新
const handleProfileUpdate = () => {
  // 可以在这里添加一些额外的操作，比如显示通知等
  console.log('个人信息已更新')
}

const handleLogout = () => {
  authStore.logout()
  showDropdown.value = false
  // 退出登录后跳转到首页
  router.push('/')
}
</script>

<style scoped>
.header {
  background-color: #1e88e5;
  color: white;
  padding: 10px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-container a {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
}

.logo {
  height: 40px;
  margin-right: 10px;
}

.site-name {
  font-size: 20px;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  transition: opacity 0.3s;
}

.nav-link:hover {
  opacity: 0.8;
}

.icon {
  width: 16px;
  height: 16px;
  display: inline-block;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.user-area {
  position: relative;
}

.login-button {
  background-color: transparent;
  border: 1px solid white;
  color: white;
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
  text-decoration: none;
  display: inline-block;
}

.login-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid white;
  cursor: pointer;
}

.user-dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  position: absolute;
  right: 0;
  top: calc(100% + 5px);
  background-color: white;
  min-width: 160px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  z-index: 1;
  /* 添加过渡效果 */
  transition: opacity 0.2s, visibility 0.2s;
  /* 确保下拉菜单与头像之间没有间隙 */
  padding-top: 0;
}

/* 创建一个连接区域，确保鼠标可以从头像移动到下拉菜单 */
.dropdown-content::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 0;
  width: 100%;
  height: 10px;
  background-color: transparent;
}

.dropdown-item {
  color: #333;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  font-size: 14px;
  transition: background-color 0.3s;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.admin-link {
  color: #e74c3c;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .container {
    justify-content: space-between;
  }
}
</style>
