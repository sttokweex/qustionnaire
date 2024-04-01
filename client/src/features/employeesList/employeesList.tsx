import { FC, useEffect, useState } from 'react';
import { useGetEmployees } from '../../shared/http';
import { useNavigate } from 'react-router-dom';
interface Employee {
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
const EmployeesList: FC = () => {
  const history = useNavigate();

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const employeesQuery = useGetEmployees();
  useEffect(() => {
    employeesQuery.refetch();
  }, []);
  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    history(`/employee/${employee.id}`);
  };

  if (employeesQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (employeesQuery.isError) {
    return <p>Error fetching data</p>;
  }

  return (
    <>
      <div className="grid grid-cols-8 gap-2 bg-gray-200 p-2 justify-items-center border-2 border-indigo-200">
        <p>Initials</p>
        <p>Gender</p>
        <p>Birth Date</p>
        <p>indetificator</p>
        <p>Phone</p>
        <p>Email</p>
        <p>Additional Info</p>
        <p>SNILS</p>
      </div>
      {employeesQuery.data?.map((employee: Employee) => (
        <div
          key={employee.id}
          className="grid grid-cols-8 gap-2 bg-gray-100 p-2 cursor-pointer justify-items-center border border-gray-300" // Added border style
          onClick={() => handleEmployeeClick(employee)}
        >
          <p>{employee.initials}</p>
          <p>{employee.gender}</p>
          <p>{employee.birth_data}</p>
          <p>{employee.indetificator}</p>
          <p>{employee.phone}</p>
          <p>{employee.email}</p>
          <p>{employee.additional_info}</p>
          <p>{employee.snils}</p>
        </div>
      ))}
      {selectedEmployee && (
        <div>
          <p>Selected Employee: {selectedEmployee.id}</p>
        </div>
      )}
    </>
  );
};

export default EmployeesList;
