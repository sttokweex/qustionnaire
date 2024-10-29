import React from 'react';
import { useForm } from 'react-hook-form';
import { useAddSurveyThemeMutation } from '@/shared/http';
import './styles.css';

const AddThemeForm: React.FC<{ onThemeAdded: () => void }> = ({
  onThemeAdded,
}) => {
  const addThemeMutation = useAddSurveyThemeMutation();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    await addThemeMutation.mutateAsync(data);
    onThemeAdded();
  };

  return (
    <div className="container">
      <h2 className="title">Add New Theme</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <input
            {...register('title')}
            placeholder="Theme Title"
            required
            className="input"
          />
        </div>
        <button type="submit" className="button">
          Add Theme
        </button>
      </form>
    </div>
  );
};

export default AddThemeForm;
