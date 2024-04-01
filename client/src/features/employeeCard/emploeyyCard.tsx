import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetEmployee } from '../../shared/http';
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
    return (
      <>
        <div className="bg-white shadow-md rounded-lg p-4 mx-auto text-left h-full ml-96 w-2/3">
          <div className="ml-96">
            <h2 className="text-4xl font-bold pb-4 ">{employee.initials}</h2>
            <p>
              <strong className="text-gray-500">Пол:</strong> {employee.gender}
            </p>
            <p>
              <strong className="text-gray-500">Дата рождения:</strong>{' '}
              {employee.birth_data}
            </p>
            <p>
              <strong className="text-gray-500">СНИЛС:</strong> {employee.snils}
            </p>
            <p>
              <strong className="text-gray-500">Тип пользователя:</strong>{' '}
              сотрудник
            </p>
            <h2 className="text-xl font-bold py-4">Контактные данные</h2>
            <p>
              <strong className="text-gray-500">email:</strong> {employee.email}
            </p>
            <p>
              <strong className="text-gray-500">phone:</strong> {employee.phone}
            </p>
            <h2 className="text-xl font-bold py-4">
              Дополнительная информация
            </h2>
            <p>{employee.additional_info}</p>
          </div>

          <div className="bg-gray-100 mx-auto text-left my-4 p-4 ml-96 w-2/3 ">
            <h1 className="text-gray-500 ">Кадровые назначения</h1>
          </div>
          <div className=" mx-auto text-left ml-96 border-t-4">
            {purposeMain !== null && (
              <div className="">
                <h2 className="text-xl font-bold py-4">Основное Назначение</h2>
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
          </div>
          <div className="bg-gray-100 mx-auto text-left my-4 p-4 ml-96 w-2/3">
            <h1 className="text-gray-500 ">Ограничения доступа</h1>
          </div>
          <div className="mx-auto text-left ml-96 border-t-4">
            {bans.map((item: ban, index: number) => {
              return (
                <div key={index}>
                  <p className="text-gray-500">
                    <strong>Период доступа:</strong>{' '}
                    {`с ${item['date_from']} по ${item['date_to']}`}
                  </p>
                  <p className="text-gray-500">
                    <strong>рабочее расспсание:</strong> {`${item['schedule']}`}
                  </p>
                  <p className="text-gray-500">
                    <strong>Доступ по IP-адресам:</strong>{' '}
                    {item['ip_ban'] ? 'ограничен' : 'не ограничен'}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="bg-gray-100 mx-auto text-left my-4 p-4 ml-96 w-2/3">
            <h1 className="text-gray-500 ">Права доступа</h1>
          </div>
        </div>
      </>
    );
  } else {
    return <h1>Loading...</h1>;
  }
};
export default EmployeeCard;
