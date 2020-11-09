import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import Layout from 'styles/Layout';
import {
  FlexColumn,
  MobileFlexContainer,
  FlexItem,
  HrLine,
  ShapeContainer,
  FlexContainer,
} from 'styles/Containers';
import { BoldTitle, Title, SubTitle, GoBackText } from 'styles/Text';
import { RateCourseButton } from 'components/RateCourseButton';
import { Circle, RotatedSquare } from 'styles/Shapes';
import { defaultTheme } from 'styles/theme';
import axios from 'axios';
import ReviewList from 'components/ReviewList';
import ReviewForm from 'components/ReviewForm';
import modalStyles from 'styles/Modals';
import API_URL from 'config';
import CourseInfoBox from 'components/CourseInfoBox';
import Loading from 'components/Loading';
import { Checkbox } from 'styles/Buttons';

interface CourseViewProps {
  courseName: string;
  courseCode: string;
  score: number;
  location: any;
}

const CoursePage: React.FC<CourseViewProps> = (props: CourseViewProps) => {

  const courseCode: string = useLocation().pathname.substr(8);
  const [courseInfo, setCourseInfo] = useState<any>({});

  const [scoreAvg, setScoreAvg] = useState<number>(0);
  const [numberOfReviews, setNumberOfReviews] = useState<number>(0);

  const [workloadAvg, setWorkloadAvg] = useState<number>(0);
  const [difficultyAvg, setDifficultyAvg] = useState<number>(0);

  const history = useHistory();
  const handleBackClick = useCallback(() => history.goBack(), [history]);

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [limitReviews, setLimitReviews] = useState<boolean>(
    localStorage.getItem('seeOnlyOwnProgrammeReviews') === 'true',
  );

  function toggleModalIsOpen() {
    setModalIsOpen(!modalIsOpen);
  }

  Modal.setAppElement('#root');

  useEffect(() => {
    let isCancelled = false;
    const getCourses = async () => {
      setLoading(true);
      await axios
        .get(API_URL + '/course/?code=' + courseCode)
        .then((res) => {
          if (!isCancelled) {
            setCourseInfo(res.data);
            setLoading(false);
          }
        })
        .catch((err) => console.log(err));
    };
    getCourses();
    return () => {
      isCancelled = true;
    };
  }, [numberOfReviews]);

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
      {loading ? (
        <Loading />
      ) : (
        <FlexColumn width='100%' padding='0 1vw'>
          <FlexItem margin='1vh 0 3vh 0' onClick={handleBackClick}>
            <GoBackText>Tilbake</GoBackText>
          </FlexItem>
          <MobileFlexContainer>
            <FlexItem margin='0 5vw 3vh 0'>
              <Title margin='0 0 5px 0'>{courseInfo.course_code}</Title>
              <BoldTitle>{courseInfo.course_name}</BoldTitle>
              <BoldTitle
                fontSize='50px'
                mobileFontSize='50px'
                margin='10px 0 0 0'
              >
                {scoreAvg.toFixed(1)} / 5
              </BoldTitle>
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
                difficulty={difficultyAvg}
                workload={workloadAvg}
                averageGrade={courseInfo.average_grade?.toFixed(1)}
                passRate={courseInfo.pass_rate?.toFixed(0)}
                gradeDistribution={[0.1, 0.2, 0.3, 0.2, 0.05, 0.15]}
                hasReview={numberOfReviews > 0}
              />
            </FlexItem>
          </MobileFlexContainer>
        </FlexColumn>
      )}
      <HrLine />
      {(numberOfReviews > 0 || limitReviews) && (
        <FlexContainer margin='0 0 5px 5px'>
          <SubTitle fontSize='0.9em'>Mitt studieprogram:</SubTitle>
          <Checkbox
            type='checkbox'
            checked={limitReviews}
            onChange={() => {
              setLimitReviews(!limitReviews);
              localStorage.setItem(
                'seeOnlyOwnProgrammeReviews',
                String(!limitReviews),
              );
            }}
          />
        </FlexContainer>
      )}
      <ReviewList
        courseCode={courseCode}
        limitReviews={limitReviews}
        scoreAvgSetter={setScoreAvg}
        numberOfReviewSetter={setNumberOfReviews}
        difficultyAvgSetter={setDifficultyAvg}
        workloadAvgSetter={setWorkloadAvg}
      />
    </Layout>
  );
};

export default CoursePage;
