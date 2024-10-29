import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAddSurveyThemeMutation } from '@/shared/http';

interface FormValues {
  title: string;
}

const AddThemeForm: React.FC<{ onThemeAdded: () => void }> = ({
  onThemeAdded,
}) => {
  const addThemeMutation = useAddSurveyThemeMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await addThemeMutation.mutateAsync(data);
    onThemeAdded();
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Добавить новую тему
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <input
            {...register('title', { required: 'Название темы обязательно' })}
            placeholder="Название темы"
            className={`border ${errors.title ? 'border-red-600' : 'border-gray-300'} rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 shadow-sm`}
          />
          {errors.title && (
            <p className="text-red-600 mt-1">
              {errors.title?.message as string}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-400 transition duration-300 shadow-md"
        >
          Добавить тему
        </button>
      </form>
    </div>
  );
};

export default AddThemeForm;
