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
  advancedSortingMatch: number;
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
  advancedSortingMatch,
  sortingParam,
}) => {
  let paramMetric: String = '';

  let listOfSubReviewText = [
    'course_code',
    'course_name',
    'average_review_score',
    'review_count',
  ];

  switch (sortingParam) {
    case 'course_code':
    case 'course_name':
    case 'average_review_score':
    case 'review_count':
      paramMetric = String(averageReviewScore.toFixed(1)) + ' / 5';
      break;
    case 'credit':
      paramMetric = String(credit);
      break;
    case 'average_grade':
      paramMetric = String(averageGrade.toFixed(1));
      break;
    case 'pass_rate':
      paramMetric = String((100 - passRate).toFixed(2));
      break;
    case 'advanced_sorting_score':
      paramMetric = String(advancedSortingMatch.toFixed(1)) + '%';
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
              {listOfSubReviewText.indexOf(sortingParam) > -1 && (
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
