import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoginMutation, useRegistrationMutation } from '@/shared/http';
import InputField from './components/inputField/inputField';
import ToggleFormButton from './components/toggleFormButton/toggleFormButton';

type FormData = {
  username: string;
  password: string;
};

const AuthPage: FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { register, handleSubmit } = useForm<FormData>();
  const loginMutation = useLoginMutation();
  const registerMutation = useRegistrationMutation();

  const onSubmit = (data: FormData) => {
    if (isLogin) {
      loginMutation.mutate(data);
    } else {
      registerMutation.mutate(data);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="bg-white text-gray-800 shadow-lg rounded-lg p-8 w-full max-w-sm transition-transform transform hover:scale-105 duration-300">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? 'Вход' : 'Регистрация'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col space-y-4">
            <InputField
              register={register}
              name="username"
              placeholder="Имя пользователя"
            />
            <InputField
              register={register}
              name="password"
              placeholder="Пароль"
              type="password"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg mt-4 w-full transition duration-300"
          >
            {isLogin ? 'Войти' : 'Зарегистрировать'}
          </button>
        </form>
        <ToggleFormButton isLogin={isLogin} setIsLogin={setIsLogin} />
      </div>
    </div>
  );
};

export default AuthPage;
