import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { getLocalToken } from 'utils/api';
import API_URL from 'config';
import { PulseLoader } from 'react-spinners';

interface RateCourseButtonProps {
  onClickFunction: () => void;
  courseCode: string;
  loading: boolean;
  postedReview?: boolean;
}

export const TooltipButtonContainer = styled.div`
  position: relative;
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
  @media (max-width: 576px) {
    font-size: 14px;
  }
`;

export const DisabledRateButton = styled(RateButton)`
  background-color: #aaa;
  border: 1px solid #aaa;
  z-index: -1;
`;

export const TooltipText = styled.div`
  font-size: 0.7em;
  position: absolute;
  top: 100%;
  margin: 4px 0 0 0;
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

export const RateCourseButton: React.FC<RateCourseButtonProps> = ({
  onClickFunction,
  courseCode,
  loading,
  postedReview,
}) => {
  const [reviewEligibility, setReviewEligibility] = useState<number>(1);
  const [courseButtonLoading, setCourseButtonLoading] = useState<boolean>(loading);

  // TODO: move axios config (ref Casper code review comment @ !PR19)
  axios.defaults.headers.common.Authorization = `${getLocalToken()}`;

  useEffect(() => {
    let isCancelled = false;
    const getReviewEligibility = async () => {
      setCourseButtonLoading(true);
      await axios
        .get(`${API_URL}/review/check/?courseCode=${courseCode}`)
        .then((res) => {
          if (!isCancelled) {
            setReviewEligibility(res.data);
            setCourseButtonLoading(false);
          }
        })
        .catch((err) => console.log(err));
    };
    getReviewEligibility();
    return () => {
      isCancelled = true;
    };
  }, [loading, postedReview]);

  let content;

  switch (reviewEligibility) {
    case 0:
      content = (
        <RateButton onClick={() => onClickFunction()}>
          Vurder {courseCode}
        </RateButton>
      );
      break;
    case 1:
      content = (
        <TooltipButtonContainer>
          <DisabledRateButton>Vurder {courseCode}</DisabledRateButton>
          <TooltipText>Du har ikke fullført dette emnet</TooltipText>
        </TooltipButtonContainer>
      );
      break;
    case 2:
      content = (
        <TooltipButtonContainer>
          <DisabledRateButton>Vurder {courseCode}</DisabledRateButton>
          <TooltipText>Du har allerede vurdert dette emnet</TooltipText>
        </TooltipButtonContainer>
      );
      break;
    case 3:
      content = (
        <TooltipButtonContainer>
          <DisabledRateButton>Vurder {courseCode}</DisabledRateButton>
          <TooltipText>Noe gikk galt med brukerautentiseringen</TooltipText>
        </TooltipButtonContainer>
      );
      break;
    default:
      content = (
        <div>Noe gikk galt mens vi sjekket om du kan vurdere dette emnet</div>
      );
  }

  return (
    <>
      {courseButtonLoading ? (
        <DisabledRateButton>
          <PulseLoader color='#FFF' size='10px' />
        </DisabledRateButton>
      ) : (
        <div>{content}</div>
      )}
    </>
  );
};
