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
}

export const BottomRightTriangle = styled.div`
  position: absolute;
  top: ${(props: LayoutProps) => props.top || ''};
  right: ${(props: LayoutProps) => props.right || ''};
  bottom: ${(props: LayoutProps) => props.bottom || ''};
  left: ${(props: LayoutProps) => props.left || ''};
  width: ${(props: LayoutProps) => props.size || '100px'};
  height: ${(props: LayoutProps) => props.size || '100px'};
  background-color: ${(props: LayoutProps) => props.color || '#000'};
  clip-path: polygon(0% 100%, 100% 100%, 100% 0%);
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
  background-color: ${(props: LayoutProps) => props.color || '#000'};
`;

export const RotatedSquare = styled.div`
  position: absolute;
  top: ${(props: LayoutProps) => props.top || ''};
  right: ${(props: LayoutProps) => props.right || ''};
  bottom: ${(props: LayoutProps) => props.bottom || ''};
  left: ${(props: LayoutProps) => props.left || ''};
  width: ${(props: LayoutProps) => props.size || '100px'};
  height: ${(props: LayoutProps) => props.size || '100px'};
  background-color: ${(props: LayoutProps) => props.color || '#000'};
  transform: rotate(${(props: LayoutProps) => props.angle || '45deg'});
`;
