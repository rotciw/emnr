import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Review } from './Review';
import { GlobalStateContext } from 'context/GlobalStateContext';

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
}

interface ReviewProps{
    name: string;
    studyProgramme: string;
    score: number;
    workLoad: number | void;
    difficulty: number | void;
    text: string;
    date: string;
  }

export const ReviewList: React.FC<ReviewListProps> = ({
    courseCode,
    pageNumber,
  }) => {

    const [reviews,updateReviews] = useState<ReviewProps[]>([]);

    const { totalPageReviewProvider } = useContext(
      GlobalStateContext,
    )!;

    const resultLimit: number = 5;
    let start: number = (pageNumber - 1) * resultLimit;
/*
  useEffect (() => {
    
    const getReviews = async () => {
      await axios
      .get("http://localhost:8000/reviews/"+courseCode)
      .then(res => {
        updateReviews(res.data.data);
      })
        .catch(err => console.log(err));        
    }
    getReviews();
    start += resultLimit;

  }, [pageNumber]); 
  */
    const tempReviews: ReviewProps[] = [{name:'haakon',studyProgramme:'mtdt',score:3,workLoad:4,difficulty:5,text:'qwerty',date:'01.01.20'},
    {name:'haakon',studyProgramme:'mtdt',score:3,workLoad:4,difficulty:5,text:'qwerty',date:'01.01.20'},
    {name:'haakon',studyProgramme:'mtdt',score:3,workLoad:4,difficulty:5,text:'qwerty',date:'01.01.20'},
    {name:'haakon',studyProgramme:'mtdt',score:3,workLoad:4,difficulty:5,text:'qwerty',date:'01.01.20'},
    {name:'haakon',studyProgramme:'mtdt',score:3,workLoad:4,difficulty:5,text:'qwerty',date:'01.01.20'},
    {name:'haakon',studyProgramme:'mtdt',score:3,workLoad:4,difficulty:5,text:'qwerty',date:'01.01.20'},
    {name:'haakon',studyProgramme:'mtdt',score:3,workLoad:4,difficulty:5,text:'qwerty',date:'01.01.20'},
    {name:'haakon',studyProgramme:'mtdt',score:3,workLoad:4,difficulty:5,text:'qwerty',date:'01.01.20'},
    {name:'haakon',studyProgramme:'mtdt',score:3,workLoad:4,difficulty:5,text:'qwerty',date:'01.01.20'},
    {name:'haakon',studyProgramme:'mtdt',score:3,workLoad:4,difficulty:5,text:'qwerty',date:'01.01.20'},
    {name:'haakon',studyProgramme:'mtdt',score:3,workLoad:4,difficulty:5,text:'qwerty',date:'01.01.20'},
    {name:'haakon',studyProgramme:'mtdt',score:3,workLoad:4,difficulty:5,text:'qwerty',date:'01.01.20'}];

    //Change
    totalPageReviewProvider.setTotalPageReview(
      Math.ceil(tempReviews.length / resultLimit),
    );

  return (
    <Wrapper>
      <table>
        <tbody>
          {
            tempReviews.map(currentReview => { 
              return <Review name={currentReview.name} 
              studyProgramme={currentReview.studyProgramme} 
              score={currentReview.score} 
              workLoad={currentReview.workLoad} 
              difficulty={currentReview.difficulty} 
              text={currentReview.text}
              date={currentReview.date}/>;
            })
          }
        </tbody>
      </table>
    </Wrapper>
  );
};