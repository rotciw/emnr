import React from 'react';
import styled from 'styled-components';

interface SliderProps {
  percentage: number;
}

const SliderContainer = styled.div`
  margin: 5px 0 15px 0;
  height: 30px;
  background-color: ${({ theme }) => theme.darkBlue};
  display: flex;
  align-items: center;
`;

const ReviewedSlider: React.FC<SliderProps> = ({
  percentage
}) => {

  const Filler = styled.div`
    border-radius: inherit;
    text-align: right;
    background-color:  ${({ theme }) => theme.red};
    width: ${percentage}%;
    height: 80%;
    margin: 5px;
    transition: width 1s ease-in-out;
  `;

  return (
    <SliderContainer>
      <Filler>
      </Filler>
    </SliderContainer>
  );
};

export default ReviewedSlider;
