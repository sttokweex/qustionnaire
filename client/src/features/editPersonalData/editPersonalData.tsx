import { FC, useState, ChangeEvent, useContext } from 'react';
import { Context } from '../../app/main';
import { observer } from 'mobx-react-lite';
import { useMutation } from 'react-query'; // Step 1: Import useMutation

interface IEmployee {
  id: number;
  initials: string;
  gender: string;
  birth_data: string;
  indetificator: string;
  phone: string;
  email: string;
  additional_info: string;
  snils: string;
}

const EditPersonalData: FC = () => {
  const { store } = useContext(Context);
  const [formData, setFormData] = useState<IEmployee>({
    id: store.employee.id,
    initials: store.employee.initials,
    gender: store.employee.gender,
    birth_data: store.employee.birth_data,
    indetificator: store.employee.indetificator,
    phone: store.employee.phone,
    email: store.employee.email,
    additional_info: store.employee.additional_info,
    snils: store.employee.snils,
  });
  console.log(formData);
  const mutation = useMutation((updatedData: IEmployee) => {
    return fetch('http://localhost:3000/update', {
      method: 'POST',
      body: JSON.stringify({ id: updatedData.id, newData: updatedData }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    mutation.mutate(formData);
    store.employee = formData;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 text-left h-full w-3/5 mx-auto">
      <div className="mx-auto">
        <div className="flex flex-col space-y-4">
          <div className="mx-auto">
            <h2 className="text-xl font-bold py-4">Личные данные</h2>
          </div>
          <h1>initials</h1>
          <input
            type="text"
            name="initials"
            value={formData.initials}
            onChange={handleChange}
          />
          <h1>gender</h1>
          <input
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          />
          <h1>birth_data</h1>
          <input
            type="text"
            name="birth_data"
            value={formData.birth_data}
            onChange={handleChange}
          />
          <h1>indetificator</h1>
          <input
            type="text"
            name="indetificator"
            value={formData.indetificator}
            onChange={handleChange}
          />
          <h1>additional_info</h1>
          <input
            type="text"
            name="additional_info"
            value={formData.additional_info}
            onChange={handleChange}
          />
          <h1>snils</h1>
          <input
            type="text"
            name="snils"
            value={formData.snils}
            onChange={handleChange}
          />
          <div className="mx-auto">
            <h2 className="text-xl font-bold py-4">Контактные данные</h2>
          </div>
          <h1>phone</h1>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <h1>email</h1>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-1/3 py-2 px-4 rounded mx-auto"
            onClick={handleUpdate}
          >
            Обновить
          </button>{' '}
        </div>
      </div>
    </div>
  );
};

export default observer(EditPersonalData);
