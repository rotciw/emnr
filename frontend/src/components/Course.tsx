import React from 'react';
import { CourseButton } from '../styles/Buttons';
import { Link } from 'react-router-dom';
import { CourseItemText, CourseItemSubtext } from 'styles/Text';
import { FlexColumn } from 'styles/Containers';

interface CourseProps {
  courseName: String;
  courseCode: String;
  credit: Number;
  reviewCount: Number;
}

export const Course: React.FC<CourseProps> = ({
  courseName,
  courseCode,
  credit,
  reviewCount,
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
            <FlexColumn width='25%'>
              {/*TODO: Remember to keep toFixed when credit is changed to score average*/}
              <CourseItemText>{credit.toFixed(1)} / 5</CourseItemText>
              <CourseItemSubtext>
                {reviewCount} {reviewCount === 1 ? 'vurdering' : 'vurderinger'}
              </CourseItemSubtext>
            </FlexColumn>
          </CourseButton>
        </Link>
      </td>
    </tr>
  );
};
