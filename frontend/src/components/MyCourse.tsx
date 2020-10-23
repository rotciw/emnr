import React from 'react';
import { CourseButton } from '../styles/Buttons';
import { Link } from 'react-router-dom';
import { CourseItemText } from 'styles/Text';

interface MyCourseProps {
  courseName: String;
  courseCode: String;
  yourReview: String;
}

export const MyCourse: React.FC<MyCourseProps> = ({
  courseName,
  courseCode,
  yourReview,
}) => {
  return (
    <tr>
      <td colSpan={3}>
        <Link to={`/course/${courseCode}`} style={{ textDecoration: 'none' }}>
          <CourseButton >
            <CourseItemText width='25%'>{courseCode}</CourseItemText>
            <CourseItemText width='50%' textAlign='left'>
              {courseName}
            </CourseItemText>
            <CourseItemText width='25%'>{yourReview}</CourseItemText>
          </CourseButton>
        </Link>
      </td>
    </tr>
  );
};
