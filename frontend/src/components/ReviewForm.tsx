import React from 'react';
import { RateCourseButton } from 'styles/Buttons';
import { Title, BoldTitle } from 'styles/Text';

interface ReviewFormProps {
  closeModal: () => void;
  courseName: String;
  courseCode: String;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
    closeModal,
    courseName,
    courseCode,
  }) => {

    const postForm = () => {
      //Post form to DB.
      closeModal();
    }

  return (
    <div>
      <Title margin='0 0 5px 0'>{courseCode}</Title>
      <BoldTitle fontSize='30px'>{courseName}</BoldTitle>
      <RateCourseButton onClick={postForm}>
        Send inn
      </RateCourseButton>
    </div>

  );
};
