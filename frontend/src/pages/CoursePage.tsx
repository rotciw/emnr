import React from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from 'styles/Layout';

interface CourseViewProps {
  courseName: String;
  courseCode: String;
  score: Number;
}

export const CoursePage: React.FC<CourseViewProps> = ({
  courseName,
  courseCode,
  score,
}) => {
  const code: string = useLocation().pathname.substr(8);

  return (
    <Layout>
      <p>haha {code} goes brrrrr</p>
    </Layout>
  );
};
