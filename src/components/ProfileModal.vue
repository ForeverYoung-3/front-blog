<template>
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>个人信息</h3>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>

      <div class="modal-body">
        <div v-if="message" :class="['message', { 'success': messageType === 'success', 'error': messageType === 'error' }]">
          {{ message }}
        </div>

        <!-- 头像上传区域 -->
        <div class="avatar-section">
          <div class="avatar-container">
            <img :src="avatarPreview || authStore.userAvatar" alt="用户头像" class="avatar-preview" />
            <div class="avatar-overlay" @click="triggerFileInput">
              <span>更换头像</span>
            </div>
          </div>
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            style="display: none"
            @change="handleFileChange"
          />
        </div>

        <!-- 用户信息表单 -->
        <div class="form-section">
          <div class="form-group">
            <label for="username">用户名</label>
            <input
              type="text"
              id="username"
              v-model="formData.username"
              disabled
              class="disabled"
            >
            <small>用户名不可修改</small>
          </div>

          <div class="form-group">
            <label for="nickname">昵称</label>
            <input
              type="text"
              id="nickname"
              v-model="formData.nickname"
              placeholder="请输入昵称"
            >
          </div>

          <div class="form-group">
            <label for="bio">个人简介</label>
            <textarea
              id="bio"
              v-model="formData.bio"
              placeholder="请输入个人简介"
              rows="3"
            ></textarea>
          </div>

          <div class="form-divider"></div>

          <div class="form-group">
            <label for="oldPassword">旧密码</label>
            <input
              type="password"
              id="oldPassword"
              v-model="passwordData.oldPassword"
              placeholder="请输入旧密码"
            >
            <small>如不修改密码，请留空</small>
          </div>

          <div class="form-group">
            <label for="newPassword">新密码</label>
            <input
              type="password"
              id="newPassword"
              v-model="passwordData.newPassword"
              placeholder="请输入新密码"
            >
          </div>

          <div class="form-group">
            <label for="confirmPassword">确认新密码</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="passwordData.confirmPassword"
              placeholder="请再次输入新密码"
            >
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="cancel-button" @click="closeModal">取消</button>
        <button class="submit-button" @click="handleSubmit" :disabled="isSubmitting">
          {{ isSubmitting ? '提交中...' : '保存修改' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'update'])

const authStore = useAuthStore()
const fileInput = ref(null)
const avatarPreview = ref(null)
const avatarFile = ref(null)
const message = ref('')
const messageType = ref('')
const isSubmitting = ref(false)

// 表单数据
const formData = reactive({
  username: '',
  nickname: '',
  bio: ''
})

// 密码数据
const passwordData = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 监听show属性变化，当弹窗显示时初始化表单数据
watch(() => props.show, (newVal) => {
  if (newVal) {
    initFormData()
  }
})

// 初始化表单数据
const initFormData = () => {
  // 重置消息
  message.value = ''
  messageType.value = ''

  // 重置头像预览
  avatarPreview.value = null
  avatarFile.value = null

  // 填充用户信息
  if (authStore.user) {
    formData.username = authStore.user.name
  }

  if (authStore.userInfo) {
    formData.nickname = authStore.userInfo.nickname || ''
    formData.bio = authStore.userInfo.bio || ''
  }

  // 重置密码字段
  passwordData.oldPassword = ''
  passwordData.newPassword = ''
  passwordData.confirmPassword = ''
}

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value.click()
}

// 处理文件选择
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    message.value = '请选择图片文件'
    messageType.value = 'error'
    return
  }

  // 验证文件大小（最大2MB）
  if (file.size > 2 * 1024 * 1024) {
    message.value = '图片大小不能超过2MB'
    messageType.value = 'error'
    return
  }

  // 保存文件并预览
  avatarFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

// 提交表单
const handleSubmit = async () => {
  // 验证表单
  if (!formData.nickname) {
    message.value = '请输入昵称'
    messageType.value = 'error'
    return
  }

  // 如果填写了旧密码，则验证新密码
  if (passwordData.oldPassword) {
    if (!passwordData.newPassword) {
      message.value = '请输入新密码'
      messageType.value = 'error'
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      message.value = '两次输入的新密码不一致'
      messageType.value = 'error'
      return
    }

    if (passwordData.newPassword.length < 6) {
      message.value = '新密码长度不能少于6位'
      messageType.value = 'error'
      return
    }
  }

  isSubmitting.value = true
  message.value = ''

  try {
    // 更新用户信息
    const userInfoResult = await authStore.updateUserInfo({
      nickname: formData.nickname,
      bio: formData.bio
    })

    if (!userInfoResult.success) {
      throw new Error(userInfoResult.message || '更新用户信息失败')
    }

    // 如果有新头像，上传头像
    if (avatarFile.value) {
      const formData = new FormData()
      formData.append('avatar', avatarFile.value)

      const avatarResult = await authStore.uploadAvatar(formData)
      if (!avatarResult.success) {
        throw new Error(avatarResult.message || '上传头像失败')
      }
    }

    // 如果填写了旧密码，修改密码
    if (passwordData.oldPassword) {
      const passwordResult = await authStore.changePassword(
        passwordData.oldPassword,
        passwordData.newPassword
      )

      if (!passwordResult.success) {
        throw new Error(passwordResult.message || '修改密码失败')
      }
    }

    // 全部成功
    message.value = '个人信息更新成功'
    messageType.value = 'success'

    // 通知父组件更新成功
    emit('update')

    // 3秒后关闭弹窗
    setTimeout(() => {
      closeModal()
    }, 3000)
  } catch (error) {
    message.value = error.message || '操作失败，请重试'
    messageType.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}

// 关闭弹窗
const closeModal = () => {
  emit('close')
}

// 组件挂载时初始化表单数据
onMounted(() => {
  if (props.show) {
    initFormData()
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.close-button:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.message {
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 14px;
}

.message.success {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.message.error {
  background-color: #ffebee;
  color: #c62828;
}

.avatar-section {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.avatar-container {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.form-section {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #666;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #42b983;
  outline: none;
}

.form-group input.disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.form-group small {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #999;
}

.form-divider {
  height: 1px;
  background-color: #eee;
  margin: 20px 0;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
}

.cancel-button {
  padding: 8px 16px;
  background-color: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}

.submit-button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #3aa876;
}

.submit-button:disabled {
  background-color: #a8d5c3;
  cursor: not-allowed;
}
</style>
