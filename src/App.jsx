import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Home } from './pages/Home';
import { Colleges } from './pages/Colleges';
import { Predictor } from './pages/Predictor';
import { CollegeDetails } from './pages/CollegeDetails';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-main">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="border-t border-gray-800 py-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Admyra. All rights reserved. 
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p> any queries? contact us at teamadmyra@gmail.com
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="colleges" element={< Colleges />} />
          <Route path="colleges/:id" element={<CollegeDetails />} />
          <Route path="predictor" element={<Predictor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
