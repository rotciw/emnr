import React, { useState } from 'react';
import styled from 'styled-components';
import ThumbsUpIcon from 'assets/icons/thumbsUp.svg';
import ThumbsUpIconOutlined from 'assets/icons/thumbsUpOutlined.svg';
import axios from 'axios';
import API_URL from 'config';
import { getLocalToken } from 'utils/api';
import { TooltipButtonContainer } from 'styles/Buttons';
import { TooltipText } from 'components/RateCourseButton';

const ThumbsUpBtn = styled.img`
  height: 28px;
  float: left;
  cursor: pointer;
`;

const ClickedThumbsUp = styled(ThumbsUpBtn)`
  animation: like 300ms ease-out;
  @keyframes like {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(0.4);
      height: 28px;
    }
    100% {
      transform: scale(1);
    }
  }
`;

const ThumbsUpText = styled.p`
  margin: 5px 0 0 5px;
  font-family: gilroymedium;
  user-select: none;
  cursor: default;
`;

interface ReviewProps {
  reviewId: number;
  upvoteStatus: number;
  numUpvotes: number;
}

const Upvote: React.FC<ReviewProps> = ({
  reviewId,
  upvoteStatus,
  numUpvotes,
}) => {
  // We have one local status and upvote counter
  const [status, setStatus] = useState<number>(upvoteStatus);
  const [upvotes, updateUpvotes] = useState<number>(numUpvotes);
  const [disabledButton, setDisabledButton] = useState<boolean>(false);

  const upvoteReview = async () => {
    updateUpvotes(upvotes + 1);
    setStatus(1);
    const token = getLocalToken();
    axios.defaults.headers.common.Authorization = `${token}`;
    await axios
      .post(`${API_URL}/upvote/?reviewId=${reviewId}`)
      .catch((error) => console.error(error));
  };

  const removeUpvote = async () => {
    updateUpvotes(upvotes - 1);
    setStatus(0);
    await axios
      .delete(`${API_URL}/upvote/delete/?reviewId=${reviewId}`)
      .catch((err) => console.log(err));
  };

  const toggleUpvote = (): void => {
    // Status 2: User cannot review because its expiring token does not exist.
    // Status 3: User is banned from making upvotes
    if (status !== 2 && status !== 3) {
      // disabledButton button variable setting is to mitigate spam clicking during animation
      setDisabledButton(true);
      if (!disabledButton) {
        // eslint-disable-next-line no-unused-expressions
        status === 0 ? upvoteReview() : removeUpvote();
        // Timeout for disallowing spam clicking during click animation
        setTimeout(() => setDisabledButton(false), 300);
      }
    }
  };

  let content;

  switch (status) {
    // Status 0: Can upvote
    // Status 1: Upvoted
    // Status 2: User cannot review because its expiring token does not exist.
    // Status 3: User is banned from making upvotes
    default:
      content = (
        <ThumbsUpBtn src={ThumbsUpIconOutlined} onClick={toggleUpvote} />
      );
      break;
    case 1:
      content = <ClickedThumbsUp src={ThumbsUpIcon} onClick={toggleUpvote} />;
      break;
    case 2:
      content = (
        <TooltipButtonContainer>
          <ClickedThumbsUp src={ThumbsUpIcon} onClick={toggleUpvote} />
          <TooltipText>Din token har utløpt.</TooltipText>
        </TooltipButtonContainer>
      );
      break;
    case 3:
      content = (
        <TooltipButtonContainer>
          <ClickedThumbsUp src={ThumbsUpIcon} onClick={toggleUpvote} />
          <TooltipText>Du har blitt utestengt.</TooltipText>
        </TooltipButtonContainer>
      );
      break;
  }

  return (
    <>
      {content}
      <ThumbsUpText>{upvotes}</ThumbsUpText>
    </>
  );
};

export default Upvote;
