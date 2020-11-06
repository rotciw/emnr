import React from 'react';
import { CenteredFlexContainer } from 'styles/Containers';
import Layout from 'styles/Layout';
import { BoldTitle, Title } from 'styles/Text';
import { ShapeContainer } from 'styles/Containers';
import { Circle, RotatedSquare } from 'styles/Shapes';
import { defaultTheme } from 'styles/theme';

const AboutPage: React.FC = () => {
  return (
    <Layout padding='0 20%'>
      <ShapeContainer>
        <Circle
          color={defaultTheme.lightBlue}
          size='240px'
          right='0'
          top='130px'
          margin='0 -170px 0 0'
          mobileMargin='0 -400px 0 0'
        />
        <RotatedSquare
          color={defaultTheme.blue}
          size='240px'
          left='0'
          top='50vh'
          angle='20deg'
          margin='0 0 0 -200px'
          mobileMargin='0 0 0 -400px'
        />
        <RotatedSquare
          color={defaultTheme.blue}
          size='240px'
          right='0'
          top='75vh'
          angle='80deg'
          margin='0 -225px 0 0'
          mobileMargin='0 -400px 0 0'
        />
      </ShapeContainer>
      <CenteredFlexContainer flexDirection='column' margin='5% 10%'>
        <BoldTitle mobileFontSize='28px'>Om EMNR</BoldTitle>
        <br />
        <Title fontSize='22px'>
          Hjelp til å velge NTNU-emner, for og av studenter
        </Title>
        <br />
        <Title fontSize='18px'>
          EMNR skal hjelpe studenter med å velge emner på NTNU. Brukere har
          tilgang til relevant objektiv informasjon som snittkarakter og
          ståprosent, men i tillegg også subjektive anmeldelser av emner laget
          av andre studenter.
          <br />
          <br />
          EMNR gir kun studenter som har hatt emnet tidligere mulighet til å
          anmelde faget, og autentiserer brukere gjennom FEIDE. På denne måten
          kan brukere være sikre på at anmeldelsene er ekte.
        </Title>
      </CenteredFlexContainer>
    </Layout>
  );
};

export default AboutPage;
