import styled from 'styled-components';

interface LayoutProps {
  margin?: string;
  flex?: number;
  width?: string;
  textAlign?: string;
}

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: ${(props: LayoutProps) => props.margin || 'auto'};
`;

export const CenteredFlexContainer = styled.div`
  display: flex;
  justify-content: center;
`;

// Used to hide shape overflow
export const ShapeContainer = styled.div`
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const LocalShapeContainer = styled.div`
  position: relative;
  z-index: -1;
  overflow: hidden;
  flex: 1;
`;

export const FlexItem = styled.div`
  flex: ${(props: LayoutProps) => props.flex || 1};
  margin: ${(props: LayoutProps) => props.margin || 'auto'};
  width: '';
`;

export const HrLine = styled.div`
  margin: 5vh 0 2vh 0;
  border-bottom: 1px solid ${({theme}) => theme.darkBlue};
`;

export const StyledTable = styled.table`
  width: 100%;
`;

export const StyledTH = styled.th`
  font-family: gilroyxbold;
  width: ${(props: LayoutProps) => props.width || 'auto'};
  text-align: ${(props: LayoutProps) => props.textAlign || 'auto'};
`;
