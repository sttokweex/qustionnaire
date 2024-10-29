import React from 'react';

interface ToggleFormButtonProps {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
}

const ToggleFormButton: React.FC<ToggleFormButtonProps> = ({
  isLogin,
  setIsLogin,
}) => {
  return (
    <div className="text-center mt-4">
      <span className="text-sm">
        {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
      </span>
      <button
        className="text-blue-400 hover:underline ml-1"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? 'Регистрация' : 'Вход'}
      </button>
    </div>
  );
};

export default ToggleFormButton;
