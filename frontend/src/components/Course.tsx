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
  return (
    <tr>
        <td>{courseName}</td>
        <td>
            <CourseButton clickHandler={handleCourseClick}>
                {courseCode as string}
            </CourseButton>
        </td>
        <td>{score}</td>
    </tr>

  );
};