// AddThemeForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useAddSurveyThemeMutation } from '@/shared/http';

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
    <div>
      <h2>Add New Theme</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('title')} placeholder="Theme Title" required />
        <button type="submit">Add Theme</button>
      </form>
    </div>
  );
};

export default AddThemeForm;
