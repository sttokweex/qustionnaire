import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import { useLoginMutation, useRegistrationMutation } from '@/shared/http';
import InputField from './components/inputField/inputField';
import ToggleFormButton from './components/toggleFormButton/toggleFormButton';
import 'react-toastify/dist/ReactToastify.css';

type FormData = {
  username: string;
  password: string;
};

const AuthPage: FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { register, handleSubmit } = useForm<FormData>();
  const loginMutation = useLoginMutation();
  const registerMutation = useRegistrationMutation();

  const onSubmit = async (data: FormData) => {
    try {
      if (isLogin) {
        await loginMutation.mutateAsync(data);
        toast.success('Login successful!');
      } else {
        await registerMutation.mutateAsync(data);
        toast.success('Registration successful!');
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'An error occurred. Please try again.',
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="bg-white text-gray-800 shadow-lg rounded-lg p-8 w-full max-w-sm transition-transform transform hover:scale-105 duration-300">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? 'Login' : 'Registration'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col space-y-4">
            <InputField
              register={register}
              name="username"
              placeholder="Username"
            />
            <InputField
              register={register}
              name="password"
              placeholder="Password"
              type="password"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg mt-4 w-full transition duration-300"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <ToggleFormButton isLogin={isLogin} setIsLogin={setIsLogin} />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default AuthPage;
