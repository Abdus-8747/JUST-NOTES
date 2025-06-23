import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import PasswordInput from '../components/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../utils/helper';
import axiosInstance from '../utils/axiosInstance';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Please enter your name!');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email!');
      return;
    }

    if (!password) {
      setError('Please enter the password!');
      return;
    }

    setError(null);

    try {
      const response = await axiosInstance.post('/create-account', {
        fullName: name.trim(),
        email,
        password,
      });

      if (response.data?.error) {
        setError(response.data.message);
        return;
      }

      if (response.data?.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Please Refresh The Page Once!');
      }
    }
  };

  // Clear error when user types
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError(null);
  };

  const isFormValid = name.trim() && validateEmail(email) && password;

  return (
    <>
      <Navbar />

      <main className='flex items-center justify-center min-h-screen px-2 bg-gradient-to-b from-slate-50 to-slate-100'>
        <section className='w-full max-w-md bg-white rounded-2xl shadow-xl px-8 py-10 transition-all duration-300'>
          <form onSubmit={handleSignUp} noValidate>
            <h4 className='text-2xl mb-7 font-semibold text-center'>Sign Up</h4>

            <label htmlFor='name' className='sr-only'>
              Full Name
            </label>
            <input
              id='name'
              type='text'
              placeholder='Full Name'
              className='input-box'
              value={name}
              onChange={handleInputChange(setName)}
              autoComplete='name'
              aria-invalid={!!error && !name.trim()}
              aria-describedby='name-error'
            />
            {error && !name.trim() && (
              <p id='name-error' className='text-red-500 text-xs mb-2'>
                {error}
              </p>
            )}

            <label htmlFor='email' className='sr-only'>
              Email
            </label>
            <input
              id='email'
              type='email'
              placeholder='Email'
              className='input-box'
              value={email}
              onChange={handleInputChange(setEmail)}
              autoComplete='email'
              aria-invalid={!!error && !validateEmail(email)}
              aria-describedby='email-error'
            />
            {error && !validateEmail(email) && (
              <p id='email-error' className='text-red-500 text-xs mb-2'>
                {error}
              </p>
            )}

            <PasswordInput
              value={password}
              onChange={handleInputChange(setPassword)}
              placeholder='Password'
            />
            {error && !password && (
              <p className='text-red-500 text-xs mb-2'>{error}</p>
            )}

            {error && !(!name.trim() || !validateEmail(email) || !password) && (
              <p className='text-red-500 text-xs mb-2'>{error}</p>
            )}

            <button
              type='submit'
              className='btn-primary mt-3'
              disabled={!isFormValid}
              aria-disabled={!isFormValid}
            >
              Create Account
            </button>

            <p className='text-sm text-center mt-6'>
              Already have an account?{' '}
              <Link to='/login' className='font-medium text-blue-500 underline'>
                Login
              </Link>
            </p>
          </form>
        </section>
      </main>
    </>
  );
};

export default SignUp;
