import { createGlobalStyle } from 'styled-components';
const GilroyLight = require('../fonts/gilroy-light.woff');
const GilroyMedium = require('../fonts/gilroy-medium.woff');
const GilroyXBold = require('../fonts/gilroy-extrabold.woff');

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'gilroylight';
    font-style: normal;
    font-weight: normal;
    src: url(${GilroyLight});
  }
  @font-face {
    font-family: 'gilroymedium';
    font-style: normal;
    font-weight: normal;
    src: url(${GilroyMedium});
  }
  @font-face {
    font-family: 'gilroyxbold';
    font-style: normal;
    font-weight: normal;
    src: url(${GilroyXBold});
  }

  body {
    margin: 0;
    padding: 0;
    background: ${({ theme }) => theme.light};
    font-family: gilroylight, Open-Sans, Helvetica, Sans-Serif;
  }
`;

export default GlobalStyle;
