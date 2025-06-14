import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Login from '../pages/Login';
import { Home } from '../pages/Home';
import  Dashboard  from '../pages/Dashboard';
import Layout from '../layout/Layout';
import { Anuncios } from '../pages/Anuncios';

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/" replace />;
}

export default function AppRoutes() {
  const { user } = useContext(AuthContext);
  const isUser = user?.role_id === 3;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
        >
          <Route path="home" element={<Home />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        
          {!isUser ? (
            <Route path="dashboard" element={<Dashboard />} /> 
          ):(
            <Route path="dashboard" element={<Navigate to="/home" replace />} />
          )
          }

          <Route path="anuncios" element={<Anuncios />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
