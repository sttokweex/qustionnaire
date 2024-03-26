import { FC, useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Context } from '../../app/main';

type FormData = {
  username: string;
  password: string;
};

const LoginForm: FC = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const { store } = useContext(Context);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const formData = {
      username: data.username,
      password: data.password,
    };
    store.login(formData.username, formData.password);
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
