import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import Layout from 'styles/Layout';
import {
  FlexContainer,
  FlexItem,
  HrLine,
  LocalShapeContainer,
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
import Loading from 'components/Loading';

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
  const [loading, setLoading] = useState<boolean>(false);

  const [limitReviews, setLimitReviews] = useState<boolean>(localStorage.getItem('seeOnlyOwnProgrammeReviews') === 'true');

  function toggleModalIsOpen() {
    setModalIsOpen(!modalIsOpen);
  }

  const [postedReview, setPostedReview] = useState<boolean>(false);

  const handleSentReview = (value: boolean) => {
    setPostedReview(value);
  };

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
          }
        })
        .catch((err) => console.log(err));
      setLoading(false);
    };
    getCourses();
    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <Layout padding='0 20%'>
      {loading ? (
        <Loading />
      ) : (
        <FlexContainer width='100%'>
          <FlexItem margin='0 0 0 2vh'>
            <FlexItem margin='2vh 0 4vh 0' onClick={handleBackClick}>
              <GoBackText>Tilbake</GoBackText>
            </FlexItem>
            <Title margin='0 0 5px 0'>{courseInfo.course_code}</Title>
            <BoldTitle>{courseInfo.course_name}</BoldTitle>
            <BoldTitle
              fontSize='50px'
              mobileFontSize='40px'
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
              postedReview={postedReview}
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
                reviewSent={(value: boolean) => handleSentReview(value)}
              />
            </Modal>
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
      )}
      <HrLine />
      {(numberOfReviews > 0) && (
        <FlexContainer>
          <SubTitle>Se kun vurderinger fra ditt eget studieprogram:</SubTitle>
          <input type='checkbox' checked={limitReviews} onChange={() => {
            setLimitReviews(!limitReviews);
            localStorage.setItem('seeOnlyOwnProgrammeReviews',String(!limitReviews));
          }}></input>
        </FlexContainer>
      )}
      <ReviewList
        courseCode={courseCode}
        pageNumber={pageReviewProvider.pageReview}
        limitReviews={limitReviews}
        scoreAvgSetter={setScoreAvg}
        numberOfReviewSetter={setNumberOfReviews}
        postedReview={postedReview}
      />
    </Layout>
  );
};

export default CoursePage;
