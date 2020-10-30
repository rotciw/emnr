import React from 'react';
import styled from 'styled-components';
import { ExtraBold } from 'styles/Text';
import InfoSlider from './InfoSlider';

interface CourseInfoProps {
  difficulty: number;
  workload: number;
  averageGrade: number;
  passRate: number;
  hasReview: boolean;
  gradeDistribution: [number, number, number, number, number, number]; //There is probably a better way to do this (specify array of 6 numbers)
}

const InfoContainer = styled.div`
  background-color: ${({ theme }) => theme.lightlightBlue};
  border: solid 1px ${({ theme }) => theme.black};
  display: flex;
  flex-direction: column;
  padding: 15px;
  box-shadow: 0px 4px 4px rgba(0,0,0,0.25);
`;

const InfoText = styled.p`
  font-size: 0.9em;
  font-weight: normal;
  font-family: gilroymedium;
  margin: 10px 0 0 0;
`;

const CourseInfoBox: React.FC<CourseInfoProps> = ({
  difficulty,
  workload,
  averageGrade,
  passRate,
  hasReview,
}) => {
  return (
    <InfoContainer>
      <ExtraBold>Vanskelighetsgrad:</ExtraBold>
      <InfoSlider sliderProgress={difficulty / 2} hasReview={hasReview}/>
      <ExtraBold>Arbeidsmengde:</ExtraBold>
      <InfoSlider sliderProgress={workload / 2} hasReview={hasReview}/>
      <ExtraBold>Karakterer for faget:</ExtraBold>
      <InfoText>
        Karaktersnitt: <ExtraBold>{averageGrade}</ExtraBold>
      </InfoText>
      <InfoText>
        Ståprosent: <ExtraBold>{passRate}%</ExtraBold>
      </InfoText>
      {/* <InfoText>Karakterfordeling:</InfoText> //TODO: Implement frontend for grade distribution*/}
    </InfoContainer>
  );
};

export default CourseInfoBox;
