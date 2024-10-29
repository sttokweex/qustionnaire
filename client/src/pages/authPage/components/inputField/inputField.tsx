import React from 'react';

interface InputFieldProps {
  register: any;
  name: string;
  placeholder: string;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  register,
  name,
  placeholder,
  type = 'text',
}) => {
  return (
    <input
      {...register(name)}
      placeholder={placeholder}
      type={type}
      className="border border-gray-300 bg-gray-100 text-gray-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
    />
  );
};

export default InputField;
