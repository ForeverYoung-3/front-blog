import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Layouts
import BlogLayout from './components/layout/BlogLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import { ToastContainer } from './components/common/Toast';

// Blog pages
import HomePage from './pages/blog/HomePage';
import PostDetailPage from './pages/blog/PostDetailPage';
import TagsPage from './pages/blog/TagsPage';
import TagPostsPage from './pages/blog/TagPostsPage';
import SearchPage from './pages/blog/SearchPage';
import LoginPage from './pages/blog/LoginPage';
import RegisterPage from './pages/blog/RegisterPage';
import ProfilePage from './pages/blog/ProfilePage';

// Admin pages
import DashboardPage from './pages/admin/DashboardPage';
import PostListPage from './pages/admin/PostListPage';
import PostEditorPage from './pages/admin/PostEditorPage';
import TagManagePage from './pages/admin/TagManagePage';
import UserManagePage from './pages/admin/UserManagePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          {/* 认证页面（无 Layout） */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 博客展示端 */}
          <Route path="/" element={<BlogLayout><HomePage /></BlogLayout>} />
          <Route path="/post/:slug" element={<BlogLayout><PostDetailPage /></BlogLayout>} />
          <Route path="/tags" element={<BlogLayout><TagsPage /></BlogLayout>} />
          <Route path="/tag/:slug" element={<BlogLayout><TagPostsPage /></BlogLayout>} />
          <Route path="/search" element={<BlogLayout><SearchPage /></BlogLayout>} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <BlogLayout><ProfilePage /></BlogLayout>
              </ProtectedRoute>
            }
          />

          {/* 后台管理端（需要认证） */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireEditor>
                <AdminLayout><DashboardPage /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/posts"
            element={
              <ProtectedRoute requireEditor>
                <AdminLayout><PostListPage /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/posts/new"
            element={
              <ProtectedRoute requireEditor>
                <AdminLayout><PostEditorPage /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/posts/:id/edit"
            element={
              <ProtectedRoute requireEditor>
                <AdminLayout><PostEditorPage /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tags"
            element={
              <ProtectedRoute requireEditor>
                <AdminLayout><TagManagePage /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requireAdmin>
                <AdminLayout><UserManagePage /></AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
