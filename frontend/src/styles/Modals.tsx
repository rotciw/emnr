import React from 'react';
import styled from 'styled-components';
import { defaultTheme } from './theme';

interface ModalProps {}

export const modalStyles = {
  overlay:{
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: defaultTheme.light,
    border: '3px solid ' + defaultTheme.darkBlue,
    borderRadius: 0,
    minWidth: '40vw',
    maxWidth: '80vw',
    padding: '15px 20px',
  },
};
