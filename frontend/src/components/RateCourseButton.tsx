import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { getLocalToken } from 'utils/api';

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

export const RateCourseButton: React.FC<ReviewFormProps> = ({
  onClickFunction,
  courseCode,
}) => {
  const [reviewEligibility, setReviewEligibility] = useState<number>(1);

  //TODO: move axios config (ref Casper code review comment @ !PR19)
  axios.defaults.headers.common['Authorization'] = `${getLocalToken()}`;

  useEffect(() => {
    const getReviewEligibility = async () => {
      await axios
        .get('http://localhost:8000/review/check/?courseCode=' + courseCode)
        .then((res) => {
          setReviewEligibility(res.data);
        })
        .catch((err) => console.log(err));
    };
    getReviewEligibility();
  }, []);

  let content;

  switch (reviewEligibility) {
    case 0:
      content = (
        <RateButton onClick={() => onClickFunction()}>Send inn</RateButton>
      );
      break;
    case 1:
      content = (
        <TooltipButtonContainer>
          <DisabledRateButton>Send inn</DisabledRateButton>
          <TooltipText>Du har ikke fullført dette emnet</TooltipText>
        </TooltipButtonContainer>
      );
      break;
    case 2:
      content = (
        <TooltipButtonContainer>
          <DisabledRateButton>Send inn</DisabledRateButton>
          <TooltipText>
            Du har allerede vurdert dette emnet
          </TooltipText>
        </TooltipButtonContainer>
      );
      break;
    case 3:
      content = (
        <TooltipButtonContainer>
          <DisabledRateButton>Send inn</DisabledRateButton>
          <TooltipText>Noe gikk galt med brukerautentiseringen</TooltipText>
        </TooltipButtonContainer>
      );
      break;
    default:
      content = (
        <div>
          Noe gikk galt mens vi sjekket om du kan vurdere dette emnet
        </div>
      );
  }

  return <div>{content}</div>;
};
