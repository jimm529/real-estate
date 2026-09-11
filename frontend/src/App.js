import React from 'react';
import Navbar from './components/Navbar';
import PropertyList from './pages/PropertyList';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <PropertyList />
      </main>
    </div>
  );
}

export default App;
