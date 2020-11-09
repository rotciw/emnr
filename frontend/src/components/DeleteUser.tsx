import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import DeleteUserIcon from 'assets/icons/deleteUser.svg';
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
  width: 25px;
  margin-left: auto;
  cursor: pointer;
  :hover {
    filter: invert(48%) sepia(96%) saturate(3381%) hue-rotate(328deg)
      brightness(86%) contrast(112%);
  }
`;

interface ReviewProps {
  userEmail: string;
}

const DeleteUser: React.FC<ReviewProps> = ({ userEmail }) => {
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
      .delete(`${API_URL}/user/delete/?userEmail=${userEmail}`)
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
        contentLabel='Delete User Modal'
      >
        <FlexContainer style={{ justifyContent: 'space-between' }}>
          <BoldTitle margin='0 0 5px 0'>Slett brukeren</BoldTitle>
          <ModalXButton onClick={toggleModalIsOpen}>&#10006;</ModalXButton>
        </FlexContainer>
        <HrLine margin='5px 0 15px 0' />
        <p>
          Alle anmeldelsene til bruker <b>{userEmail}</b> vil bli slettet, og
          vil ikke få mulighet til å legge til flere anmeldelser.
        </p>
        <p>Er du sikker? Denne handlingen kan ikke bli reversert.</p>

        {loading ? (
          <DisabledRedButton>
            <PulseLoader color='#FFF' size='10px' />
          </DisabledRedButton>
        ) : (
          <RedButton onClick={deleteReview}>Ja, jeg er sikker</RedButton>
        )}
      </Modal>
      <TrashBtn src={DeleteUserIcon} onClick={toggleModalIsOpen} />
    </>
  );
};

export default DeleteUser;
