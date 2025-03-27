import styles from "./ServiceCard.module.css";
import mobileTarif from "./home_internet_tarif.jpg";

export function ServiceCard() {
    return (
        <div className={styles.card}>
            <h2 className={styles.title}>Домашний интернет</h2>
            <img className={styles.image} src={mobileTarif} alt="Home Internet"  />
            <p className={styles.description}>
                Быстрый и надежный интернет для вашего дома. Стабильное соединение, выгодные тарифы, поддержка 24/7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff.
            </p>
            <div className={styles.buttons}>
                <button>Подробнее</button>
                <button>Добавить в заявки</button>
            </div>
        </div>
    );
}
