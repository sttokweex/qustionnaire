import React, { useState } from 'react';
import LoginForm from '@/features/loginForm/LoginForm';
import RegisterForm from '@/features/registerForm/registerForm';
const AuthPage: React.FC = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const handleShowRegisterForm = (show: boolean) => {
    setShowRegisterForm(show);
  };
  const handleShowLoginForm = (show: boolean) => {
    setShowLoginForm(show);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={() => setShowRegisterForm(true)}
      >
        Регистрация
      </button>
      {showRegisterForm && (
        <RegisterForm setShowForm={handleShowRegisterForm} />
      )}
      <button
        className="bg-green-500 text-white font-bold py-2 px-4 rounded"
        onClick={() => setShowLoginForm(true)}
      >
        Войти
      </button>
      {showLoginForm && <LoginForm setShowForm={handleShowLoginForm} />}
    </div>
  );
};

export default AuthPage;
