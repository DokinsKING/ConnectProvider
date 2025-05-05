import { Hook } from "./Hook";
import { FullServiceCardInfo } from "./pages/FullServiceCardInfo/FullServiceCardInfo";
import { ServiceList } from "./pages/ServiceList/ServiceList";
import { MainPage } from "./pages/MainPage/MainPage";
import { Applications } from "./pages/Applications/Applications";
import { Routes, Route } from 'react-router-dom'; // Импортируем необходимые компоненты
import { Login } from "./pages/Login/Login";
import { Register } from "./pages/Register/Register";
import styles from "./App.module.css";


function App() {
  const hook = Hook(); // Получаем хук
  
  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.full_logo} onClick={() => hook.navigate("")}>
          <span className={styles.logo}>IS-COM</span>
          <span className={styles.under_logo}>ваш надежный <br />провайдер!</span>
        </div>

        <div className={styles.right_buttons_container}>
          <button className={styles.right_buttons} onClick={() => hook.navigate("/services")}>
            Услуги
          </button>
          <button className={styles.right_buttons} onClick={() => hook.navigate("/applications")}>
            Заявки
          </button>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<MainPage navigate={hook.navigate} />} />
        <Route path="/login" element={<Login navigate={hook.navigate} login={hook.login} />} />
        <Route path="/register" element={<Register navigate={hook.navigate} register={hook.register} />} />
        <Route path="/services">
          <Route index element={<ServiceList 
                                  navigate={hook.navigate} 
                                  services={hook.services} 
                                  handleSearchClick={hook.handleSearchClick} 
                                  createApplication={hook.createApplication} 
                                />} />
          <Route path=":id" element={<FullServiceCardInfo services={hook.services} pathname={hook.location.pathname} />} />
        </Route>
        <Route path="/applications" element={<Applications applications={hook.applications} />} />
      </Routes>
    </>
  );
}

export default App;
