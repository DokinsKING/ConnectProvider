import styles from "./MainPage.module.css"; // Импортируем стили
import mainGif from "./14SE.gif";
import { Hook } from './../../Hook';

export function MainPage() {
  const { navigate } = Hook(); // Получаем navigate из основного хука
  return (
    <div className={styles.container}>
      <img className={styles.main_img} src={mainGif} alt="main_gif" />
      <span className={styles.welcome_text}>Ищете стабильный и быстрый интернет? IS-COM предоставляет качественные интернет-услуги для дома и бизнеса!</span>
      <span className={styles.main_buttons} onClick={() => navigate(`/services`)}>Наши услуги</span>
      <span className={styles.main_buttons} onClick={() => navigate("/applications")}>Заявки на подключение</span>
    </div>
  );
}

export default MainPage;
