import { FC, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetEmployee } from '../../shared/http';
import { observer } from 'mobx-react-lite';
interface purpose {
  id: number;
  user_id: number;
  purpose: string;
  employer: string;
  position: string;
  cabinet: string;
  organization: string;
  date_from: string;
  date_to: string;
}
interface timeof {
  id: number;
  user_id: number;
  purpose: number;
  cause: string;
  date_from: string;
  date_to: string;
}
interface ban {
  id: number;
  user_id: number;
  schedule: string;
  ip_ban: boolean;
  date_from: string;
  date_to: string;
}
const EmployeeCard: FC = () => {
  const history = useNavigate();
  const { id } = useParams();
  const employeesQuery = useGetEmployee(id);
  useEffect(() => {
    employeesQuery.refetch();
  }, []);

  if (employeesQuery.isSuccess) {
    let purposeMain: purpose | null = null;
    let purposeAdditional: purpose | null = null;
    const employee = employeesQuery.data?.employe;
    const timeof = employeesQuery.data?.timeof;
    const bans = employeesQuery.data?.ban;
    employeesQuery.data?.purpose.map((item: purpose) => {
      if (item.purpose == 'main') {
        purposeMain = item;
      }
      if (item.purpose == 'additional') {
        purposeAdditional = item;
      }
    });
    const editPersData = () => {
      history('/employee/update');
    };
    return (
      <>
        <div className="bg-white shadow-md rounded-lg p-4 text-left h-full w-3/5 mx-auto">
          <div className="mx-auto">
            <div className="text-center">
              <h2 className="text-4xl font-bold pb-4">{employee.initials}</h2>
            </div>
            <div className="bg-gray-100 text-left my-4 p-4 flex items-center justify-between">
              <h1 className="text-gray-500">Личные данные</h1>
              <button
                onClick={editPersData}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4  px-4 rounded"
              >
                Редактировать
              </button>
            </div>

            <div className=" border-t-4 pt-4">
              <p>
                <strong className="text-gray-500">Пол:</strong>{' '}
                {employee.gender}
              </p>
              <p>
                <strong className="text-gray-500">Дата рождения:</strong>{' '}
                {employee.birth_data}
              </p>
              <p>
                <strong className="text-gray-500">Индетификатор:</strong>{' '}
                {employee.indetificator}
              </p>
              <p>
                <strong className="text-gray-500">СНИЛС:</strong>{' '}
                {employee.snils}
              </p>
              <p>
                <strong className="text-gray-500">Тип пользователя:</strong>{' '}
                сотрудник
              </p>
              <h2 className="text-xl font-bold py-4">Контактные данные</h2>
              <p>
                <strong className="text-gray-500">email:</strong>{' '}
                {employee.email}
              </p>
              <p>
                <strong className="text-gray-500">phone:</strong>{' '}
                {employee.phone}
              </p>
              <h2 className="text-xl font-bold py-4">
                Дополнительная информация
              </h2>
              <p>{employee.additional_info}</p>
            </div>

            <div className="bg-gray-100  text-left my-4 p-4   flex items-center justify-between">
              <h1 className="text-gray-500">Кадровые назначения</h1>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Редактировать
              </button>
            </div>
            <div className="  text-left  border-t-4">
              {purposeMain !== null && (
                <div className="">
                  <h2 className="text-xl font-bold py-4">
                    Основное Назначение
                  </h2>
                  <p>
                    <strong className="text-gray-500">дата приема:</strong>{' '}
                    {purposeMain['date_from']}
                  </p>
                  <p>
                    <strong className="text-gray-500">руководитель:</strong>{' '}
                    {purposeMain['employer']}
                  </p>
                  <p>
                    <strong className="text-gray-500">должность:</strong>{' '}
                    {purposeMain['position']}
                  </p>
                  <p>
                    <strong className="text-gray-500">кабинет:</strong>{' '}
                    {purposeMain['cabinet']}
                  </p>
                  <p>
                    <strong className="text-gray-500">организация:</strong>{' '}
                    {purposeMain['organization']}
                  </p>
                  <a className="text-blue-500 hover:underline" href="#">
                    Периоды неисполнения должностых обязанностей
                  </a>
                  {timeof.map((item: timeof, index: number) => {
                    return (
                      <p
                        key={index}
                      >{`${item['cause']} c ${item['date_from']} по ${item['date_to']}`}</p>
                    );
                  })}
                </div>
              )}
              {purposeAdditional !== null && (
                <div className="">
                  <h2 className="text-xl font-bold py-4">
                    Дополнительно Назначение
                  </h2>
                  <p>
                    <strong className="text-gray-500">дата приема:</strong>{' '}
                    {purposeAdditional['date_from']}
                  </p>
                  <p>
                    <strong className="text-gray-500">руководитель:</strong>{' '}
                    {purposeAdditional['employer']}
                  </p>
                  <p>
                    <strong className="text-gray-500">должность:</strong>{' '}
                    {purposeAdditional['position']}
                  </p>
                  <p>
                    <strong className="text-gray-500">кабинет:</strong>{' '}
                    {purposeAdditional['cabinet']}
                  </p>
                  <p>
                    <strong className="text-gray-500">организация:</strong>{' '}
                    {purposeAdditional['organization']}
                  </p>
                  <a className="text-blue-500 hover:underline">
                    Периоды неисполнения должностых обязанностей
                  </a>
                  {timeof.map((item: timeof, index: number) => {
                    return (
                      <p
                        key={index}
                      >{`${item['cause']} c ${item['date_from']} по ${item['date_to']}`}</p>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="bg-gray-100  text-left my-4 p-4  flex items-center justify-between">
              <h1 className="text-gray-500">Ограничения доступа</h1>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Редактировать
              </button>
            </div>
            <div className="mx-auto text-left  border-t-4 pt-4">
              {bans.map((item: ban, index: number) => {
                return (
                  <div key={index}>
                    <p className="text-gray-500">
                      <strong>Период доступа:</strong>{' '}
                      {`с ${item['date_from']} по ${item['date_to']}`}
                    </p>
                    <p className="text-gray-500">
                      <strong>рабочее расспсание:</strong>{' '}
                      {`${item['schedule']}`}
                    </p>
                    <p className="text-gray-500">
                      <strong>Доступ по IP-адресам:</strong>{' '}
                      {item['ip_ban'] ? 'ограничен' : 'не ограничен'}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="bg-gray-100  text-left my-4 p-4  flex items-center justify-between">
              <h1 className="text-gray-500">Права доступа</h1>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Редактировать
              </button>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <h1>Loading...</h1>;
  }
};
export default observer(EmployeeCard);
