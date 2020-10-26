import React from 'react';
import { MyCourse } from './MyCourse';
import { SemesterContainer, StyledTable, StyledTH } from 'styles/Containers';
import { BoldTitle } from 'styles/Text';

interface Semester {
  semester: string;
  courses: MyCourseProps[];
}

interface MyCourseProps {
  course_name: string;
  course_code: string;
  semester: string;
  has_reviewed: boolean;
  my_review_score: string;
}

export const Semester: React.FC<Semester> = ({semester, courses}) => {
  return (
    <SemesterContainer margin='5vh 0'>
      <BoldTitle fontSize='24px' >{semester}</BoldTitle>
      <StyledTable>
        <thead>
          <tr>
            <StyledTH width='25%'>Emnekode</StyledTH>
            <StyledTH width='50%' textAlign='left'>
              Emnenavn
            </StyledTH>
            <StyledTH width='25%'>Din vurdering</StyledTH>
          </tr>
        </thead>
        <tbody>
          {courses.map((currentCourse) => {
            return (
              <MyCourse
                  courseCode={currentCourse.course_code}
                  courseName={currentCourse.course_name}
                  yourReview={currentCourse.has_reviewed ? `${currentCourse.my_review_score} / 5` : `Gi vurdering`}
                  key={currentCourse.course_code}
              />
            )
          })}
        </tbody>
      </StyledTable>
    </SemesterContainer>
  );
}