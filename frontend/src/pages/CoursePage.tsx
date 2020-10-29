import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import Layout from 'styles/Layout';
import {
  FlexColumn,
  MobileFlexContainer,
  FlexItem,
  HrLine,
  ShapeContainer,
} from 'styles/Containers';
import { BoldTitle, Title, SubTitle, GoBackText } from 'styles/Text';
import { RateCourseButton } from 'components/RateCourseButton';
import { Circle, RotatedSquare } from 'styles/Shapes';
import { defaultTheme } from 'styles/theme';
import axios from 'axios';
import ReviewList from 'components/ReviewList';
import ReviewForm from 'components/ReviewForm';
import { GlobalStateContext } from 'context/GlobalStateContext';
import modalStyles from 'styles/Modals';
import API_URL from 'config';
import { CourseInfoBox } from 'components/CourseInfoBox';

interface CourseViewProps {
  courseName: string;
  courseCode: string;
  score: number;
  location: any;
}

const CoursePage: React.FC<CourseViewProps> = (props: CourseViewProps) => {
  const { pageReviewProvider } = useContext(GlobalStateContext)!;

  const courseCode: string = useLocation().pathname.substr(8);
  const [courseInfo, setCourseInfo] = useState<any>({});

  const [scoreAvg, setScoreAvg] = useState<number>(0);
  const [numberOfReviews, setNumberOfReviews] = useState<number>(0);

  const history = useHistory();
  const handleBackClick = useCallback(() => history.goBack(), [history]);

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  function toggleModalIsOpen() {
    setModalIsOpen(!modalIsOpen);
  }
  Modal.setAppElement('#root');

  useEffect(() => {
    let isCancelled = false;
    const getCourses = async () => {
      await axios
        .get(API_URL + '/course/?code=' + courseCode)
        .then((res) => {
          if (!isCancelled) {
            setCourseInfo(res.data);
          }
        })
        .catch((err) => console.log(err));
    };
    getCourses();
    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <Layout padding='0 20%'>
      <ShapeContainer>
        <Circle
          color={defaultTheme.lightBlue}
          size='240px'
          right='0'
          top='130px'
          margin='0 -170px 0 0'
        />
        <RotatedSquare
          color={defaultTheme.blue}
          size='240px'
          left='0'
          top='50vh'
          angle='20deg'
          margin='0 0 0 -200px'
          mobileMargin='0 0 0 -400px'
        />
        <RotatedSquare
          color={defaultTheme.blue}
          size='240px'
          right='0'
          top='75vh'
          angle='80deg'
          margin='0 -225px 0 0'
          mobileMargin='0 -400px 0 0'
        />
      </ShapeContainer>
      <FlexColumn width='100%' padding='0 1vw'>
        <FlexItem margin='2vh 0 4vh 0' onClick={handleBackClick}>
          <GoBackText>Tilbake</GoBackText>
        </FlexItem>
        <MobileFlexContainer>
          <FlexItem margin='0 5vw 3vh 0'>
            <Title margin='0 0 5px 0'>{courseInfo.course_code}</Title>
            <BoldTitle fontSize='30px'>{courseInfo.course_name}</BoldTitle>
            <BoldTitle margin='10px 0 0 0'>{scoreAvg.toFixed(1)} / 5</BoldTitle>
            <SubTitle margin='0 0 4vh 0'>
              Basert på {numberOfReviews}{' '}
              {numberOfReviews === 1 ? 'vurdering' : 'vurderinger'}.
            </SubTitle>
            <RateCourseButton
              loading={false}
              onClickFunction={toggleModalIsOpen}
              courseCode={courseCode}
            />
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={toggleModalIsOpen}
              style={modalStyles}
              contentLabel='Example Modal'
            >
              <ReviewForm
                courseName={courseInfo.course_name}
                courseCode={courseInfo.course_code}
                closeModal={toggleModalIsOpen}
              />
            </Modal>
          </FlexItem>
          <FlexItem margin='0'>
            <CourseInfoBox
              difficulty={courseInfo.average_difficulty}
              workload={courseInfo.average_workload}
              averageGrade={courseInfo.average_grade?.toFixed(1)}
              passRate={courseInfo.pass_rate?.toFixed(0)}
              gradeDistribution={[0.1, 0.2, 0.3, 0.2, 0.05, 0.15]}
              hasReview={numberOfReviews > 0}
            />
          </FlexItem>
        </MobileFlexContainer>
      </FlexColumn>
      <HrLine />
      <ReviewList
        courseCode={courseCode}
        pageNumber={pageReviewProvider.pageReview}
        scoreAvgSetter={setScoreAvg}
        numberOfReviewSetter={setNumberOfReviews}
      />
    </Layout>
  );
};

export default CoursePage;
