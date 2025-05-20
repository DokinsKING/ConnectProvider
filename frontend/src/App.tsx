import { Routes, Route} from 'react-router-dom';

import { Navbar } from "./components/Navbar/Navbar";
import { Login } from "./pages/Login/Login";
import { Register } from "./pages/Register/Register";
import { MainPage } from "./pages/MainPage/MainPage";
import { ServiceList } from "./pages/ServiceList/ServiceList";
import { FullServiceCardInfo } from "./pages/FullServiceCardInfo/FullServiceCardInfo";
import { Applications } from "./pages/Applications/Applications";
import { FullApplicationInfo } from "./pages/FullApplicationInfo/FullApplicationInfo";
import { ProtectedRoute } from './ProtectedRoute'; // Импортируем наш компонент

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        
        {/* Используем ProtectedRoute для логина и регистрации */}
        <Route path="/login" element={
          <ProtectedRoute inverse>
            <Login />
          </ProtectedRoute>
        } />
        <Route path="/register" element={
          <ProtectedRoute inverse>
            <Register />
          </ProtectedRoute>
        } />

        <Route path="/services">
          <Route index element={<ServiceList />} />
          <Route path=":id" element={<FullServiceCardInfo />} />
        </Route>

        {/* Защищённые маршруты для заявок */}
        <Route path="/applications">
          <Route 
            index 
            element={
              <ProtectedRoute>
                <Applications />
              </ProtectedRoute>
            }
          />
          <Route 
            path=":id" 
            element={
              <ProtectedRoute>
                <FullApplicationInfo />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
