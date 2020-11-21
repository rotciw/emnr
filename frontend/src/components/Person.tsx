import React from 'react';
import styled from 'styled-components';

interface PersonProps {
  name: string;
  imgSrc: string;
  linkedIn: string;
}

const PersonContainer = styled.div`
  margin: 20px 10px 20px 0;
  display: inline-block;
  text-align: center;
  width: 170px;
  height: 170px;
  @media (max-width: 768px) {
    width: 140px;
    height: 140px;
    margin: 30px 10px 30px 0;
  }
  @media (max-width: 576px) {
    width: 100px;
    height: 100px;
  }
`;

const Image = styled.img`
  display: flex;
  cursor: pointer;
  width: 170px;
  height: 170px;
  @media (max-width: 768px) {
    width: 140px;
    height: 140px;
  }
  @media (max-width: 576px) {
    width: 100px;
    height: 100px;
  }
`;

const Caption = styled.span`
  display: block;
`;

const Anchor = styled.a`
  text-decoration: none;
  font-family: gilroyxbold;
  color: ${({ theme }) => theme.darkBlue};
`;

const Person: React.FC<PersonProps> = ({ name, imgSrc, linkedIn }) => {
  return (
    <PersonContainer>
      <Anchor href={linkedIn} target='_blank'>
        <Image src={imgSrc} alt={name} />
      </Anchor>

      <Caption>
        <Anchor href={linkedIn} target='_blank'>
          {name}
        </Anchor>
      </Caption>
    </PersonContainer>
  );
};

export default Person;
