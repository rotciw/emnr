import React from 'react';
import styled from 'styled-components';
import { ExtraBold } from 'styles/Text';
import { SortHighLowButton } from 'styles/Buttons';
import { WeightRadioButtonsBar } from './RadioButtonBar';

interface RateCourseButtonProps {
  setDirectionFunction: (isHigh: boolean) => void;
  directionVariable: boolean;
  setWeightFunction: (weight: number) => void;
  weightVariable: number;
  displayName: string;
  idName: string;
}

const FactorWrapper = styled.div`
  margin: 25px 0 8px 0;
`;

export const SortFactor: React.FC<RateCourseButtonProps> = ({
  setDirectionFunction,
  directionVariable,
  setWeightFunction,
  weightVariable,
  displayName,
  idName,
}) => {
  return (
    <div>
      <FactorWrapper>
        <ExtraBold>{displayName}</ExtraBold> {' er '}
        <SortHighLowButton
          onClick={(e) => {
            setDirectionFunction(!directionVariable);
          }}
        >
          {(directionVariable ? 'høy' : 'lav') + ` \u21C5`}
        </SortHighLowButton>
      </FactorWrapper>
      <WeightRadioButtonsBar radioID={`${idName}Weight`} valueSetter={setWeightFunction} valueVariable={weightVariable}/>
    </div>
  );
};
