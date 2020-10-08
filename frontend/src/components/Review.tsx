import React from 'react';
import styled from 'styled-components';
import { FlexContainer, FlexItem } from 'styles/Containers';

interface ReviewProps {
    name: String;
    studyProgramme: String;
    score: Number;
    workLoad: Number | void;
    difficulty: Number | void;
    text: String;
    date: String;
}

const reviewStyle = {
    display: 'inline-block',
    width: '10%',
    border: '20px',
  };

const ReviewContainer = styled.div`
    background-color: ${({ theme }) => theme.white};
    border: 1px solid ${({ theme }) => theme.black};
    display: flex;
    margin: 10px 0px;
    box-shadow: 0px 4px 4px rgba(0,0,0,0.25); 
`;

const Score = styled.p`
    padding: 5px 20px;
    background-color: red;
`;

const Date = styled.p`
    padding: 5px 20px;
    background-color: blue;
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
                <p>
                    {name}
                </p>
                <p>
                    {studyProgramme}
                </p>
            </div>
        </FlexItem>
        <FlexItem flex={3}>
            <FlexContainer>
                <Score>{score}</Score>
                <Date>{date}</Date>
            </FlexContainer>
            <FlexContainer>
                <p>{workLoad}</p>
                <p>{difficulty}</p>
            </FlexContainer>
            <FlexContainer>
                <p>{text}</p>
            </FlexContainer>

        </FlexItem>
    </ReviewContainer>
  );
};
