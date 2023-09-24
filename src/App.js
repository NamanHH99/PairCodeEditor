import './App.css';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import CodePage from './Pages/CodePage';
import { Toaster } from 'react-hot-toast';
function App() {
  return (
    <>
      <div>
        <Toaster position='top-right'></Toaster>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>}></Route>
          <Route path="/room/:roomId" element={<CodePage/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
