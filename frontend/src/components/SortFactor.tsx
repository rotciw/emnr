import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ExtraBold } from 'styles/Text';
import { SortFormButton } from 'styles/Buttons';
import RadioButtonsBar from './RadioButtonBar';

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
        <SortFormButton
          onClick={(e) => {
            setDirectionFunction(!directionVariable);
          }}
        >
          {(directionVariable ? 'høy' : 'lav') + ` \u21C5`}
        </SortFormButton>
      </FactorWrapper>
      <RadioButtonsBar radioID={`${idName}Weight`} valueSetter={setWeightFunction} />
    </div>
  );
};
