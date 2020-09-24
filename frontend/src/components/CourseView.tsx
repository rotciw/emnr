import React from 'react';
import { useLocation } from 'react-router-dom';

interface CourseViewProps {
  courseName: String;
  courseCode: String;
  score: Number;
}

export const CourseView: React.FC<CourseViewProps> = ({
  courseName,
  courseCode,
  score,
  }) => {
    const code:string = useLocation().pathname.substr(8);

  return (
    <p>haha {code} goes brrrrr</p>
  );
};