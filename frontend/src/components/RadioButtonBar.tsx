import React from 'react';
import styled from 'styled-components';
import { FlexContainer } from 'styles/Containers';

interface ReviewFormProps {
  radioID: string;
}

const MarginLabel = styled.label`
  margin-right: 8px;
`;

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
      <MarginLabel htmlFor={radioID + '1'}>1</MarginLabel>
      <input type='radio' id={radioID + '2'} name={radioID} value={2} />
      <MarginLabel htmlFor={radioID + '2'}>2</MarginLabel>
      <input type='radio' id={radioID + '3'} name={radioID} value={3} />
      <MarginLabel htmlFor={radioID + '3'}>3</MarginLabel>
      <input type='radio' id={radioID + '4'} name={radioID} value={4} />
      <MarginLabel htmlFor={radioID + '4'}>4</MarginLabel>
      <input type='radio' id={radioID + '5'} name={radioID} value={5} />
      <MarginLabel htmlFor={radioID + '5'}>5</MarginLabel>
    </FlexContainer>
  );
};
