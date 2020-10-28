import React from 'react';
import { SyncLoader } from 'react-spinners';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  margin-top: 50px;
  display: flex;
  justify-content: center;
`;

const Loading: React.FC = () => {
  return (
    <LoadingContainer>
      <SyncLoader color='#1D3557' />
    </LoadingContainer>
  );
};

export default Loading;
