import { FC, useContext } from 'react';
import DataButton from '../../features/dataButton/dataButton';
import { Context } from '../../app/main';
import { useLogoutMutation } from '../../shared/http';
import { observer } from 'mobx-react-lite';
const MainPage: FC = () => {
  const mutation = useLogoutMutation();
  const { store } = useContext(Context);
  const handleLogout = () => {
    store.logout(mutation);
  };
  return (
    <>
      <div className="flex items-center justify-between bg-gray-200 p-4">
        <h1 className="text-xl font-bold">{` ${store.user.username} `}</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          выход
        </button>
      </div>
      <DataButton />
    </>
  );
};
export default observer(MainPage);
