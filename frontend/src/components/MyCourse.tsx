import React from 'react';
import { CourseButton } from '../styles/Buttons';
import { Link } from 'react-router-dom';
import { CourseItemText } from 'styles/Text';

interface MyCourseProps {
  courseName: String;
  courseCode: String;
  semester: String;
}

const handleCourseClick = () => {
  console.log('Trykk på fag 1');
};

export const MyCourse: React.FC<MyCourseProps> = ({
  courseName,
  courseCode,
  semester,
}) => {
  return (
    <tr>
      <td colSpan={3}>
        <Link to={`/course/${courseCode}`}>
          <CourseButton clickHandler={handleCourseClick}>
            <CourseItemText width='25%'>{courseCode}</CourseItemText>
            <CourseItemText width='50%' textAlign='left'>
              {courseName}
            </CourseItemText>
            <CourseItemText width='25%'>{semester}</CourseItemText>
          </CourseButton>
        </Link>
      </td>
    </tr>
  );
};
