import IndexPage from '@/pages/index';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <IndexPage />
    </>
  );
}

export default App;
