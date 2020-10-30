import React from 'react';
import { Link } from 'react-router-dom';
import { CourseItemText, CourseItemSubtext } from 'styles/Text';
import { FlexColumn } from 'styles/Containers';
import { CourseButton } from '../styles/Buttons';

interface CourseProps {
  courseName: string;
  courseCode: string;
  averageReviewScore: number;
  reviewCount: number;
  averageGrade: number;
  passRate: number;
  credit: number;
  sortingParam: string;
}

const Course: React.FC<CourseProps> = ({
  courseName,
  courseCode,
  averageReviewScore,
  reviewCount,
  averageGrade,
  passRate,
  credit,
  sortingParam,
}) => {
  let paramMetric: String = '';

  switch (sortingParam) {
    case 'course_code':
      paramMetric = '';
      break;
    case 'course_name':
      paramMetric = '';
      break;
    case 'average_review_score':
      paramMetric = String(averageReviewScore.toFixed(1)) + ' / 5';
      break;
    case 'review_count':
      paramMetric = String(averageReviewScore.toFixed(1)) + ' / 5';
      break;
    case 'credit':
      paramMetric = String(credit);
      break;
    case 'average_grade':
      paramMetric = String(averageGrade);
      break;
    case 'pass_rate':
      paramMetric = String((100 - passRate).toFixed(2));
      break;
    default:
      paramMetric = 'X';
      break;
  }

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
              <CourseItemText>{paramMetric}</CourseItemText>
              {(sortingParam === 'average_review_score' ||
                sortingParam === 'review_count') && (
                <CourseItemSubtext>
                  {reviewCount}{' '}
                  {reviewCount === 1 ? 'vurdering' : 'vurderinger'}
                </CourseItemSubtext>
              )}
            </FlexColumn>
          </CourseButton>
        </Link>
      </td>
    </tr>
  );
};

export default Course;
