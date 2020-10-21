import React, { useContext } from 'react';
import { GlobalStateContext } from 'context/GlobalStateContext';
import styled from 'styled-components';

const SearchbarContainer = styled.div`
  background-color: ${({ theme }) => theme.darkBlue};
  text-align: center;
  margin: 0 25%;
  @media (max-width: 768px) {
    margin: 0 20%;
  }
`;

const SearchInput = styled.input`
  padding-left: 15px;
  height: 40px;
  width: 100%;
  transition: all 0.2s ease;
  border: none;
  outline: none;
  border-radius: 3px;

  &::placeholder {
    color: #b3b3b3;
  }

  &:focus {
    box-shadow: 0px 0px 10px 0px rgba(168, 218, 220, 0.7);
  }
`;

export const Searchbar: React.FC = () => {
  const { queryProvider } = useContext(GlobalStateContext)!;

  return (
    <SearchbarContainer>
      <SearchInput
        onChange={(e) => queryProvider.setSearchQuery(e.target.value)}
        placeholder='Søk etter fagkode eller navn..'
      />
    </SearchbarContainer>
  );
};
