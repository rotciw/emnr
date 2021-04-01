import styled from 'styled-components';

interface LayoutProps {
  margin?: string;
  padding?: string;
  flex?: string;
  width?: string;
  textAlign?: string;
  flexWrap?: string;
  flexDirection?: string;
}

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: ${(props: LayoutProps) => props.flexWrap || 'nowrap'};
  margin: ${(props: LayoutProps) => props.margin || 'auto'};
  width: ${(props: LayoutProps) => props.width || ''};
`;

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: ${(props: LayoutProps) => props.width || ''};
  padding: ${(props: LayoutProps) => props.padding || ''};
  box-sizing: border-box;
`;

export const SemesterContainer = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.lightlightBlue};
  flex-direction: column;
  margin: ${(props: LayoutProps) => props.margin || 'auto'};
  border: 2px solid ${({ theme }) => theme.darkBlue};
  padding: 5px 10px 20px 10px;
  @media (max-width: 576px) {
    padding: 5px 5px 20px 5px;
  }
`;

export const MobileFlexContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap; // As a backup to the @media solution

  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

export const CenteredFlexContainer = styled.div`
  display: flex;
  flex-direction: ${(props: LayoutProps) => props.flexDirection || 'row'};
  flex-wrap: ${(props: LayoutProps) => props.flexWrap || 'nowrap'};
  justify-content: center;
  margin: ${(props: LayoutProps) => props.margin || 'auto'};
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
  flex: ${(props: LayoutProps) => props.flex || '1'};
  margin: ${(props: LayoutProps) => props.margin || 'auto'};
  width: '';
`;

export const HrLine = styled.div`
  margin: ${(props: LayoutProps) => props.margin || '3vh 0 2vh 0'};
  border-bottom: 1px solid ${({ theme }) => theme.darkBlue};
`;

export const HrLineLight = styled(HrLine)`
  border-bottom: 2px solid ${({ theme }) => theme.light};
  width: 23%;
  margin-left: 1%;
`;

export const StyledTable = styled.table`
  width: 100%;
`;

export const StyledTH = styled.th`
  font-family: gilroyxbold;
  width: ${(props: LayoutProps) => props.width || 'auto'};
  text-align: ${(props: LayoutProps) => props.textAlign || 'auto'};
`;
