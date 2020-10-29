import React, { useState } from 'react';
import styled from 'styled-components';
import { FlexContainer, HrLine } from 'styles/Containers';
import { Title, BoldTitle } from 'styles/Text';
import axios from 'axios';
import API_URL from 'config';
import RadioButtonsBar from './RadioButtonBar';
import { getLocalToken } from '../utils/api';
import Dropdown from 'react-dropdown';
import { RateCourseButton } from './RateCourseButton';

interface AdvancedSortFormProps {
  closeModal: () => void;
}

const InputDescription = styled.p`
  margin: 20px 0 5px 0;
`;

const BoldInputDescription = styled.p`
  margin: 20px 0 10px 0;
  font-family: 'gilroyxbold';
  color: ${({ theme }) => theme.darkBlue};
`;

const ModalXButton = styled.span`
  font-size: 1.5em;
  margin-top: -5px;
  cursor: pointer;
`;

const options = [
  { value: 'high', label: 'høy' },
  { value: 'low', label: 'lav' },
];

const AdvancedSortForm: React.FC<AdvancedSortFormProps> = ({
  closeModal,
}) => {



  const postReview = () => {
    closeModal();
  };

  return (
    <div>
      <FlexContainer style={{ justifyContent: 'space-between' }}>
        <Title margin='0 0 5px 0'>Avansert sortering</Title>
        <ModalXButton onClick={closeModal}>&#10006;</ModalXButton>
      </FlexContainer>
      <HrLine margin='15px 0 0 0' />
      <BoldInputDescription>Totalvurdering: *</BoldInputDescription>
      <RadioButtonsBar radioID='reviewScore' valueSetter={console.log} />
      <InputDescription>Arbeidsmengde:</InputDescription>
      <Dropdown
        options={options}
        onChange={(e) => console.log(e.value)}
        placeholder='Velg...'
      />

      <button
        onClick={postReview}
      >
        Send inn
      </button>
    </div>
  );
};

export default AdvancedSortForm;
