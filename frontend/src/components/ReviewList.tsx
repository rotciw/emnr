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

  useEffect (() => {
    
    const getReviews = async () => {
      await axios
      .get(`http://localhost:8000/review/get/?courseCode=${courseCode}&n=25&offset=${start}`)
      .then(res => {
        updateReviews(res.data.data);
        totalPageReviewProvider.setTotalPageReview(
          Math.ceil(reviews.length / resultLimit),
          );
      })
        .catch(err => console.log(err));        
    }
    getReviews();
    start += resultLimit;

  }, [pageNumber]); 
  
    const tempReviews: ReviewProps[] = [{name:'haakon',studyProgramme:'mtdt',score:3,workLoad:4,difficulty:5,text:'qwerty',date:'01.01.20'},
    {name:'haakon2',studyProgramme:'mtdt',score:3,workLoad:4,difficulty:5,text:'qwerty',date:'01.01.20'},
    {name:'haakon3',studyProgramme:'mtdt',score:3,workLoad:4,difficulty:5,text:'qwerty',date:'01.01.20'},
    {name:'haakon4',studyProgramme:'mtdt',score:3,workLoad:4,difficulty:5,text:'qwerty',date:'01.01.20'},
    {name:'haakon5',studyProgramme:'mtdt',score:3,workLoad:4,difficulty:5,text:'qwerty',date:'01.01.20'},
    {name:'haakon6',studyProgramme:'mtdt',score:3,workLoad:4,difficulty:5,text:'qwerty',date:'01.01.20'},
    {name:'haakon7',studyProgramme:'mtdt',score:3,workLoad:4,difficulty:5,text:'qwerty',date:'01.01.20'},
    {name:'haakon8',studyProgramme:'mtdt',score:3,workLoad:4,difficulty:5,text:'qwerty',date:'01.01.20'},
    {name:'haakon9',studyProgramme:'mtdt',score:3,workLoad:4,difficulty:5,text:'qwerty',date:'01.01.20'},
    {name:'haakon10',studyProgramme:'mtdt',score:3,workLoad:4,difficulty:5,text:'qwerty',date:'01.01.20'},
    {name:'haakon11',studyProgramme:'mtdt',score:3,workLoad:4,difficulty:5,text:'qwerty',date:'01.01.20'},
    {name:'haakon12',studyProgramme:'mtdt',score:3,workLoad:4,difficulty:5,text:'qwerty',date:'01.01.20'}];

  return (
    <Wrapper>
      {reviews.length ? (
        <table>
          <tbody>
            {
              reviews.map(currentReview => {
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
      ) : (
        <EmptyResult>Ingen vurderinger av {courseCode}. </EmptyResult>
      )}

    </Wrapper>
  );
};