import React, { useCallback } from 'react';
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

interface CourseViewProps {
  courseName: String;
  courseCode: String;
  score: Number;
  location: any;
}

export const CoursePage: React.FC<CourseViewProps> = (
  props: CourseViewProps,
) => {
  const code: string = useLocation().pathname.substr(8);
  const { courseCode, courseName, score } = props.location.state;

  const history = useHistory();
  const handleOnClick = useCallback(() => history.push('/'), [history]);

  return (
    <Layout padding="0 20%">
      <FlexContainer>
        <FlexItem margin='0 0 0 10vh'>
          <FlexItem margin='2vh 0 4vh 0' onClick={handleOnClick}>
            <GoBackText>Tilbake</GoBackText>
          </FlexItem>
          <Title margin='0 0 5px 0'>{courseCode}</Title>
          <BoldTitle fontSize='30px'>{courseName}</BoldTitle>
          <BoldTitle margin='10px 0 0 0'>{score} / 5</BoldTitle>
          <SubTitle margin='0 0 4vh 0'>Basert på x antall vurderinger</SubTitle>
          <RateCourseButton>Vurder {courseCode}</RateCourseButton>
        </FlexItem>
        <LocalShapeContainer>
          <Circle color={defaultTheme.lightBlue} size='215px' left='0' top='50px' />
          <RotatedSquare color={defaultTheme.blue} size='150px' left='100px' top='30px' angle='20deg' />
        </LocalShapeContainer>
      </FlexContainer>
      <HrLine />
    </Layout>
  );
};
