import React from 'react';
import styled from 'styled-components';
import { FlexContainer } from 'styles/Containers';

interface RadioButtonProps {
  radioID: string;
  defaultChecked: number; // Number between 0 and 5. 0 Means no button is checked by default.
  valueSetter: (value: number) => void;
}

const MarginLabel = styled.label`
  margin-right: 16px;
  line-height: 20px;
  font-family: gilroymedium;
`;

const RadioButton = styled.input`
  transform: scale(1.7);
  margin-right: 10px;
`;

export const RadioButtonsBar: React.FC<RadioButtonProps> = ({
  radioID,
  defaultChecked,
  valueSetter,
}) => {
  return (
    <FlexContainer>
      <RadioButton
        type='radio'
        id={`${radioID}1`}
        name={radioID}
        value={1}
        onChange={() => valueSetter(1)}
        checked={defaultChecked === 1}
      />
      <MarginLabel htmlFor={radioID + '1'}>1</MarginLabel>
      <RadioButton
        type='radio'
        id={`${radioID}2`}
        name={radioID}
        value={2}
        onChange={() => valueSetter(2)}
        checked={defaultChecked === 2}
      />
      <MarginLabel htmlFor={radioID + '2'}>2</MarginLabel>
      <RadioButton
        type='radio'
        id={`${radioID}3`}
        name={radioID}
        value={3}
        onChange={() => valueSetter(3)}
        checked={defaultChecked === 3}
      />
      <MarginLabel htmlFor={radioID + '3'}>3</MarginLabel>
      <RadioButton
        type='radio'
        id={`${radioID}4`}
        name={radioID}
        value={4}
        onChange={() => valueSetter(4)}
        checked={defaultChecked === 4}
      />
      <MarginLabel htmlFor={radioID + '4'}>4</MarginLabel>
      <RadioButton
        type='radio'
        id={`${radioID}5`}
        name={radioID}
        value={5}
        onChange={() => valueSetter(5)}
        checked={defaultChecked === 5}
      />
      <MarginLabel htmlFor={`${radioID}5`}>5</MarginLabel>
    </FlexContainer>
  );
};

export default RadioButtonsBar;
