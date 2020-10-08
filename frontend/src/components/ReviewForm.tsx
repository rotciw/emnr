import React from 'react';
import styled from 'styled-components';
import { RateCourseButton } from 'styles/Buttons';
import { Title, BoldTitle } from 'styles/Text';
import { RadioButtonsBar } from './RadioButtonBar';

interface ReviewFormProps {
  closeModal: () => void;
  courseName: String;
  courseCode: String;
}

const TextInput = styled.input`
  border: 1px solid ${({ theme }) => theme.darkBlue};
`;

export const ReviewForm: React.FC<ReviewFormProps> = ({
  closeModal,
  courseName,
  courseCode,
}) => {
  const postForm = () => {
    //Post form to DB.
    closeModal();
  };

  return (
    <div>
      <Title margin='0 0 5px 0'>{courseCode}</Title>
      <BoldTitle fontSize='30px'>{courseName}</BoldTitle>
      Totalvurdering:
      <RadioButtonsBar radioID='reviewScore' />
      Vanskelighetsgrad:
      <RadioButtonsBar radioID='difficultyScore' />
      Arbeidsmengde:
      <RadioButtonsBar radioID='workloadScore' />
      <TextInput />
      <RateCourseButton onClick={postForm}>Send inn</RateCourseButton>
    </div>
  );
};
