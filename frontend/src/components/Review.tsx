import React from 'react';
import styled from 'styled-components';
import { FlexContainer, FlexItem, HrLine } from 'styles/Containers';
import { ExtraBold } from 'styles/Text';

interface ReviewProps {
  name: string;
  studyProgramme: string;
  score: number;
  workLoad: number | string | void;
  difficulty: number | string | void;
  text: string;
  date: string;
}

const ReviewContainer = styled.div`
  background-color: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.black};
  display: flex;
  margin: 0 0 4vh 0;
  padding: 12px 5vw;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const ScoreDateContainer = styled.div`
  justify-content: space-between;
  display: flex;
  padding: 0 0 10px 0;
`;

const MainMetric = styled.div`
  padding: 5px 40px;
`;

const SecondaryMetric = styled.p`
  margin: 0 2vw 0 0;
`;

const DateText = styled.p`
  font-family: gilroymedium;
  font-weight: medium;
  margin: 0;
`;

const CommentText = styled.p`
  word-break: break-all;
  text-align: left;
`;

const Review: React.FC<ReviewProps> = ({
  name,
  studyProgramme,
  score,
  workLoad = -1,
  difficulty = -1,
  text,
  date,
}) => {
  let scoreLabelColor = 'transparent';
  //TODO: Make this more elegant? Possibly use themes instead for example?
  switch (score) {
    case 1:
      scoreLabelColor = '#F94144';
      break;
    case 2:
      scoreLabelColor = '#F8961E';
      break;
    case 3:
      scoreLabelColor = '#F9C74F';
      break;
    case 4:
      scoreLabelColor = '#A0C85A';
      break;
    case 5:
      scoreLabelColor = '#47C964';
  }

  const mapSecondaryMetric = (secondaryMetric: string | number) => {
    switch (secondaryMetric) {
      case 0:
        return 'lav';
      case 1:
        return 'middels';
      case 2:
        return 'høy';
    }
  };

  return (
    <ReviewContainer>
      <FlexItem flex={'1'} style={{ marginRight: '5vw' }}>
        <div>
          <ExtraBold>{name}</ExtraBold>
          <div>{studyProgramme}</div>
          {/* Using div instead of p to avoid having to reduce line spacing */}
        </div>
      </FlexItem>
      <FlexItem flex={'3'}>
        <ScoreDateContainer>
          <MainMetric style={{ backgroundColor: scoreLabelColor }}>
            <ExtraBold>{score}/5</ExtraBold>
          </MainMetric>
          <DateText>{date.substring(0, 10)}</DateText>
        </ScoreDateContainer>
        <FlexContainer flexWrap={'wrap'}>
          <SecondaryMetric>
            Arbeidsmengde: <ExtraBold>{mapSecondaryMetric(workLoad)}</ExtraBold>
          </SecondaryMetric>
          <SecondaryMetric>
            Vanskelighetsgrad:{' '}
            <ExtraBold>{mapSecondaryMetric(difficulty)}</ExtraBold>
          </SecondaryMetric>
        </FlexContainer>
        <HrLine margin={'20px 0 0 0'} />
        <FlexContainer width='100%'>
          <CommentText>{text}</CommentText>
        </FlexContainer>
      </FlexItem>
    </ReviewContainer>
  );
};

export default Review;
