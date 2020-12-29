import React, { useCallback, useContext, useState } from 'react';
import styled from 'styled-components';
import { FlexContainer, HrLine } from 'styles/Containers';
import { Title, BoldTitle } from 'styles/Text';
import axios from 'axios';
import API_URL from 'config';
import { ScoreRadioButtonsBar } from './RadioButtonBar';
import { getLocalToken } from '../utils/api';
import Dropdown from 'react-dropdown';
import { RateCourseButton } from './RateCourseButton';
import { ModalXButton, DisabledRedButton } from 'styles/Buttons';
import { GlobalStateContext } from 'context/GlobalStateContext';
import { useHistory } from 'react-router-dom';

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

const ItalicText = styled.p`
  font-style: italic;
  font-size: 14px;
`;

const BoldInputDescription = styled.p`
  margin: 20px 0 10px 0;
  font-family: 'gilroyxbold';
  color: ${({ theme }) => theme.darkBlue};
`;

const RedAnchor = styled.a`
  color: red;
`;

const GuidelineLink = styled.a`
  font-family: gilroyxbold;
  text-decoration: underline;
  font-size: 14px;
  cursor: pointer;
  :hover {
    text-decoration: none;
  }
  color: ${({ theme }) => theme.darkBlue};
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
  const [loading, setLoading] = useState<boolean>(false);
  const { refreshProvider } = useContext(GlobalStateContext)!;

  const postReview = async () => {
    setLoading(true);
    const token = getLocalToken();
    axios.defaults.headers.common.Authorization = `${token}`;
    await axios
      .post(`${API_URL}/review/`, {
        courseCode,
        score: scoreValue,
        workload: workloadValue,
        difficulty: difficultyValue,
        reviewText,
      })
      .then(() => {
        refreshProvider.setPostReviewHaveRefreshed(
          !refreshProvider.postReviewHaveRefreshed,
        );
        closeModal();
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const history = useHistory();
  const handleGuidelinesClick = useCallback(() => history.push('/guidelines'),[history]);

  return (
    <div>
      <FlexContainer style={{ justifyContent: 'space-between' }}>
        <Title margin='0 0 5px 0'>{courseCode}</Title>
        <ModalXButton onClick={closeModal}>&#10006;</ModalXButton>
      </FlexContainer>
      <BoldTitle>{courseName}</BoldTitle>
      <HrLine margin='15px 0 0 0' />
      <BoldInputDescription>
        Totalvurdering: <RedAnchor>*</RedAnchor>
      </BoldInputDescription>
      <ScoreRadioButtonsBar
        radioID='reviewScore'
        valueSetter={setScoreValue}
        valueVariable={-1}
      />
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
      <InputDescription style={{ margin: '30px 0 0 0' }}>
        Kommentar (maks 750 tegn):
      </InputDescription>
      <TextInput
        maxLength={750}
        onChange={(e) => setReviewText(e.target.value)}
      />
      {scoreValue === -1 ? (
        <DisabledRedButton>Mangler totalvurdering</DisabledRedButton>
      ) : (
        <RateCourseButton
          loading={loading}
          onClickFunction={postReview}
          courseCode={courseCode}
        >
          Send inn
        </RateCourseButton>
      )}
      <ItalicText>
        Merk at ditt fulle navn kommer til å vises i vurderingen av emnet.
        Tjenesten støtter ikke personangrep mot fagstaben og slike vurderinger
        vil bli slettet.
      </ItalicText>
      <GuidelineLink onClick={handleGuidelinesClick}>
        Regler og tips for gode emnevurderinger
      </GuidelineLink>
    </div>
  );
};

export default ReviewForm;
