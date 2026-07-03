import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { FiMail, FiLock, FiActivity, FiArrowRight } from 'react-icons/fi';
import styles from './Login.module.css';

export const Login: React.FC = () => {
  const { login, isLoggedIn, addToast } = useShop();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Mode state: 'login' or 'register'
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string; form?: string }>({});

  const rawRedirect = searchParams.get('redirect') || '/';
  const redirectPath = rawRedirect.startsWith('/') ? rawRedirect : '/' + rawRedirect;

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate(redirectPath);
    }
  }, [isLoggedIn, navigate, redirectPath]);

  const validate = (): boolean => {
    const tempErrors: typeof errors = {};
    let isValid = true;

    if (!email.trim()) {
      tempErrors.email = 'Email address is required';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        tempErrors.email = 'Please enter a valid email address';
        isValid = false;
      }
    }

    if (!password.trim()) {
      tempErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (isRegisterMode) {
      if (!confirmPassword.trim()) {
        tempErrors.confirmPassword = 'Please confirm your password';
        isValid = false;
      } else if (confirmPassword !== password) {
        tempErrors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const endpoint = isRegisterMode ? '/api/auth/register' : '/api/auth/login';
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(email);
        navigate(redirectPath);
      } else {
        setErrors((prev) => ({ ...prev, form: data.error || 'Authentication failed' }));
        addToast(data.error || 'Authentication failed', 'error');
      }
    } catch {
      setErrors((prev) => ({ ...prev, form: 'Failed to connect to authentication server' }));
      addToast('Failed to connect to authentication server', 'error');
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.container}>
        <div className={styles.loginCard}>
          {/* Logo */}
          <div className={styles.logoContainer}>
            <FiActivity className={styles.logoIcon} />
            <h1 className={styles.logoText}>
              Mart<span className={styles.logoAccent}>X</span>
            </h1>
          </div>

          <h2 className={styles.title}>{isRegisterMode ? 'Create Account' : 'Welcome Back'}</h2>
          <p className={styles.subtitle}>
            {isRegisterMode
              ? 'Sign up to register your details and check out items'
              : 'Enter details to log in to your MartX account'}
          </p>

          {errors.form && <div className={styles.formGlobalError}>{errors.form}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Email Field */}
            <div className={styles.formField}>
              <label htmlFor="email">Email Address</label>
              <div className={`${styles.inputWrapper} ${errors.email ? styles.inputErrorBorder : ''}`}>
                <FiMail className={styles.inputIcon} />
                <input
                  type="email"
                  id="email"
                  placeholder="yourname@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                />
              </div>
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            {/* Password Field */}
            <div className={styles.formField}>
              <div className={styles.passwordLabelRow}>
                <label htmlFor="password">Password</label>
                {!isRegisterMode && (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      addToast('Password reset email sent (simulation).', 'info');
                    }}
                    className={styles.forgotLink}
                  >
                    Forgot?
                  </a>
                )}
              </div>
              <div className={`${styles.inputWrapper} ${errors.password ? styles.inputErrorBorder : ''}`}>
                <FiLock className={styles.inputIcon} />
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                />
              </div>
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            {/* Confirm Password (only in Register Mode) */}
            {isRegisterMode && (
              <div className={styles.formField}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className={`${styles.inputWrapper} ${errors.confirmPassword ? styles.inputErrorBorder : ''}`}>
                  <FiLock className={styles.inputIcon} />
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }}
                  />
                </div>
                {errors.confirmPassword && (
                  <span className={styles.errorText}>{errors.confirmPassword}</span>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" className={styles.submitBtn}>
              <span>{isRegisterMode ? 'Sign Up' : 'Log In'}</span>
              <FiArrowRight />
            </button>
          </form>

          {/* Toggle Mode */}
          <div className={styles.signupPrompt}>
            <span>{isRegisterMode ? 'Already have an account? ' : "Don't have an account? "}</span>
            <button
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setErrors({});
              }}
              className={styles.toggleModeBtn}
            >
              {isRegisterMode ? 'Log In' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
