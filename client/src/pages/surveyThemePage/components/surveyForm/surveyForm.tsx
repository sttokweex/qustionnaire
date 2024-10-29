import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { SurveyFormData } from './interfaces';

const SurveyForm: React.FC<{ onSubmit: (data: SurveyFormData) => void }> = ({
  onSubmit,
}) => {
  const { register, handleSubmit, control, watch, reset } =
    useForm<SurveyFormData>({
      defaultValues: {
        questions: [
          { questionText: '', answerOptions: '', answerType: 'single' },
        ],
        title: '',
        flag: 'private',
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const answerTypes = watch('questions');

  const handleFormSubmit = (data: SurveyFormData) => {
    data.questions = data.questions.map((question) => {
      if (
        ['single', 'multiple'].includes(question.answerType) &&
        question.answerOptions
      ) {
        const optionsArray = question.answerOptions
          .split(',')
          .map((opt) => opt.trim());
        const uniqueOptions = Array.from(new Set(optionsArray));
        question.answerOptions = uniqueOptions.join(', ');
      }

      return question;
    });

    onSubmit(data);
    reset({
      questions: [],
      title: '',
      flag: 'private',
    });
  };

  return (
    <form
      className="bg-white shadow-lg rounded-lg p-6"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">
        Создать новый опрос
      </h2>
      <input
        className="input mb-4 p-2 border border-gray-300 rounded w-full"
        {...register('title')}
        placeholder="Название опроса"
        required
      />

      <div className="flex justify-center mb-4 space-x-6">
        <label className="flex items-center">
          <input type="radio" {...register('flag')} value="private" required />
          <span className="ml-2">Приватный</span>
        </label>
        <label className="flex items-center">
          <input type="radio" {...register('flag')} value="public" />
          <span className="ml-2">Публичный</span>
        </label>
      </div>

      <h3 className="text-lg font-semibold mb-2">Вопросы</h3>
      {fields.map((item, index) => (
        <div key={item.id} className="mb-4">
          <input
            className="input mb-2 p-2 border border-gray-300 rounded w-full"
            {...register(`questions.${index}.questionText`)}
            placeholder="Текст вопроса"
            required
          />

          <select
            {...register(`questions.${index}.answerType`)}
            className="input mb-2 p-2 border border-gray-300 rounded w-full"
          >
            <option value="single">Один выбор</option>
            <option value="multiple">Несколько выборов</option>
            <option value="open">Открытый вопрос</option>
          </select>

          {['single', 'multiple'].includes(answerTypes[index]?.answerType) && (
            <input
              className="input mb-2 p-2 border border-gray-300 rounded w-full"
              {...register(`questions.${index}.answerOptions`)}
              placeholder="Варианты ответов (через запятую)"
              required
            />
          )}

          <button
            type="button"
            className="remove-question-button text-red-600 hover:text-red-500"
            onClick={() => remove(index)}
          >
            Удалить вопрос
          </button>
        </div>
      ))}

      <button
        type="button"
        className="add-question-button bg-indigo-600 text-white rounded py-2 px-4 mb-4 hover:bg-indigo-500 transition duration-300" // Новые цвета для кнопки "Добавить вопрос"
        onClick={() =>
          append({
            questionText: '',
            answerOptions: '',
            answerType: 'single',
          })
        }
      >
        Добавить вопрос
      </button>

      <button
        type="submit"
        className="submit-button bg-teal-600 text-white rounded py-2 mb-4 w-full hover:bg-teal-500 transition duration-300" // Новые цвета для кнопки "Создать опрос"
      >
        Создать опрос
      </button>
    </form>
  );
};

export default SurveyForm;
