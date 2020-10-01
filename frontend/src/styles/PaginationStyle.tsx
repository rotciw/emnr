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
export const PaginationBtn = styled.div`
    background-color: ${(props: PaginationProps) => props.isActive ? 'lightgray' : 'white'};
    color: black;
    box-shadow: transparent 0px 0px 0px 0px, transparent 0px 0px 0px 4px, rgba(0, 0, 0, 0.18) 0px 2px 4px;
    border: none;
    padding: 8px;
    height: 15px;
    width: 15px;
    cursor: pointer;
    margin: 0 0.25rem;
    border-radius: 50%;
    &:hover {
        background-color: lightgray;
        text-decoration: underline;
        box-shadow: transparent 0px 0px 0px 1px, transparent 0px 0px 0px 4px, rgba(0, 0, 0, 0.12) 0px 6px 16px;
        color: green;
      }
    &:focus {
        outline: 0;
      }
`;