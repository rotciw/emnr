import { defaultTheme } from './theme';

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 99
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: defaultTheme.light,
    border: `3px solid ${defaultTheme.darkBlue}`,
    borderRadius: 0,
    minWidth: '40vw',
    maxWidth: '80vw',
    maxHeight: '75vh',
    padding: '15px 20px',
  },
};

export default modalStyles;
