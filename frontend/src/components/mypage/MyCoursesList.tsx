import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FlexContainer, FlexItem } from 'styles/Containers';
import { Semester } from './Semester';
import { getLocalToken } from '../../utils/api';
import API_URL from '../../config';
import Loading from '../Loading';
import { EmptyResult } from '../CourseList';
import ReviewedSlider from './ReviewedSlider';
import { BoldTitle, RedHighlight } from 'styles/Text';

interface MyCoursesListProps { }
interface MyCourseProps {
  course_name: string;
  course_code: string;
  semester: string;
  has_reviewed: boolean;
  my_review_score: string;
}
interface Semesters {
  [semester: string]: MyCourseProps[];
}

const MyCoursesList: React.FC<MyCoursesListProps> = () => {
  const [mySemesters, updateMySemesters] = useState<Semesters>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [amountOfReviewed, setAmountOfReviewed] = useState<number>(0);

  useEffect(() => {
    let reviewedCounter = 0;
    let isCancelled = false;
    const token = getLocalToken();
    axios.defaults.headers.common.Authorization = `${token}`;
    const getMyCourses = async () => {
      setLoading(true);
      await axios
        .get(`${API_URL}/course/me/`)
        .then((response) => {
          if (!isCancelled) {
            const allMyCourses = response.data;
            const sortedCourses = allMyCourses.reduce(
              (semesters: any, course: any) => {
                if (!semesters[course.semester])
                  semesters[course.semester] = [];
                semesters[course.semester].push(course);
                // Count percentage of reviewed courses
                if (course.has_reviewed) {
                  reviewedCounter++;
                }
                setAmountOfReviewed(parseInt(((reviewedCounter / allMyCourses.length) * 100).toFixed(0)));
                return semesters;
              },
              {},
            );
            updateMySemesters(sortedCourses);
          }
        })
        .catch((err) => console.log(err));
      setLoading(false);
    };
    getMyCourses();
    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
          <FlexContainer margin='15px 0 0 0'>
            {Object.entries(mySemesters).length ? (
              <FlexItem>
                <BoldTitle margin='0 0 15px 0'>
                  Min side
                </BoldTitle>
                <ReviewedSlider percentage={amountOfReviewed} />
                  Du har vurdert <RedHighlight>{amountOfReviewed}%</RedHighlight> av emnene dine.
                {Object.entries(mySemesters)
                  .sort(
                    //Sorting the semesters
                    (
                      semester1: [string, MyCourseProps[]],
                      semester2: [string, MyCourseProps[]],
                    ) => {
                      if (
                        parseInt(semester1[0].substring(1, 5)) <
                        parseInt(semester2[0].substring(1, 5))
                      ) {
                        return 1;
                      }
                      if (
                        parseInt(semester1[0].substring(1, 5)) ===
                        parseInt(semester2[0].substring(1, 5))
                      ) {
                        if (semester1[0].substring(0, 1) === 'V') {
                          return 1;
                        }
                        return -1;
                      }
                      return -1;
                    },
                  )
                  .map(([semester, courses]) => {
                    return (
                      <Semester
                        semester={semester}
                        courses={courses}
                        key={semester}
                      />
                    );
                  })}
              </FlexItem>
            ) : (
                <EmptyResult>Beklager! Vi fant ingen data. </EmptyResult>
              )}
          </FlexContainer>
        )}
    </>
  );
};

export default MyCoursesList;
