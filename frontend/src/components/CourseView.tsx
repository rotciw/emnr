import React from 'react';

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
  return (
    <p>Velkommen til side for TDT4XXX.</p>
  );
};