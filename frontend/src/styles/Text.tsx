import styled from 'styled-components';

interface TitleProps {
  fontSize?: string;
  margin?: string;
  width?: string;
  textAlign?: string;
}

export const BoldTitle = styled.p`
  font-size: ${(props: TitleProps) => props.fontSize || '50px'};
  font-weight: bold;
  margin: ${(props: TitleProps) => props.margin || '0'};
  font-family: gilroyxbold;
  color: ${({ theme }) => theme.darkBlue};
`;

export const Title = styled.p`
  font-size: ${(props: TitleProps) => props.fontSize || '24px'};
  margin: ${(props: TitleProps) => props.margin || '0'};
  font-family: gilroymedium;
  color: ${({ theme }) => theme.darkBlue};
`;

export const SubTitle = styled.p`
  font-size: ${(props: TitleProps) => props.fontSize || '16px'};
  margin: ${(props: TitleProps) => props.margin || '0'};
  color: ${({ theme }) => theme.darkBlue};
`;

export const GoBackText = styled.p`
  font-family: gilroyxbold;
  text-decoration: underline;
  cursor: pointer;
  color: ${({ theme }) => theme.darkBlue};
`;

export const CourseItemText = styled.span`
  display: inline-block;
  width: ${(props: TitleProps) => props.width || 'auto'};
  vertical-align: top;
  text-align: ${(props: TitleProps) => props.textAlign || 'auto'};
  font-family: gilroymedium;
  margin-bottom: 3px;
`;

export const CourseItemSubtext = styled(CourseItemText)`
  font-size: 0.75em;
`;

export const ExtraBold = styled.span`
  font-family: gilroyxbold;
  font-weight: 900; /* In case the gilroy fonts aren't available, does not affect gilroyxbold */
`;
