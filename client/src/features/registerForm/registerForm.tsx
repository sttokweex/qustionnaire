import { FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRegistrationMutation } from '@/shared/http';

type FormData = {
  username: string;
  password: string;
};

type RegisterFormProps = {
  setShowForm: (show: boolean) => void;
};

const RegisterForm: FC<RegisterFormProps> = ({ setShowForm }) => {
  const { register, handleSubmit } = useForm<FormData>();
  const mutation = useRegistrationMutation();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    mutation.mutate(data);
  };

  return (
    <div
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 p-4 rounded-md`}
    >
      <button className="float-right" onClick={() => setShowForm(false)}>
        ✕
      </button>{' '}
      <form onSubmit={handleSubmit(onSubmit)} className="w-64 mx-auto">
        <div className="flex flex-col space-y-4">
          <input
            {...register('username')}
            placeholder="Имя пользователя"
            className="border p-2"
          />
          <input
            {...register('password')}
            placeholder="Пароль"
            type="password"
            className="border p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4 w-full"
        >
          Зарегистрировать
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
