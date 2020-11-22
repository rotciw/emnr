import React from 'react';
import { CenteredFlexContainer } from 'styles/Containers';
import Layout from 'styles/Layout';
import { BoldTitle, Title } from 'styles/Text';
import { ShapeContainer } from 'styles/Containers';
import { Circle, RotatedSquare } from 'styles/Shapes';
import { defaultTheme } from 'styles/theme';
import wictor from 'assets/images/wic.jpg';
import casp from 'assets/images/casp.png';
import eivind from 'assets/images/eivind.jpg';
import haakon from 'assets/images/haakon.png';
import harald from 'assets/images/harald.png';
import jakob from 'assets/images/jakob.png';
import sylvi from 'assets/images/sylvi.png';
import Person from 'components/Person';

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
          EMNR skal hjelpe studenter med å velge emner på NTNU. Tjenesten er
          laget for <a href='http://uninett.no/'>Uninett</a> av gruppe 13 i
          emnet TDT4290 Kundestyrt Prosjekt. Brukere har tilgang til relevant
          objektiv informasjon som snittkarakter og ståprosent, men i tillegg
          også subjektive anmeldelser av emner laget av andre studenter.
          <br />
          <br />
          EMNR gir kun studenter som har hatt emnet tidligere mulighet til å
          anmelde faget, og autentiserer brukere gjennom FEIDE. På denne måten
          kan brukere være sikre på at anmeldelsene er ekte.
        </Title>
        <br />
        <BoldTitle mobileFontSize='28px'>Om teamet</BoldTitle>
        <Title fontSize='18px'>
          Teamet består av 7 studenter som studerer Datateknologi ved NTNU.
        </Title>
        <CenteredFlexContainer flexWrap='wrap'>
          <Person
            name='Haakon Gunleiksrud'
            imgSrc={haakon}
            linkedIn='https://www.linkedin.com/in/haakon-gunleiksrud-a45309a9/'
          />
          <Person
            name='Eivind H. Furdal'
            imgSrc={eivind}
            linkedIn='https://www.linkedin.com/in/eivind-hovdeg%C3%A5rd-furdal-3687041b9/'
          />{' '}
          <Person
            name='Jakob E. Kielland'
            imgSrc={jakob}
            linkedIn='https://www.linkedin.com/in/jakob-kielland-93556613a//'
          />{' '}
          <Person
            name='Sylvi P. Huynh'
            imgSrc={sylvi}
            linkedIn='https://www.linkedin.com/in/sylvi-huynh-207401200/'
          />{' '}
          <Person
            name='Harald G. Brevik'
            imgSrc={harald}
            linkedIn='https://www.linkedin.com/in/harald-guntvedt-brevik-6386a3169'
          />{' '}
          <Person
            name='Casper Feng'
            imgSrc={casp}
            linkedIn='https://www.linkedin.com/in/casperfeng/'
          />
          <Person
            name='Wictor Zhao'
            imgSrc={wictor}
            linkedIn='https://www.linkedin.com/in/wictorz/'
          />
        </CenteredFlexContainer>
      </CenteredFlexContainer>
    </Layout>
  );
};

export default AboutPage;
