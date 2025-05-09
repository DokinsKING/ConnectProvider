import styles from "./MainPage.module.css"; // Импортируем стили
import mainGif from "./14SE.gif";

export function MainPage( { hook } : {hook : any} ) {
  return (
    <div className={styles.container}>
      <img className={styles.main_img} src={mainGif} alt="main_gif" />
      <span className={styles.welcome_text}>Ищете стабильный и быстрый интернет? IS-COM предоставляет качественные интернет-услуги для дома и бизнеса!</span>
      <span className={styles.main_buttons} onClick={() => hook.navigate(`/services`)}>Наши услуги</span>
      <span className={styles.main_buttons} onClick={() => hook.navigate("/applications")}>Заявки на подключение</span>
    </div>
  );
}

export default MainPage;
