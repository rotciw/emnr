import React from 'react';
import styled from 'styled-components';
import { FlexContainer, FlexItem, HrLine } from 'styles/Containers';
import { SubTitle } from 'styles/Text';

interface ReviewProps {
    name: String;
    studyProgramme: String;
    score: Number;
    workLoad: Number | void;
    difficulty: Number | void;
    text: String;
    date: String;
}

const ReviewContainer = styled.div`
    background-color: ${({ theme }) => theme.white};
    border: 1px solid ${({ theme }) => theme.black};
    display: flex;
    margin: 10px 0px;
    box-shadow: 0px 4px 4px rgba(0,0,0,0.25); 
    font-weight: 1000;
`;

const ScoreDateContainer = styled.div`
    justify-content: space-between;
    display: flex;
`;

const Metric = styled.p`
    padding: 5px 20px;
`;

export const Review: React.FC<ReviewProps> = ({
  name,
  studyProgramme,
  score,
  workLoad=0,
  difficulty=0,
  text,
  date,
  }) => {
  return (
    <ReviewContainer>
        <FlexItem flex={1}>
            <div>
                <p>{name}</p>
                <p>{studyProgramme}</p>
            </div>
        </FlexItem>
        <FlexItem flex={3}>
            <ScoreDateContainer>
                <Metric>
                    <SubTitle>
                        Totalvurdering: {score}/5
                    </SubTitle>
                </Metric>
                <Metric>
                    <SubTitle>
                        {date}
                    </SubTitle>
                </Metric>
            </ScoreDateContainer>
            <FlexContainer>
                <Metric>Arbeidsmengde: {workLoad}/5</Metric>
                <Metric>Vanskelighetsgrad: {difficulty}/5</Metric>
            </FlexContainer>
            <HrLine/>
            <FlexContainer>
                <p>{text}</p>
            </FlexContainer>

        </FlexItem>
    </ReviewContainer>
  );
};
