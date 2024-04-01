import React from 'react';
import { useNavigate } from 'react-router-dom';

const DataButton: React.FC = () => {
  const history = useNavigate();
  const handleButtonClick = () => {
    history('/employees');
  };
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="grid grid-cols-2 grid-rows-2 gap-y-24 gap-x-32">
        <button
          onClick={handleButtonClick}
          className="w-96 h-56 border-4 border-gray-950 shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 flex flex-col justify-start items-center "
        >
          <h1 className="text-black-500 font-black text-3xl mb-4 ">
            Сотрудники
          </h1>
          <p className="mb-2">Посмотреть список сотрудников</p>
          <p className="mb-2">Перевести сотрудников в архив</p>
          <p>Добавить нового</p>
        </button>

        <button className="w-96 h-56 border-4 border-gray-950 shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 flex flex-col justify-start items-center ">
          <h1 className="text-black-500 font-black text-3xl mb-4 ">
            Организации
          </h1>
          <p className="mb-2">Посмотреть список организаций</p>
          <p className="mb-2">Перевести организации в архив</p>
          <p>Добавить новую</p>
        </button>
        <button className="w-96 h-56 border-4 border-gray-950 shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 flex flex-col justify-start items-center ">
          <h1 className="text-black-500 font-black text-3xl mb-4 ">
            Роли и права доступа
          </h1>
          <p className="mb-2">Посмотреть список ролей</p>
          <p className="mb-2">Посмотреть список прав доступа</p>
        </button>
        <button className="w-96 h-56 border-4 border-gray-950 shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 flex flex-col justify-start items-center ">
          <h1 className="text-black-500 font-black text-3xl mb-4 t">
            Групповые операции
          </h1>
          <p className="mb-1">Перевести организации в архив</p>
          <p className="mb-1">Перевести сотрудников в архив</p>
          <p className="mb-1">Назначение/изменение состава ролей</p>
          <p className="mb-1">Перевод в архив учетных записей</p>
          <p className="mb-1">Назначение/изменение состава прав доступа</p>
        </button>
      </div>
    </div>
  );
};

export default DataButton;
