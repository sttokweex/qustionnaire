import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useLoginMutation, useRegistrationMutation } from '@/shared/http';
import ToggleFormButton from './ToggleFormButton';
import 'react-toastify/dist/ReactToastify.css';

interface FormData {
  username: string;
  password: string;
}

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
        error?.response?.data?.message ||
          'An error occurred. Please try again.',
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
            <input
              {...register('username')}
              placeholder="Username"
              type="text"
              className="border border-gray-300 bg-gray-100 text-gray-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
            <input
              {...register('password')}
              placeholder="Password"
              type="password"
              className="border border-gray-300 bg-gray-100 text-gray-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
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
    </div>
  );
};

export default AuthPage;
