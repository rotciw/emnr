import React from 'react';
import styled from 'styled-components';
import { FlexColumn } from 'styles/Containers';
import { ExtraBold } from 'styles/Text';

interface SliderProps {
  sliderProgress: number;
  hasReview: boolean;
}

const SliderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin: 5px 0 15px 0;
`;

const Slider = styled.div`
  position: relative;
  border-bottom: 3px dashed ${({ theme }) => theme.black};
  flex: 1;
  height: 0;
  margin: 0.5em 10px 0 10px;
`;

const SliderLabel = styled.span`
  font-size: 0.9em;
  font-weight: normal;
  font-family: gilroymedium;
`;

const SliderBall = styled.div`
  width: 13px;
  height: 13px;
  background-color: ${({ theme }) => theme.darkBlue};
  border-radius: 50%;
  position: absolute;
  margin: -5px 0 0 -6px;
  left: ${(props: SliderProps) => props.sliderProgress * 100 || '0'}%;
`;

export const InfoSlider: React.FC<SliderProps> = ({
  sliderProgress,
  hasReview,
}) => {
  return (
    <SliderContainer>
      <SliderLabel>Lav</SliderLabel>
      <Slider>
        {hasReview && 0 <= sliderProgress && sliderProgress <= 2 && (
          <>
            <SliderBall sliderProgress={sliderProgress} hasReview={hasReview}/>
          </>
        )}
      </Slider>
      <SliderLabel>Høy</SliderLabel>
    </SliderContainer>
  );
};

export default InfoSlider;
