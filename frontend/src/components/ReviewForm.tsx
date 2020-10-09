import React from 'react';
import styled from 'styled-components';
import { RateCourseButton } from 'styles/Buttons';
import { FlexContainer, HrLine } from 'styles/Containers';
import { Title, BoldTitle } from 'styles/Text';
import { RadioButtonsBar } from './RadioButtonBar';

interface ReviewFormProps {
  closeModal: () => void;
  courseName: String;
  courseCode: String;
}

const TextInput = styled.textarea`
  border: 1px solid ${({ theme }) => theme.darkBlue};
  width: 100%;
  min-height: 60px;
  box-sizing: border-box;
  margin: 5px 0 10px 0;
`;

const InputDescription = styled.p`
  margin: 20px 0 5px 0;
`;

const BoldInputDescription = styled.p`
  margin: 20px 0 5px 0;
  font-family: 'gilroyxbold';
  color: ${({ theme }) => theme.darkBlue};
`;

const ModalXButton = styled.span`
  font-size: 1.5em;
  margin-top: -5px;
  cursor: pointer;
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
      <FlexContainer style={{justifyContent: "space-between"}}>
        <Title margin='0 0 5px 0'>{courseCode}</Title>
        <ModalXButton onClick={closeModal}>&#10006;</ModalXButton>
      </FlexContainer>
      <BoldTitle fontSize='30px'>{courseName}</BoldTitle>
      <HrLine margin='15px 0 0 0' />
      <BoldInputDescription>Totalvurdering:</BoldInputDescription>
      <RadioButtonsBar radioID='reviewScore' />
      <InputDescription>Vanskelighetsgrad:</InputDescription>
      <RadioButtonsBar radioID='difficultyScore' />
      <InputDescription>Arbeidsmengde:</InputDescription>
      <RadioButtonsBar radioID='workloadScore' />
      <InputDescription style={{ margin: '50px 0 0 0' }}>
        Kommentar (maks 750 tegn):
      </InputDescription>
      <TextInput maxLength={750} />
      <RateCourseButton onClick={postForm}>Send inn</RateCourseButton>
    </div>
  );
};
