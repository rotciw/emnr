import React from 'react';
import { CourseButton } from './Buttons';

interface CourseProps {
  courseName: String;
  courseCode: String;
  score: Number;
}

const handleCourseClick = () => {
    console.log("Trykk på fag 1");
}



export const Course: React.FC<CourseProps> = ({
  courseName,
  courseCode,
  score,
  }) => {

    let btnString: String = courseCode.concat(courseName as string).concat(score.toString());
  return (
    <tr>
        <td colSpan={3}>
            <CourseButton clickHandler={handleCourseClick}>
                {btnString as string}
            </CourseButton>
        </td>
    </tr>

  );
};