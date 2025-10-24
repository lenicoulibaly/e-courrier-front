import Modal from "./Modal";
import React from "react";
import PropTypes from "prop-types";

export const IFrameModal = ({base64String='', title='', opened=false, handleClose})=> {
    return (
        <Modal actionVisible={false} open={opened} handleClose={handleClose}
               title={title} width={'md'}>

            {base64String ? (
                <iframe
                    src={`data:application/pdf;base64,${base64String}`}
                    style={{width: '100%', height: '500px', border: 'none'}}
                    title={title}
                ></iframe>
            ) : (
                <p>Chargement du PDF...</p>
            )}
        </Modal>
    );
};
IFrameModal.propTypes = {
    opened: PropTypes.bool,
    title: PropTypes.string,
    handleClose: PropTypes.func.isRequired,
    base64String: PropTypes.string
};