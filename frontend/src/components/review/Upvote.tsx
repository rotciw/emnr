import React, { useState } from 'react';
import styled from 'styled-components';
import ThumbsUpIcon from 'assets/icons/thumbsUp.svg';
import ThumbsUpIconOutlined from 'assets/icons/thumbsUpOutlined.svg';
import axios from 'axios';
import API_URL from 'config';
import { getLocalToken } from 'utils/api';

const ThumbsUpBtn = styled.img`
  height: 28px;
  float: left;
  cursor: pointer;
`;

const RedThumbsUp = styled(ThumbsUpBtn)`
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
  :hover {
    filter: none;
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
    let isCancelled = false;
    updateUpvotes(upvotes - 1);
    setStatus(0);
    await axios
      .delete(`${API_URL}/upvote/delete/?reviewId=${reviewId}`)
      .then(() => {
        if (!isCancelled) {
          // setLoading(false);
        }
      })
      .catch((err) => console.log(err));
    return () => {
      isCancelled = true;
    };
  };

  const toggleUpvote = (): void => {
    setDisabledButton(true);
    // eslint-disable-next-line no-unused-expressions
    status === 0 ? upvoteReview() : removeUpvote();
    // Timeout for disallowing spam clicking during click animation
    setTimeout(() => setDisabledButton(false), 300);
  };

  return (
    <>
      {status === 0 ? (
        <ThumbsUpBtn src={ThumbsUpIconOutlined} onClick={toggleUpvote} />
      ) : (
        <RedThumbsUp src={ThumbsUpIcon} onClick={toggleUpvote} />
      )}
      <ThumbsUpText>{upvotes}</ThumbsUpText>
    </>
  );
};

export default Upvote;
