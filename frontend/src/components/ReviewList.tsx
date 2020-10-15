import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Review } from './Review';
import { GlobalStateContext } from 'context/GlobalStateContext';
import { EmptyResult } from './CourseList';

const Wrapper = styled.div`
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 5px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-content: center;
`;

interface ReviewListProps {
    courseCode: String;
    pageNumber: number;
    scoreAvgSetter: (value:number) => void;
    numberOfReviewSetter: (value:number) => void;
}

interface ReviewProps{
    full_name: string;
    study_programme: string;
    score: number;
    workload: number | string | void;
    difficulty: number | string | void;
    review_text: string;
    date: string;
  }

export const ReviewList: React.FC<ReviewListProps> = ({
    courseCode,
    pageNumber,
    scoreAvgSetter,
    numberOfReviewSetter,
  }) => {

    const [reviews,updateReviews] = useState<ReviewProps[]>([]);

    const { totalPageReviewProvider } = useContext(
      GlobalStateContext,
    )!;

    const resultLimit: number = 5;
    let start: number = (pageNumber - 1) * resultLimit;

  useEffect (() => {
    
    const getReviews = async () => {
      await axios
      .get(`http://localhost:8000/review/get/?courseCode=${courseCode}&n=25&offset=${start}`)
      .then(res => {
        updateReviews(res.data.data);
        totalPageReviewProvider.setTotalPageReview(
          Math.ceil(reviews.length / resultLimit),
          );
        scoreAvgSetter(calculateAvgScore(res.data.data))
      })
        .catch(err => console.log(err));        
    }
    getReviews();
    start += resultLimit;

  }, [pageNumber]); 

  function calculateAvgScore(reviews:ReviewProps[]) {
    numberOfReviewSetter(reviews.length);
    let scoreAvg:number = 0;
    if(reviews.length > 0){
      reviews.map(currentReview =>{
        scoreAvg += currentReview.score; 
      })
      return scoreAvg / reviews.length;
    }
    else{
      return 0;
    }
  }

  return (
    <Wrapper>
      {reviews.length ? (
        <table>
          <tbody>
            {
              reviews.map(currentReview => {

                //If the difficulty or workload value is not set in the review, they are replaced with an explaining string.
                if(currentReview.difficulty === -1){currentReview.difficulty = "Not given";}
                if(currentReview.workload === -1){currentReview.workload = "Not given";}

                return <Review name={currentReview.full_name} 
                studyProgramme={currentReview.study_programme} 
                score={currentReview.score} 
                workLoad={currentReview.workload} 
                difficulty={currentReview.difficulty} 
                text={currentReview.review_text}
                date={currentReview.date}
                />;
              })
            }
          </tbody>
      </table>
      ) : (
        <EmptyResult>Ingen vurderinger av {courseCode}. </EmptyResult>
      )}

    </Wrapper>
  );
};