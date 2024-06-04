import React, { useState, Fragment } from 'react';

interface FullScreenProps extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
> {
    isDisplay: boolean;
    onClickClose: (bol: boolean) => void;
}

const FullScreen = ({ isDisplay, children, onClickClose }: FullScreenProps) => {
    return (
        <Fragment>
            {isDisplay ?
                <div className='fullscreen-modal'>
                    <div className='fullscreen-modal-container'>
                        <div className='close-btn-container'>
                            <button type='button' className='btn btn-danger' onClick={() => { onClickClose(false); }}>
                                Close fullscreen
                            </button>
                        </div>
                        <div className='fullscreen-modal-body'>
                            {children}
                        </div>
                    </div>
                </div>
                : null}
        </Fragment>
    )
}

export default FullScreen;