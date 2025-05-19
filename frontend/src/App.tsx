import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { Navbar } from "./components/Navbar/Navbar"
import { Login } from "./pages/Login/Login";
import { Register } from "./pages/Register/Register";
import { MainPage } from "./pages/MainPage/MainPage";
import { ServiceList } from "./pages/ServiceList/ServiceList";
import { FullServiceCardInfo } from "./pages/FullServiceCardInfo/FullServiceCardInfo";
import { Applications } from "./pages/Applications/Applications";
import { FullApplicationInfo } from "./pages/FullApplicationInfo/FullApplicationInfo";


function App() {
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Проверяем наличие токенов в localStorage
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (accessToken && refreshToken) {
      setIsAuthenticated(true);  // Если токены есть, считаем пользователя авторизованным
    } else {
      setIsAuthenticated(false);
    }
  }, [location.pathname]); // Этот useEffect сработает один раз при монтировании компонента

  return (
    <>
      <Navbar/>

      <Routes>
        <Route path="/" element={<MainPage/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/services">
          <Route index element={<ServiceList/>}/>
          <Route path=":id" element={<FullServiceCardInfo/>} />
        </Route>

        <Route path="/applications">
          <Route index element={isAuthenticated ? <Applications /> : <Navigate to="/login" />}/>
          <Route path=":id" element={isAuthenticated ? <FullApplicationInfo/> : <Navigate to="/login" />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;