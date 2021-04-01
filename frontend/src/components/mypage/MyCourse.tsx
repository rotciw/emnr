import React from 'react';
import { Link } from 'react-router-dom';
import { CourseItemText } from 'styles/Text';
import { CourseButton } from 'styles/Buttons';

interface MyCourseProps {
  courseName: string;
  courseCode: string;
  yourReview: string;
}

const MyCourse: React.FC<MyCourseProps> = ({
  courseName,
  courseCode,
  yourReview,
}) => {
  return (
    <tr>
      <td colSpan={3}>
        <Link to={`/course/${courseCode}`} style={{ textDecoration: 'none' }}>
          <CourseButton>
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

export default MyCourse;
