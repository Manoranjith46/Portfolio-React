import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '@/components/shared/Modal'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/components/shared/Toast'
import { getGoogleAuthUrl, getGitHubAuthUrl } from '@/api/auth'
import '@/css/login.css'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginModal() {
  const { loginModalOpen, setLoginModalOpen, login, isLoading } = useAuthStore()
  const { showToast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        setLoginModalOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setLoginModalOpen])

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password)
      reset()
      showToast('Logged in successfully', 'success')
    } catch {
      showToast('Invalid credentials. Please try again.', 'error')
    }
  }

  const handleClose = () => {
    setLoginModalOpen(false)
    reset()
  }

  return (
    <Modal isOpen={loginModalOpen} onClose={handleClose} title="Admin Login">
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            type="email"
            placeholder="Email"
            className="control"
            {...register('email')}
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            className="control"
            {...register('password')}
          />
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>
        <button type="submit" className="btn btn__primary" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
        <div className="oauth-buttons">
          <a href={getGoogleAuthUrl()} className="oauth-btn">
            Continue with Google
          </a>
          <a href={getGitHubAuthUrl()} className="oauth-btn">
            Continue with GitHub
          </a>
        </div>
      </form>
    </Modal>
  )
}
