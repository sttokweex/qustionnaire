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
        {isLogin ? 'No account?' : 'Already have an account?'}
      </span>
      <button
        className="text-blue-400 hover:underline ml-1"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? 'Register' : 'Login'}
      </button>
    </div>
  );
};

export default ToggleFormButton;
