import { FullServiceCardInfo } from "./components/FullServiceCardInfo/FullServiceCardInfo";
import { ServiceList } from "./components/ServiceList/ServiceList";

import Styles from "./App.module.css"

function App() {
  return (
    <>
      <p className={Styles.logo}>IS-COM</p>
      <p className={Styles.under_logo}>ваш надежный <br />провайдер!</p>
      <div className={Styles.right_buttons_container}>
        <button className={Styles.right_buttons} onClick={() => console.log('Услуги clicked')}>
          Услуги
        </button>
        <button className={Styles.right_buttons} onClick={() => console.log('Заявки clicked')}>
          Заявки
        </button>
      </div>
      {/* <ServiceCard/> */}
      <ServiceList/>
    </>
  );
}

export default App;
