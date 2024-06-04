import React from 'react';
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import Booklet from "./Booklet";

const BookletViewer = () => {
    return (
        <div className='booklet-previewer'>
            <PDFViewer showToolbar={true} style={{ position: 'absolute', border: 0, height: '90%', width: '100%' }}>
                <Booklet />
            </PDFViewer>
        </div>
    )
}

export default BookletViewer;