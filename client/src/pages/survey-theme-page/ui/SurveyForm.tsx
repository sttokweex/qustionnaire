import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export interface QuestionWithoutId {
  questionText: string;
  answerOptions: string;
  answerType: 'single' | 'multiple' | 'open';
}

export interface SurveyFormData {
  title: string;
  flag: 'private' | 'public';
  questions: QuestionWithoutId[];
}

const SurveyForm: React.FC<{
  onSubmit: (data: SurveyFormData) => Promise<void>;
}> = ({ onSubmit }) => {
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

  const handleFormSubmit = async (data: SurveyFormData) => {
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

    try {
      await onSubmit(data); // Wait for onSubmit to finish
      toast.success('Survey added successfully!'); // Success notification
      reset({
        questions: [
          { questionText: '', answerOptions: '', answerType: 'single' },
        ],
        title: '',
        flag: 'private',
      });
    } catch (error: any) {
      const errorMessage =
        error.message || 'Error adding theme. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <form
        className="bg-white shadow-lg rounded-lg p-6"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Create New Survey
        </h2>
        <input
          className="input mb-4 p-2 border border-gray-300 rounded w-full"
          {...register('title')}
          placeholder="Survey title"
          required
        />
        <div className="flex justify-center mb-4 space-x-6">
          <label className="flex items-center">
            <input
              type="radio"
              {...register('flag')}
              value="private"
              required
            />
            <span className="ml-2">Private</span>
          </label>
          <label className="flex items-center">
            <input type="radio" {...register('flag')} value="public" />
            <span className="ml-2">Public</span>
          </label>
        </div>
        <h3 className="text-lg font-semibold mb-2">Questions</h3>
        {fields.map((item, index) => (
          <div key={item.id} className="mb-4">
            <input
              className="input mb-2 p-2 border border-gray-300 rounded w-full"
              {...register(`questions.${index}.questionText`)}
              placeholder="Question text"
              required
            />
            <select
              {...register(`questions.${index}.answerType`)}
              className="input mb-2 p-2 border border-gray-300 rounded w-full"
            >
              <option value="single">Single Choice</option>
              <option value="multiple">Multiple Choices</option>
              <option value="open">Open Question</option>
            </select>
            {['single', 'multiple'].includes(
              answerTypes[index]?.answerType,
            ) && (
              <input
                className="input mb-2 p-2 border border-gray-300 rounded w-full"
                {...register(`questions.${index}.answerOptions`)}
                placeholder="Answer options (comma-separated)"
                required
              />
            )}
            <button
              type="button"
              className="remove-question-button text-red-600 hover:text-red-500"
              onClick={() => {
                if (fields.length > 1) {
                  remove(index);
                } else {
                  toast.error('You must have at least one question.'); // Notification when trying to remove the last question
                }
              }}
            >
              Remove Question
            </button>
          </div>
        ))}
        <button
          type="button"
          className="add-question-button bg-indigo-600 text-white rounded py-2 px-4 mb-4 hover:bg-indigo-500 transition duration-300"
          onClick={() =>
            append({
              questionText: '',
              answerOptions: '',
              answerType: 'single',
            })
          }
        >
          Add Question
        </button>
        <button
          type="submit"
          className="submit-button bg-teal-600 text-white rounded py-2 mb-4 w-full hover:bg-teal-500 transition duration-300"
        >
          Create Survey
        </button>
      </form>
    </div>
  );
};

export default SurveyForm;
