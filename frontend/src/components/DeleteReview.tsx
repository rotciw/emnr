import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import TrashIcon from 'assets/icons/trash.svg';
import Modal from 'react-modal';
import modalStyles from 'styles/Modals';
import { FlexContainer, HrLine } from 'styles/Containers';
import { BoldTitle } from 'styles/Text';
import { ModalXButton, RedButton, DisabledRedButton } from 'styles/Buttons';
import axios from 'axios';
import API_URL from 'config';
import { PulseLoader } from 'react-spinners';
import { GlobalStateContext } from 'context/GlobalStateContext';

const TrashBtn = styled.img`
  width: 20px;
  margin-left: 15px;
  float: right;
  cursor: pointer;
  :hover {
    filter: invert(48%) sepia(96%) saturate(3381%) hue-rotate(328deg)
      brightness(86%) contrast(112%);
  }
`;

interface ReviewProps {
  courseCode: string;
  userEmail: string;
}

const DeleteReview: React.FC<ReviewProps> = ({ courseCode, userEmail }) => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { refreshProvider } = useContext(GlobalStateContext)!;

  const toggleModalIsOpen = () => {
    setModalIsOpen(!modalIsOpen);
  };

  const deleteReview = async () => {
    let isCancelled = false;
    setLoading(true);
    await axios
      .delete(
        `${API_URL}/review/delete/?courseCode=${courseCode}&userEmail=${userEmail}`,
      )
      .then(() => {
        if (!isCancelled) {
          refreshProvider.setDeleteReviewHaveRefreshed(
            !refreshProvider.deleteReviewHaveRefreshed,
          );
          setLoading(false);
          toggleModalIsOpen();
        }
      })
      .catch((err) => console.log(err));
    return () => {
      isCancelled = true;
    };
  };

  Modal.setAppElement('#root');

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={toggleModalIsOpen}
        style={modalStyles}
        contentLabel='Delete Review Modal'
      >
        <FlexContainer style={{ justifyContent: 'space-between' }}>
          <BoldTitle margin='0 0 5px 0'>Slett anmeldelsen</BoldTitle>
          <ModalXButton onClick={toggleModalIsOpen}>&#10006;</ModalXButton>
        </FlexContainer>
        <HrLine margin='5px 0 15px 0' />
        <p>Denne anmeldelsen vil bli slettet.</p>
        <p>Er du sikker? Denne handlingen kan ikke bli reversert.</p>

        {loading ? (
          <DisabledRedButton>
            <PulseLoader color='#FFF' size='10px' />
          </DisabledRedButton>
        ) : (
          <RedButton onClick={deleteReview}>Ja, jeg er sikker</RedButton>
        )}
      </Modal>
      <TrashBtn src={TrashIcon} onClick={toggleModalIsOpen} />
    </>
  );
};

export default DeleteReview;
