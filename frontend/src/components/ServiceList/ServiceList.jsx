import styles from "./ServiceList.module.css";
import { ServiceCard } from './../ServiceCard/ServiceCard';


export function ServiceList() {
    return (
        <div className = {styles.container}>
            <h2 className={styles.title}>Услуги</h2>
            <form className={styles.search_field} action="/search" method="get">
                <input
                  type="text"
                  name="q"
                  aria-label="Поиск"
                />
                <button type="submit">Поиск</button>
            </form>

            <ServiceCard/>
            <ServiceCard/>
            <ServiceCard/>
            <ServiceCard/>
            <ServiceCard/>
            <ServiceCard/>
            <ServiceCard/>
            <ServiceCard/>
            <ServiceCard/>
        </div>
    );
}
