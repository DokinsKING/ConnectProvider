import { Hook } from "./Hook";
import { FullServiceCardInfo } from "./components/FullServiceCardInfo/FullServiceCardInfo";
import { ServiceList } from "./components/ServiceList/ServiceList";
import { MainPage } from "./components/MainPage/MainPage";
import { Applications } from "./components/Applications/Applications";
import { Routes, Route } from 'react-router-dom'; // Импортируем необходимые компоненты
import styles from "./App.module.css";

function App() {
  const hook = Hook();
  

  return (
    <>
      <div className={styles.curtain}>
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
      </div>

      <Routes>
        <Route path="" element={<MainPage hook={hook}/>} />
        <Route
          path="/services"
          element={
            <ServiceList
              navigate={hook.navigate}
              services={hook.services}
              handleSearchClick={hook.handleSearchClick}
              createApplication={hook.createApplication}
            />
          }
        />
        <Route path="/services/:id" element={<FullServiceCardInfo services={hook.services}/>} />
        <Route path="/applications" element={<Applications applications={hook.applications}/>} />
      </Routes>
    </>
  );
}

export default App;
