import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

interface ReviewFormProps {
  onClickFunction: () => void;
  courseCode: string;
}

export const TooltipButtonContainer = styled.div`
  position: relative;
  width: fit-content;
  display: flex;
`;

export const RateButton = styled.div`
  background-color: ${({ theme }) => theme.red};
  padding: 10px 20px;
  color: ${({ theme }) => theme.white};
  border: 1px solid black;
  width: fit-content;
  font-family: gilroyxbold;
  cursor: pointer;
`;

export const DisabledRateButton = styled(RateButton)`
  background-color: #aaa;
  cursor: default;
  border: none;
`;

export const TooltipText = styled.div`
  font-size: 0.8em;
  position: absolute;
  left: 100%;
  margin: 4px 0 0 10px;
  padding: 8px;
  background-color: #444;
  color: ${({ theme }) => theme.white};
  width: max-content;
  visibility: hidden;
  opacity: 0;
  transition-duration: 0.5s;

  ${TooltipButtonContainer}:hover & {
    visibility: visible;
    opacity: 1;
  }
`;

export const RateCourseButton: React.FC<ReviewFormProps> = ({ onClickFunction, courseCode }) => {
  let reviewEligibility:number = 0;
  const getReviewEligibility = async () => {
    await axios
      .get('http://localhost:8000/review/check/' + courseCode)
      .then((res) => reviewEligibility = res.data)
      .catch((err) => console.log(err));
  };
  getReviewEligibility();
  return (
    <div>
      {
        reviewEligibility === 0 ? <RateButton onClick={ () => onClickFunction()}>Send inn</RateButton> :
        reviewEligibility === 1 ? 
        <TooltipButtonContainer>
          <DisabledRateButton>Send inn</DisabledRateButton>
          <TooltipText>You have not completed this course</TooltipText> 
        </TooltipButtonContainer>
        :
        reviewEligibility === 2 ? 
        <TooltipButtonContainer>
          <DisabledRateButton>Send inn</DisabledRateButton>
          <TooltipText>You have already posted a review for this course</TooltipText> 
        </TooltipButtonContainer>
        :
        <div>Something went wrong when checking if you are eligible to review the course.</div> // This might need to be changed to something descriptive; unsure if it ever occurs.
      }
    </div>
  );
};
