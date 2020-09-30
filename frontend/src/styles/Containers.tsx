import React from 'react';
import styled from 'styled-components';

interface LayoutProps {
  margin?: string;
  flex?: number;
}

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const FlexItem = styled.div`
  flex: ${(props: LayoutProps) => props.flex || 1};
  margin: ${(props: LayoutProps) => props.margin || 'auto'};
`;

export const HrLine = styled.div`
  margin: 5vh 0 2vh 0;
  border-bottom: 1px solid ${({theme}) => theme.darkBlue};
`;
