import { FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useLoginMutation } from '../../shared/http';
type FormData = {
  username: string;
  password: string;
};

const LoginForm: FC = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const mutation = useLoginMutation();
  const onSubmit: SubmitHandler<FormData> = (data) => {
    const formData = {
      username: data.username,
      password: data.password,
    };
    mutation.mutate(formData, {
      onSuccess: (response) => {
        localStorage.setItem('token', response.accessToken);
        console.log('Ответ сервера:', response);
      },
      onError: (error) => {
        console.error('Ошибка сервера:', error);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username')} placeholder="Имя пользователя" />
      <input {...register('password')} placeholder="Пароль" type="password" />
      <button type="submit">Войти</button>
    </form>
  );
};

export default LoginForm;
