import React from 'react';
import styled from 'styled-components';
import { FlexContainer, FlexItem, HrLine } from 'styles/Containers';
import { ExtraBold } from 'styles/Text';
import DeleteReview from 'components/review/DeleteReview';
import DeleteUser from './DeleteUser';
import Upvote from './Upvote';

interface ReviewProps {
  name: string;
  studyProgramme: string;
  score: number;
  workLoad: number | string | void;
  difficulty: number | string | void;
  text: string;
  date: string;
  isAdmin: boolean;
  canDelete: boolean;
  id: number;
  courseCode: string;
  upvoteStatus: number;
  numUpvotes: number;
}

const ReviewContainer = styled.div`
  background-color: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.black};
  display: flex;
  margin: 2vh 0 2vh 0;
  padding: 12px 3% 12px 3%;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const ScoreDateContainer = styled.div`
  justify-content: space-between;
  display: flex;
  padding: 0 0 10px 0;
`;

const OptionContainer = styled.div`
  margin: 0 10px 0 0;
  display: flex;
  align-items: center;
`;

const MainMetric = styled.div`
  padding: 5px 40px;
`;

const SecondaryMetric = styled.p`
  margin: 0 2vw 0 0;
  font-size: 16px;
  @media (max-width: 576px) {
    font-size: 14px;
  }
`;

const DateText = styled.p`
  font-family: gilroymedium;
  font-weight: medium;
  margin: 0;
`;

const CommentText = styled.p`
  word-break: break-word;
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
  isAdmin,
  canDelete,
  id,
  upvoteStatus,
  numUpvotes,
}) => {
  const dateObject = new Date(date);
  const europeanDate = `${dateObject.getDate()}/${
    dateObject.getMonth() + 1
  }/${dateObject.getFullYear().toString().substr(-2)}`;
  let scoreLabelColor = 'transparent';
  // TODO: Make this more elegant? Possibly use themes instead for example?
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
    // case 5:
    //   scoreLabelColor = '#47C964';
    default:
      scoreLabelColor = '#47C964';
  }

  const mapSecondaryMetric = (secondaryMetric: string | number) => {
    switch (secondaryMetric) {
      // case 0:
      //   return 'lav';
      case 1:
        return 'middels';
      case 2:
        return 'høy';
      default:
        return 'lav';
    }
  };

  return (
    <ReviewContainer>
      <FlexItem flex='1' style={{ marginRight: '3%' }}>
        <div>
          <ExtraBold>{name}</ExtraBold>
          <div>{studyProgramme}</div>
          {/* Using div instead of p to avoid having to reduce line spacing */}
        </div>
      </FlexItem>
      <FlexItem flex='3'>
        <ScoreDateContainer>
          <MainMetric style={{ backgroundColor: scoreLabelColor }}>
            <ExtraBold>{score}/5</ExtraBold>
          </MainMetric>
          <DateText>{europeanDate}</DateText>
        </ScoreDateContainer>
        <FlexContainer flexWrap='wrap'>
          <SecondaryMetric>
            Arbeidsmengde: <ExtraBold>{mapSecondaryMetric(workLoad)}</ExtraBold>
          </SecondaryMetric>
          <SecondaryMetric>
            Vanskelighetsgrad:{' '}
            <ExtraBold>{mapSecondaryMetric(difficulty)}</ExtraBold>
          </SecondaryMetric>
        </FlexContainer>
        <HrLine margin='20px 0 0 0' />
        <FlexContainer width='100%'>
          <CommentText>{text}</CommentText>
        </FlexContainer>
        <OptionContainer>
          <Upvote
            reviewId={id}
            upvoteStatus={upvoteStatus}
            numUpvotes={numUpvotes}
          />
          {canDelete ? <DeleteReview reviewId={id} /> : <></>}
          {isAdmin ? <DeleteUser reviewId={id} userName={name} /> : <></>}
        </OptionContainer>
      </FlexItem>
    </ReviewContainer>
  );
};

export default Review;
