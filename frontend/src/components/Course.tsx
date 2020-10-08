import React from 'react';
import { CourseButton } from '../styles/Buttons';
import { Link } from 'react-router-dom';
import { CourseItemText } from 'styles/Text';

interface CourseProps {
  courseName: String;
  courseCode: String;
  credit: Number;
}

const handleCourseClick = () => {
  console.log('Trykk på fag 1');
};

export const Course: React.FC<CourseProps> = ({
  courseName,
  courseCode,
  credit,
}) => {
  return (
    <tr>
      <td colSpan={3}>
        <Link to={'/course/' + courseCode}>
          <CourseButton clickHandler={handleCourseClick}>
            <div>
              <CourseItemText width='25%'>{courseCode}</CourseItemText>
              <CourseItemText width='50%' textAlign='left'>{courseName}</CourseItemText>
              <CourseItemText width='25%'>{credit} / 5</CourseItemText>
            </div>
          </CourseButton>
        </Link>
      </td>
    </tr>
  );
};
