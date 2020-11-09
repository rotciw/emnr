import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { GlobalStateContext } from 'context/GlobalStateContext';
import API_URL from 'config';
import Review from './Review';
import { EmptyResult } from './CourseList';
import Loading from './Loading';
import { Pagination } from 'components/pagination/Pagination';

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
  limitReviews: boolean;
  scoreAvgSetter: (value: number) => void;
  numberOfReviewSetter: (value: number) => void;
  difficultyAvgSetter: (value: number) => void;
  workloadAvgSetter: (value: number) => void;
}

interface ReviewProps {
  full_name: string;
  study_programme: string;
  score: number;
  workload: number | string | void;
  difficulty: number | string | void;
  review_text: string;
  date: string;
  can_delete: boolean;
  user_email: string;
  course_code: string;
}

const ReviewList: React.FC<ReviewListProps> = ({
  courseCode,
  limitReviews,
  scoreAvgSetter,
  numberOfReviewSetter,
  difficultyAvgSetter,
  workloadAvgSetter,
}) => {
  const [reviews, updateReviews] = useState<ReviewProps[]>([]);
  const { pageProvider, refreshProvider } = useContext(GlobalStateContext)!;
  const [loading, setLoading] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [numberOfReviews, setNumberOfReviews] = useState<number>(0);

  let pageNumber = pageProvider.page;
  const resultLimit = 5;
  let start = (pageNumber - 1) * resultLimit;

  useEffect(() => {
    numberOfReviewSetter(numberOfReviews);
  }, [numberOfReviews]);

  useEffect(() => {
    let isCancelled = false;
    const getReviews = async () => {
      setLoading(true);
      await axios
        .get(
          `${API_URL}/review/get/?courseCode=${courseCode}&n=${resultLimit}&offset=${start}&showMyProgramme=${String(
            limitReviews,
          )}`,
        )
        .then((res) => {
          if (!isCancelled) {
            updateReviews(res.data.data);
            setIsAdmin(res.data.is_admin);
            pageProvider.setTotalPage(Math.ceil(res.data.count / resultLimit));
            setNumberOfReviews(res.data.count);
            scoreAvgSetter(
              res.data.average_score != null ? res.data.average_score : 0,
            );
            difficultyAvgSetter(
              res.data.average_difficulty != null
                ? res.data.average_difficulty
                : -1,
            );
            workloadAvgSetter(
              res.data.average_workload != null
                ? res.data.average_workload
                : -1,
            );
            setLoading(false);
          }
        })
        .catch((err) => console.log(err));
    };
    getReviews();
    start += resultLimit;
    return () => {
      isCancelled = true;
    };
  }, [
    pageNumber,
    refreshProvider.postReviewHaveRefreshed,
    limitReviews,
    refreshProvider.deleteReviewHaveRefreshed,
  ]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
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
                    isAdmin={isAdmin}
                    canDelete={currentReview.can_delete}
                    userEmail={currentReview.user_email}
                    courseCode={currentReview.course_code}
                  />
                );
              })}
              <Pagination />
            </div>
          ) : (
            <EmptyResult>Ingen vurderinger av {courseCode}. </EmptyResult>
          )}
        </Wrapper>
      )}
    </>
  );
};

export default ReviewList;
