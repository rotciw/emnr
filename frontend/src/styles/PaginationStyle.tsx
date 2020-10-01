import styled from 'styled-components';

interface PaginationProps{
    isActive?: boolean;
}

export const PaginationWrapper = styled.div`
    padding: 2rem 0;
    display: flex;
    justify-content: center;
`;

export const Separator = styled.div`
    width: 1rem;
    margin: 0 0.25rem;
`;

export const PageItem = styled.button`
    background: transparent;
    border: none;
    height: 2rem;
    width: 2rem;
    margin: 0 0.25rem;
    border-radius: 50%;
    font-weight: 600;
    color: gray;
    &:hover {
        text-decoration: underline;
      }
    &:focus {
        outline: 0;
      }
`;

export const Active = styled.button`
    background-color: gray;
    color: white;
`;

export const SidePaginationBtn = styled.button`
    background-color: ${(props: PaginationProps) => props.isActive ? 'gray' : 'white'};
    color: 'black';
    box-shadow: transparent 0px 0px 0px 1px, transparent 0px 0px 0px 4px, rgba(0, 0, 0, 0.18) 0px 2px 4px;
    &:hover {
        text-decoration: none;
        box-shadow: transparent 0px 0px 0px 1px, transparent 0px 0px 0px 4px, rgba(0, 0, 0, 0.12) 0px 6px 16px;
    }
`;

export const Sides = styled.button`
    box-shadow: transparent 0px 0px 0px 1px, transparent 0px 0px 0px 4px, rgba(0, 0, 0, 0.18) 0px 2px 4px;
&:hover {
    text-decoration: none;
    box-shadow: transparent 0px 0px 0px 1px, transparent 0px 0px 0px 4px, rgba(0, 0, 0, 0.12) 0px 6px 16px;
  }
`;