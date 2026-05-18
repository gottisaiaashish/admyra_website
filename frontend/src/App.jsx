import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Home } from './pages/Home';
import { Colleges } from './pages/Colleges';
import { Predictor } from './pages/Predictor';
import { MarksPredictor } from './pages/MarksPredictor';
import { AiMentor } from './pages/aimentor';
import { CollegeDetails } from './pages/CollegeDetails';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Profile } from './pages/Profile';
import { EditProfile } from './pages/EditProfile';
import { ForgotPassword } from './pages/ForgotPassword';
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function Layout() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/edit-profile' || location.pathname === '/' || location.pathname === '/predictor' || location.pathname === '/marks-predictor' || location.pathname === '/colleges' || location.pathname === '/aimentor';
  const isProfilePage = location.pathname.includes('/profile') || location.pathname === '/edit-profile';

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-main">
      {!hideNavbar && <Navbar />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isProfilePage && location.pathname !== '/' && (
        <footer className="border-t border-border-subtle py-8 bg-background">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Admyra. All rights reserved. 
            </p>
          </div>
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
            <p> any queries? contact us at teamadmyra@gmail.com
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="colleges" element={< Colleges />} />
          <Route path="colleges/:id" element={<CollegeDetails />} />
          <Route path="predictor" element={<Predictor />} />
          <Route path="marks-predictor" element={<MarksPredictor />} />
          <Route path="aimentor" element={<AiMentor />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="edit-profile" element={<EditProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
