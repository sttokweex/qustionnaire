import React from 'react';
import { useLogoutMutation } from '@/shared/http'; // Импортируем useLogoutMutation

interface HeaderProps {
  username: string;
  onRefetch: () => void; // Пропс для refetch
}

const Header: React.FC<HeaderProps> = ({ username, onRefetch }) => {
  const mutationLogout = useLogoutMutation(onRefetch); // Используем мутацию логаута

  const handleLogout = () => {
    mutationLogout.mutate(); // Вызываем мутацию логаута
  };

  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 flex justify-between items-center shadow-md">
      <div className="text-lg cursor-default font-semibold">{username}</div>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-500 transition duration-300"
      >
        Выйти
      </button>
    </header>
  );
};

export default Header;