import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { SurveyFormData } from './interfaces';
import './styles.css';

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
      title: '', // Теперь добавляем очистку названия.
      flag: 'private', // Чтобы сбросился флаг в первоначальное состояние.
    });
  };

  return (
    <form className="form-container" onSubmit={handleSubmit(handleFormSubmit)}>
      <input
        className="input"
        {...register('title')}
        placeholder="Survey Title"
        required
      />

      <label className="radio-label">
        <input type="radio" {...register('flag')} value="private" required />
        Приватный
      </label>

      <label className="radio-label">
        <input type="radio" {...register('flag')} value="public" />
        Публичный
      </label>

      <h3>Вопросы</h3>
      {fields.map((item, index) => (
        <div key={item.id}>
          <input
            className="input"
            {...register(`questions.${index}.questionText`)}
            placeholder="Текст вопроса"
            required
          />

          <select
            {...register(`questions.${index}.answerType`)}
            className="input mb-4"
          >
            <option value="single">Один выбор</option>
            <option value="multiple">Несколько выборов</option>
            <option value="open">Открытый вопрос</option>
          </select>

          {['single', 'multiple'].includes(answerTypes[index]?.answerType) && (
            <input
              className="input"
              {...register(`questions.${index}.answerOptions`)}
              placeholder="Варианты ответов (через запятую)"
              required
            />
          )}

          <button
            type="button"
            className="remove-question-button"
            onClick={() => remove(index)}
          >
            Удалить вопрос
          </button>
        </div>
      ))}

      <button
        type="button"
        className="add-question-button"
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

      <button type="submit" className="submit-button">
        Добавить опрос
      </button>
    </form>
  );
};

export default SurveyForm;
