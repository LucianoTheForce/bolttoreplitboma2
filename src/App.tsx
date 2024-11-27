import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SingleScreen } from './components/SingleScreen';
import { UserView } from './components/UserView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/screen/1" replace />} />
        <Route path="/screen/:id" element={<SingleScreen />} />
        <Route path="/join/screen-:id" element={<UserView />} />
        <Route path="*" element={<Navigate to="/screen/1" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;