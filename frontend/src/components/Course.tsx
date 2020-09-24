import React from 'react';
import { CourseButton } from './Buttons';
import { Link } from 'react-router-dom';

interface CourseProps {
  courseName: String;
  courseCode: String;
  score: Number;
}

const handleCourseClick = () => {
    console.log("Trykk på fag 1");
}

const courseStyle = {
  display: 'inline-block',
  width: '33%',
};

export const Course: React.FC<CourseProps> = ({
  courseName,
  courseCode,
  score,
  }) => {
  return (
    <tr>
        <td colSpan={3}>
          <Link to={"/course/"+courseCode}>
            <CourseButton clickHandler={handleCourseClick}>
                <div>
                  <p style={courseStyle}>{courseName}</p>
                  <p style={courseStyle}>{courseCode}</p>
                  <p style={courseStyle}>{score}</p>
                </div>
            </CourseButton>
          </Link>
        </td>
    </tr>

  );
};