import React from 'react';
import Modal from 'react-modal';
import ModalButton from './PopupButton';
import style from './styles.css';
import Options from './components/Options';
import Notifications from './components/Notifications';
class PopUp extends React.Component {
  constructor() {
    super();

    this.state = { modalOpened: false };
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState(prevState => ({ modalOpened: !prevState.modalOpened }));
  }

  render() {
    const { data } = this.props;
    return (
      <div className={style.modalWrapper}>
        <ModalButton handleClick={this.toggleModal}>
        </ModalButton>
        <Modal
          className={{ base: [style.base]}}
          overlayClassName={{ base: [style.overlayBase] }}
          isOpen={this.state.modalOpened}
          onRequestClose={this.toggleModal}
        >
        <Options>
                <Notifications />
            </Options>          
        </Modal>
      </div>
    );
  }
}

export default PopUp;