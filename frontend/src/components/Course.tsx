import React from 'react';
import { CourseButton } from '../styles/Buttons';
import { Link } from 'react-router-dom';

interface CourseProps {
  courseName: String;
  courseCode: String;
  gradeAvg: Number;
  credit: Number;
}

const handleCourseClick = () => {
    console.log("Trykk på fag 1");
}

const courseStyle = {
  display: 'inline-block',
  width: '25%',
};

export const Course: React.FC<CourseProps> = ({
  courseName,
  courseCode,
  gradeAvg,
  credit,
  }) => {
  return (
    <tr>
        <td colSpan={3}>
          <Link to={"/course/"+courseCode}>
            <CourseButton clickHandler={handleCourseClick}>
                <div>
                  <p style={courseStyle}>{courseName}</p>
                  <p style={courseStyle}>{courseCode}</p>
                  <p style={courseStyle}>{gradeAvg}</p>
                  <p style={courseStyle}>{credit}</p>
                </div>
            </CourseButton>
          </Link>
        </td>
    </tr>

  );
};