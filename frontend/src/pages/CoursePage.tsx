import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Layout } from 'styles/Layout';
import {
  FlexContainer,
  FlexItem,
  HrLine,
  LocalShapeContainer,
} from 'styles/Containers';
import { BoldTitle, Title, SubTitle, GoBackText } from 'styles/Text';
import { RateCourseButton } from 'styles/Buttons';
import { Circle, RotatedSquare } from 'styles/Shapes';
import { defaultTheme } from 'styles/theme';
import axios from 'axios';
import { ReviewList } from 'components/ReviewList';
import { PaginationContainer } from 'components/pagination/PaginationContainer';
import { GlobalStateContext } from 'context/GlobalStateContext';

interface CourseViewProps {
  courseName: String;
  courseCode: String;
  score: Number;
  location: any;
}

export const CoursePage: React.FC<CourseViewProps> = (
  props: CourseViewProps,
) => {
  const { pageReviewProvider, totalPageReviewProvider } = useContext(
    GlobalStateContext,
  )!;

  const courseCode: string = useLocation().pathname.substr(8);
  const [courseInfo, setCourseInfo] = useState<any>({});

  const history = useHistory();
  const handleBackClick = useCallback(() => history.push('/'), [history]);

  useEffect(() => {
    const getCourses = async () => {
      await axios
        .get('http://localhost:8000/course/?code=' + courseCode)
        .then(res => setCourseInfo(res.data))
        .catch((err) => console.log(err));
    };
    getCourses();
  }, []);

  return (
    <Layout padding='0 20%'>
      <FlexContainer>
        <FlexItem margin='0 0 0 10vh'>
          <FlexItem margin='2vh 0 4vh 0' onClick={handleBackClick}>
            <GoBackText>Tilbake</GoBackText>
          </FlexItem>
          <Title margin='0 0 5px 0'>{courseInfo.course_code}</Title>
          <BoldTitle fontSize='30px'>{courseInfo.course_name}</BoldTitle>
          <BoldTitle margin='10px 0 0 0'>{courseInfo.score} / 5</BoldTitle>
          <SubTitle margin='0 0 4vh 0'>Basert på x antall vurderinger</SubTitle>
          <RateCourseButton>Vurder {courseCode}</RateCourseButton>
        </FlexItem>
        <LocalShapeContainer>
          <Circle
            color={defaultTheme.lightBlue}
            size='215px'
            left='0'
            top='50px'
          />
          <RotatedSquare
            color={defaultTheme.blue}
            size='150px'
            left='100px'
            top='30px'
            angle='20deg'
          />
        </LocalShapeContainer>
      </FlexContainer>
      <HrLine />
      <ReviewList courseCode={courseInfo.course_code} pageNumber={pageReviewProvider.pageReview}/>
      <PaginationContainer totalPages={totalPageReviewProvider.totalPageReview} />
    </Layout>
  );
};
