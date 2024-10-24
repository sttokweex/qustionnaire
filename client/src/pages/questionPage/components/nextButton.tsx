// NextButton.tsx
import React from 'react';

interface NextButtonProps {
  onClick: () => void;
  isDisabled: boolean;
}

const NextButton: React.FC<NextButtonProps> = ({ onClick, isDisabled }) => {
  return (
    <button onClick={onClick} disabled={isDisabled}>
      Далее
    </button>
  );
};

export default NextButton;
