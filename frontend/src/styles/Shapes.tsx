import styled from 'styled-components';

interface LayoutProps {
  height?: string;
  width?: string;
  size?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  color?: string;
  angle?: string;
  margin?: string;
  mobileMargin?: string;
}

export const BottomRightTriangle = styled.div`
  position: absolute;
  top: ${(props: LayoutProps) => props.top || ''};
  right: ${(props: LayoutProps) => props.right || ''};
  bottom: ${(props: LayoutProps) => props.bottom || ''};
  left: ${(props: LayoutProps) => props.left || ''};
  width: ${(props: LayoutProps) => props.size || '100px'};
  height: ${(props: LayoutProps) => props.size || '100px'};
  margin: ${(props: LayoutProps) => props.margin || ''};
  background-color: ${(props: LayoutProps) => props.color || '#000'};
  clip-path: polygon(0% 100%, 100% 100%, 100% 0%);
  @media (max-width: 768px) {
    margin: ${(props: LayoutProps) => props.mobileMargin || props.margin || ''};
  }
`;

export const Circle = styled.div`
  position: absolute;
  border-radius: 50%;
  top: ${(props: LayoutProps) => props.top || ''};
  right: ${(props: LayoutProps) => props.right || ''};
  bottom: ${(props: LayoutProps) => props.bottom || ''};
  left: ${(props: LayoutProps) => props.left || ''};
  width: ${(props: LayoutProps) => props.size || '100px'};
  height: ${(props: LayoutProps) => props.size || '100px'};
  margin: ${(props: LayoutProps) => props.margin || ''};
  background-color: ${(props: LayoutProps) => props.color || '#000'};
  @media (max-width: 768px) {
    margin: ${(props: LayoutProps) => props.mobileMargin || props.margin || ''};
  }
`;

export const RotatedSquare = styled.div`
  position: absolute;
  top: ${(props: LayoutProps) => props.top || ''};
  right: ${(props: LayoutProps) => props.right || ''};
  bottom: ${(props: LayoutProps) => props.bottom || ''};
  left: ${(props: LayoutProps) => props.left || ''};
  width: ${(props: LayoutProps) => props.size || '100px'};
  height: ${(props: LayoutProps) => props.size || '100px'};
  margin: ${(props: LayoutProps) => props.margin || ''};
  background-color: ${(props: LayoutProps) => props.color || '#000'};
  transform: rotate(${(props: LayoutProps) => props.angle || '45deg'});
  @media (max-width: 768px) {
    margin: ${(props: LayoutProps) => props.mobileMargin || props.margin || ''};
  }
`;
