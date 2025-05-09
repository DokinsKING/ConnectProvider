import { Hook } from "./Hook";
import { FullServiceCardInfo } from "./pages/FullServiceCardInfo/FullServiceCardInfo";
import { ServiceList } from "./pages/ServiceList/ServiceList";
import { MainPage } from "./pages/MainPage/MainPage";
import { Applications } from "./pages/Applications/Applications";
import { Routes, Route } from 'react-router-dom';
import { Login } from "./pages/Login/Login";
import { Register } from "./pages/Register/Register";
import styles from "./App.module.css";

function App() {
  const { navigate, isLoggedIn, handleLogout } = Hook();

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.full_logo} onClick={() => navigate("/")}>
          <span className={styles.logo}>IS-COM</span>
          <span className={styles.under_logo}>ваш надежный <br />провайдер!</span>
        </div>

        <div className={styles.right_buttons_container}>
          {isLoggedIn && (
            <button 
              className={styles.logout_button}
              onClick={handleLogout}
            >
              Выйти из аккаунта
            </button>
          )}
          <button className={styles.right_buttons} onClick={() => navigate("/services")}>
            Услуги
          </button>
          <button className={styles.right_buttons} onClick={() => navigate("/applications")}>
            Заявки
          </button>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<MainPage/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/services">
          <Route index element={<ServiceList/>}/>
          <Route path=":id" element={<FullServiceCardInfo/>} />
        </Route>
        <Route path="/applications" element={<Applications/>} />
      </Routes>
    </>
  );
}

export default App;