import React, { useState } from 'react';
import styled from 'styled-components';
import { FlexContainer, HrLine } from 'styles/Containers';
import { Title, BoldTitle } from 'styles/Text';
import axios from 'axios';
import API_URL from 'config';
import RadioButtonsBar from './RadioButtonBar';
import { getLocalToken } from '../utils/api';
import Dropdown, { Option } from 'react-dropdown';
import { RateCourseButton } from './RateCourseButton';

interface ReviewFormProps {
  closeModal: () => void;
  courseName: string;
  courseCode: string;
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
  margin: 20px 0 10px 0;
  font-family: 'gilroyxbold';
  color: ${({ theme }) => theme.darkBlue};
`;

const ModalXButton = styled.span`
  font-size: 1.5em;
  margin-top: -5px;
  cursor: pointer;
`;

const options = [
  { value: '-1', label: 'Ingen svar' },
  { value: '0', label: 'Lav' },
  { value: '1', label: 'Middels' },
  { value: '2', label: 'Høy' },
];

const ReviewForm: React.FC<ReviewFormProps> = ({
  closeModal,
  courseName,
  courseCode,
}) => {
  const [scoreValue, setScoreValue] = useState<number>(-1);
  const [difficultyValue, setDifficultyValue] = useState<number>(-1);
  const [workloadValue, setWorkloadValue] = useState<number>(-1);
  const [reviewText, setReviewText] = useState<string>('');

  const postReview = () => {
    closeModal();
    const token = getLocalToken();
    axios.defaults.headers.common.Authorization = `${token}`;
    return axios
      .post(`${API_URL}/review/`, {
        courseCode,
        score: scoreValue,
        workload: workloadValue,
        difficulty: difficultyValue,
        reviewText,
      })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div>
      <FlexContainer style={{ justifyContent: 'space-between' }}>
        <Title margin='0 0 5px 0'>{courseCode}</Title>
        <ModalXButton onClick={closeModal}>&#10006;</ModalXButton>
      </FlexContainer>
      <BoldTitle fontSize='30px'>{courseName}</BoldTitle>
      <HrLine margin='15px 0 0 0' />
      <BoldInputDescription>Totalvurdering: *</BoldInputDescription>
      <RadioButtonsBar radioID='reviewScore' valueSetter={setScoreValue} />
      <InputDescription>Arbeidsmengde:</InputDescription>
      <Dropdown
        options={options}
        onChange={(e) => setWorkloadValue(parseInt(e.value))}
        placeholder='Velg...'
      />
      <InputDescription>Vanskelighetsgrad:</InputDescription>
      <Dropdown
        options={options}
        onChange={(e) => setDifficultyValue(parseInt(e.value))}
        placeholder='Velg...'
      />
      <InputDescription style={{ margin: '50px 0 0 0' }}>
        Kommentar (maks 750 tegn):
      </InputDescription>
      <TextInput
        maxLength={750}
        onChange={(e) => setReviewText(e.target.value)}
      />
      <RateCourseButton onClickFunction={postReview} courseCode={courseCode}>
        Send inn
      </RateCourseButton>
    </div>
  );
};

export default ReviewForm;
