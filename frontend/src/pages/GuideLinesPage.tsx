import React from 'react';
import { CenteredFlexContainer } from 'styles/Containers';
import Layout from 'styles/Layout';
import { BoldTitle, Title } from 'styles/Text';
import { ShapeContainer } from 'styles/Containers';
import { Circle, RotatedSquare } from 'styles/Shapes';
import { defaultTheme } from 'styles/theme';

const GuidelinesPage: React.FC = () => {
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
        <BoldTitle mobileFontSize='28px'>Regler for emnevurderinger</BoldTitle>
        <br />
        <Title fontSize='18px'>
          <ol>
              <li><b>Emnevurderinger skal være saklige.</b> Vurderingene på siden skal omhandle emnet vurderingen er skrevet for. Vurderinger som tydelig er usaklige blir slettet.</li>
              <br/>
              <li><b>Personangrep eller "trolling" er ikke tillatt.</b> Fokuser på emnet, ikke enkeltpersoner i fagstaben. Det gjelder også skjellsord og særlig ukonstruktive eller nedsettende kommentarer. "Trolling" vil si å unødig provosere folk.</li>
              <br/>
              <li><b>Ikke spam.</b> Det vil blant annet si off-topic fra emnet, eller unødvendige usakligheter.</li>
              <br/>
              <li><b>Sletting fra moderatorer skal følges.</b> Det er for øyeblikket utviklingsteamet som gjør modereringen. Blir en vurdering du har skrevet slettet, skal du ikke skrive den samme på nytt. Lurer du på hvorfor vurderingen din ble slettet, kan du ta kontakt med oss på emnr.moderering@gmail.com</li>
              <br/>
              <li><b>Uenighet med moderering skal tas opp på mail.</b> Er man uenig med en moderering, skal man ta det opp med oss på EMNR sin epost: emnr.moderering@gmail.com Det samme gjelder klager på andres regelbrudd.</li>
              <br/>
              <li><b>Selvpromotering og spørreundersøkelser.</b> Reklamering for andre grupper/sider, nettsider, events, blogger, spørreundersøkelser og selvpromotering er i utgangspunktet ikke lov. Unntak kan søkes om ved å sende en epost til emnr.moderering@gmail.com</li>
          </ol>
        </Title>
        <br />
        <BoldTitle mobileFontSize='28px'>Konsekvenser av brudd på regler:</BoldTitle>
        <Title fontSize='18px'>
        Bryter en vurdering med disse retningslinjene vil vurderingen bli slettet. Ved grove eller gjentagende brudd vil brukeren bli utestengt fra å bidra til EMNR sitt innhold.
        </Title>
        <br/>
        <br/>
        <BoldTitle mobileFontSize='28px'>Hvordan skrive en god emnevurdering:</BoldTitle>
        <Title fontSize='18px'>
          <ul>
              <li>
                  En god vurdering er
                  <ul>
                      <li>saklig</li>
                      <li>konstruktiv</li>
                      <li>konkret</li>
                      <li>spesifikk</li>
                  </ul>
              </li>
              <li>Gi din ærlige mening om et emne sin arbeidsmengde, vanskelighetsgrad og ditt totalinntrykk.</li>
              <li>Skriv gjerne også hva du synes var bra, og hva emnet kan gjøre for å forbedre seg.</li>
              <li>Din erfaring med hvordan emnet i praksis var for deg som student. Hva man lærer, hvordan øvingsopplegget er, hvor viktige forelesningene er, er eksempler på nyttig informasjon som gjerne kan være med i en emnevurdering.</li>
          </ul>
        </Title>
      </CenteredFlexContainer>
    </Layout>
  );
};

export default GuidelinesPage;
