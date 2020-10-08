import React from 'react';
import { FlexContainer } from 'styles/Containers';

interface ReviewFormProps {
  radioID: string;
}

export const RadioButtonsBar: React.FC<ReviewFormProps> = ({ radioID }) => {
//   const gerRadioValue = (): number => {
//     //Gets value of checked radio button
//     const value = document.querySelector('input[name="' + { radioID } + '"]:checked').value;
//     if (value === null) {
//       return -1;
//     } else {
//       return value;
//     }
//   };

  return (
    <FlexContainer>
      <input type='radio' id={radioID + '1'} name={radioID} value={1} />
      <label htmlFor={radioID + '1'}>1</label>
      <input type='radio' id={radioID + '2'} name={radioID} value={2} />
      <label htmlFor={radioID + '2'}>2</label>
      <input type='radio' id={radioID + '3'} name={radioID} value={3} />
      <label htmlFor={radioID + '3'}>3</label>
      <input type='radio' id={radioID + '4'} name={radioID} value={4} />
      <label htmlFor={radioID + '4'}>4</label>
      <input type='radio' id={radioID + '5'} name={radioID} value={5} />
      <label htmlFor={radioID + '5'}>5</label>
    </FlexContainer>
  );
};
