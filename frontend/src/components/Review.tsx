import React from 'react';
import styled from 'styled-components';
import { FlexContainer, FlexItem, HrLine } from 'styles/Containers';
import { ExtraBold, SubTitle } from 'styles/Text';

interface ReviewProps {
  name: String;
  studyProgramme: String;
  score: Number;
  workLoad: number | string | void;
  difficulty: number | string | void;
  text: String;
  date: String;
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
  background-color: lightgreen;
`;

const SecondaryMetric = styled.p`
  margin: 0 30px 0 0;
`;

const DateText = styled.p`
  font-family: gilroymedium;
  font-weight: medium;
  margin: 0;
`;

export const Review: React.FC<ReviewProps> = ({
  name,
  studyProgramme,
  score,
  workLoad = -1,
  difficulty = -1,
  text,
  date,
}) => {
  return (
    <ReviewContainer>
      <FlexItem flex={'none'} style={{ marginRight: '5vw' }}>
        <div>
          <ExtraBold>{name}</ExtraBold>
          <div>{studyProgramme}</div>
          {/* Using div instead of p to avoid having to reduce line spacing */}
        </div>
      </FlexItem>
      <FlexItem>
        <ScoreDateContainer>
          <MainMetric>
            <ExtraBold>{score}/5</ExtraBold>
          </MainMetric>
          <DateText>{date.substring(0,10)}</DateText>
        </ScoreDateContainer>
        <FlexContainer>
          <SecondaryMetric>
            Arbeidsmengde: <ExtraBold>{workLoad}/5</ExtraBold>
          </SecondaryMetric>
          <SecondaryMetric>
            Vanskelighetsgrad: <ExtraBold>{difficulty}/5</ExtraBold>
          </SecondaryMetric>
        </FlexContainer>
        <HrLine margin={'20px 0 0 0'} />
        <FlexContainer>
          <p>{text}</p>
        </FlexContainer>
      </FlexItem>
    </ReviewContainer>
  );
};
