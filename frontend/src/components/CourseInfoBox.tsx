import React from 'react';
import styled from 'styled-components';
import { FlexColumn } from 'styles/Containers';
import { ExtraBold } from 'styles/Text';
import InfoSlider from './InfoSlider';

interface CourseInfoProps {
  difficulty: number;
  workload: number;
  averageGrade: number;
  passRate: number;
  gradeDistribution: [number, number, number, number, number, number]; //There is probably a better way to do this (specify array of 6 numbers)
}

interface SliderProps {
  sliderProgress: number;
}

const InfoContainer = styled.div`
  background-color: ${({ theme }) => theme.lightlightBlue};
  border: solid 1px ${({ theme }) => theme.black};
  display: flex;
  flex-direction: column;
  padding: 15px;
`;

const InfoText = styled.p`
  font-size: 0.9em;
  font-weight: normal;
  font-family: gilroymedium;
  margin: 10px 0 0 0;
`;

export const CourseInfoBox: React.FC<CourseInfoProps> = ({
  difficulty,
  workload,
  averageGrade,
  passRate,
  gradeDistribution,
}) => {
  return (
    <InfoContainer>
      <ExtraBold>Vanskelighetsgrad:</ExtraBold>
      <InfoSlider sliderProgress={difficulty / 2} />
      <ExtraBold>Arbeidsmengde:</ExtraBold>
      <InfoSlider sliderProgress={workload / 2} />
      <ExtraBold>Karakterer for faget:</ExtraBold>
      <InfoText>
        Snittkarakter: <ExtraBold>{averageGrade}</ExtraBold>
      </InfoText>
      <InfoText>
        Ståprosent: <ExtraBold>{passRate * 100}%</ExtraBold>
      </InfoText>
      <InfoText>Karakterfordeling:</InfoText>
    </InfoContainer>
  );
};

export default CourseInfoProps;
