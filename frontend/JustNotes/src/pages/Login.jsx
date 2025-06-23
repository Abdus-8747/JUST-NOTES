import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import PasswordInput from '../components/PasswordInput'
import { validateEmail } from '../utils/helper'
import axiosInstance from '../utils/axiosInstance'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      const response = await axiosInstance.post('/login', { email, password })

      if (response.data?.accessToken) {
        localStorage.setItem('token', response.data.accessToken)
        navigate('/dashboard')
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError('Please Refresh The Page Once!')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl px-8 py-10 transition-all duration-300">
          <form onSubmit={handleLogin} className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-800 text-center">Login to Just Notes</h2>
            <p className="text-sm text-center text-slate-500">Welcome back! Please enter your details.</p>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="input-box"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className={`btn-primary w-full ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            <p className="text-sm text-center text-slate-600">
              Not registered yet?{' '}
              <Link
                to="/signup"
                className="font-medium text-blue-500 underline hover:text-blue-600"
              >
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login
