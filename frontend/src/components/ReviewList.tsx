import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { GlobalStateContext } from 'context/GlobalStateContext';
import API_URL from 'config';
import Review from './Review';
import { EmptyResult } from './CourseList';
import { FlexItem } from 'styles/Containers';

const Wrapper = styled.div`
  padding: 5px;
  border-radius: 5px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-content: center;
`;

interface ReviewListProps {
  courseCode: string;
  pageNumber: number;
  scoreAvgSetter: (value: number) => void;
  numberOfReviewSetter: (value: number) => void;
}

interface ReviewProps {
  full_name: string;
  study_programme: string;
  score: number;
  workload: number | string | void;
  difficulty: number | string | void;
  review_text: string;
  date: string;
}

const ReviewList: React.FC<ReviewListProps> = ({
  courseCode,
  pageNumber,
  scoreAvgSetter,
  numberOfReviewSetter,
}) => {
  const [reviews, updateReviews] = useState<ReviewProps[]>([]);

  const { pageReviewProvider } = useContext(GlobalStateContext)!;

  const resultLimit = 5;
  let start = (pageNumber - 1) * resultLimit;

  useEffect(() => {
    let isCancelled = false;
    const getReviews = async () => {
      await axios
        .get(
          `${API_URL}/review/get/?courseCode=${courseCode}&n=25&offset=${start}`,
        )
        .then((res) => {
          if (!isCancelled) {
            updateReviews(res.data.data);
            pageReviewProvider.setTotalPageReview(
              Math.ceil(reviews.length / resultLimit),
            );
            scoreAvgSetter(res.data.average_score != null ? res.data.average_score : 0);
            numberOfReviewSetter(reviews.length);
          }
        })
        .catch((err) => console.log(err));
    };
    getReviews();
    start += resultLimit;
    return () => {
      isCancelled = true;
    };
  }, [pageNumber, reviews]);

  return (
    <Wrapper>
      {reviews.length ? (
        <div>
          {reviews.map((currentReview) => {
            //If the difficulty or workload value is not set in the review, they are replaced with an explaining string.
            if (currentReview.difficulty === -1) {
              currentReview.difficulty = 'Not given';
            }
            if (currentReview.workload === -1) {
              currentReview.workload = 'Not given';
            }

            return (
              <Review
                key={currentReview.full_name + currentReview.date}
                name={currentReview.full_name}
                studyProgramme={currentReview.study_programme}
                score={currentReview.score}
                workLoad={currentReview.workload}
                difficulty={currentReview.difficulty}
                text={currentReview.review_text}
                date={currentReview.date}
              />
            );
          })}
        </div>
      ) : (
        <EmptyResult>Ingen vurderinger av {courseCode}. </EmptyResult>
      )}
    </Wrapper>
  );
};

export default ReviewList;
