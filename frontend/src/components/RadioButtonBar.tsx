import React from 'react';
import styled from 'styled-components';
import { FlexContainer } from 'styles/Containers';

interface RadioButtonProps {
  radioID: string;
  valueVariable: number; // Number between 0 and 5. 0 Means no button is checked by default.
  valueSetter: (value: number) => void;
}

const MarginNumberLabel = styled.label`
  margin-right: 16px;
  line-height: 20px;
  font-family: gilroymedium;
`;

const MarginTextLabel = styled(MarginNumberLabel)`
  margin: 0 5px 0 0;
  font-family: gilroylight;
  font-size: 0.8em;
`;

const MirrorMarginTextLabel = styled(MarginTextLabel)`
  text-align: right;
`;

const RadioButton = styled.input`
  transform: scale(1.7);
  margin-right: 10px;
`;

// Used in review form, does not use variable to temporarily store value, just the radio button element itself
export const ScoreRadioButtonsBar: React.FC<RadioButtonProps> = ({
  radioID,
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
      />
      <MarginNumberLabel htmlFor={radioID + '1'}>1</MarginNumberLabel>
      <RadioButton
        type='radio'
        id={`${radioID}2`}
        name={radioID}
        value={2}
        onChange={() => valueSetter(2)}
      />
      <MarginNumberLabel htmlFor={radioID + '2'}>2</MarginNumberLabel>
      <RadioButton
        type='radio'
        id={`${radioID}3`}
        name={radioID}
        value={3}
        onChange={() => valueSetter(3)}
      />
      <MarginNumberLabel htmlFor={radioID + '3'}>3</MarginNumberLabel>
      <RadioButton
        type='radio'
        id={`${radioID}4`}
        name={radioID}
        value={4}
        onChange={() => valueSetter(4)}
      />
      <MarginNumberLabel htmlFor={radioID + '4'}>4</MarginNumberLabel>
      <RadioButton
        type='radio'
        id={`${radioID}5`}
        name={radioID}
        value={5}
        onChange={() => valueSetter(5)}
      />
      <MarginNumberLabel htmlFor={`${radioID}5`}>5</MarginNumberLabel>
    </FlexContainer>
  );
};

// Used for advanced sorting interface, valueVariable must be updated whenever a radiobutton is clicked
export const WeightRadioButtonsBar: React.FC<RadioButtonProps> = ({
  radioID,
  valueVariable,
  valueSetter,
}) => {
  return (
    <FlexContainer>
      <MirrorMarginTextLabel htmlFor={radioID + '0'}>Ikke viktig</MirrorMarginTextLabel>
      <RadioButton
        type='radio'
        id={`${radioID}0`}
        name={radioID}
        value={0}
        onChange={() => valueSetter(0)}
        checked={valueVariable === 0}
      />
      <RadioButton
        type='radio'
        id={`${radioID}1`}
        name={radioID}
        value={1}
        onChange={() => valueSetter(1)}
        checked={valueVariable === 1}
      />
      <RadioButton
        type='radio'
        id={`${radioID}2`}
        name={radioID}
        value={2}
        onChange={() => valueSetter(2)}
        checked={valueVariable === 2}
      />
      <RadioButton
        type='radio'
        id={`${radioID}3`}
        name={radioID}
        value={3}
        onChange={() => valueSetter(3)}
        checked={valueVariable === 3}
      />
      <MarginTextLabel htmlFor={`${radioID}3`}>Veldig viktig</MarginTextLabel>
    </FlexContainer>
  );
};
