import Layout from "./Layout";
import { PDFViewer } from '@react-pdf/renderer';

const Print = () => {
  return (
    <PDFViewer 
    style={{ position: 'absolute', border: 0, height: '100%', width: '100%' }} 
    >
      <Layout />
    </PDFViewer>
  )
}

export default Print;