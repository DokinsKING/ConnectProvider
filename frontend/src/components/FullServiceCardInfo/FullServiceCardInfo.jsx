import styles from "./FullServiceCardInfo.module.css";
import mobileTarif from "./home_internet_tarif.jpg";

export function FullServiceCardInfo() {
    return (
        <div className={styles.card}>
            <h2 className={styles.title}>Домашний интернет</h2>
            <img className={styles.image} src={mobileTarif} alt="Home Internet"  />
            <p className={styles.description}>
                Быстрый и надежный интернет для вашего дома. Стабильное соединение, выгодные тарифы, поддержка 24/7.
            </p>
        </div>
    );
}
