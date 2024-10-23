import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

const SurveyForm: React.FC<{ onSubmit: (data: any) => void }> = ({
  onSubmit,
}) => {
  const { register, handleSubmit, control, watch } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const answerTypes = watch('questions');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} placeholder="Survey Title" required />

      <label>
        <input type="radio" {...register('flag')} value="private" required />
        Приватный
      </label>

      <label>
        <input type="radio" {...register('flag')} value="public" />
        Публичный
      </label>

      <h3>Вопросы</h3>
      {fields.map((item, index) => (
        <div key={item.id}>
          <input
            {...register(`questions.${index}.questionText`)}
            placeholder="Текст вопроса"
            required
          />

          <select {...register(`questions.${index}.answerType`)}>
            <option value="single">Один выбор</option>
            <option value="multiple">Несколько выборов</option>
            <option value="open">Открытый вопрос</option>
          </select>

          {['single', 'multiple'].includes(answerTypes[index]?.answerType) && (
            <input
              {...register(`questions.${index}.answerOptions`)}
              placeholder="Варианты ответов (через запятую)"
              required
            />
          )}

          <button type="button" onClick={() => remove(index)}>
            Удалить вопрос
          </button>
        </div>
      ))}
      <button
        type="button"
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

      <button type="submit">Добавить опрос</button>
    </form>
  );
};

export default SurveyForm;
