import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { getLocalToken } from 'utils/api';
import API_URL from 'config';
import { PulseLoader } from 'react-spinners';
import {
  RedButton,
  DisabledRedButton,
  TooltipButtonContainer,
} from 'styles/Buttons';
import { GlobalStateContext } from 'context/GlobalStateContext';

interface RateCourseButtonProps {
  onClickFunction: () => void;
  courseCode: string;
  loading: boolean;
}

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
}) => {
  const [reviewEligibility, setReviewEligibility] = useState<number>(1);
  const [courseButtonLoading, setCourseButtonLoading] = useState<boolean>(
    loading,
  );

  const { refreshProvider } = useContext(GlobalStateContext)!;

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
    // eslint-disable-next-line
  }, [loading, refreshProvider.postReviewHaveRefreshed]);

  let content;

  switch (reviewEligibility) {
    case 0:
      content = (
        <RedButton onClick={() => onClickFunction()}>
          Vurder {courseCode}
        </RedButton>
      );
      break;
    case 1:
      content = (
        <TooltipButtonContainer>
          <DisabledRedButton>Vurder {courseCode}</DisabledRedButton>
          <TooltipText>Du har ikke fullført dette emnet</TooltipText>
        </TooltipButtonContainer>
      );
      break;
    case 2:
      content = (
        <TooltipButtonContainer>
          <DisabledRedButton>Vurder {courseCode}</DisabledRedButton>
          <TooltipText>Du har allerede vurdert dette emnet</TooltipText>
        </TooltipButtonContainer>
      );
      break;
    case 3:
      content = (
        <TooltipButtonContainer>
          <DisabledRedButton>Vurder {courseCode}</DisabledRedButton>
          <TooltipText>Noe gikk galt med brukerautentiseringen</TooltipText>
        </TooltipButtonContainer>
      );
      break;
    case 4:
      content = (
        <TooltipButtonContainer>
          <DisabledRedButton>Vurder {courseCode}</DisabledRedButton>
          <TooltipText>Du har blitt utestengt fra å vurdere emner</TooltipText>
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
        <DisabledRedButton>
          <PulseLoader color='#FFF' size='10px' />
        </DisabledRedButton>
      ) : (
        <div>{content}</div>
      )}
    </>
  );
};
