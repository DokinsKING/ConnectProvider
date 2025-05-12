import { useParams, useLocation } from 'react-router-dom';
import { ServiceListHook } from './../ServiceList/ServiceListHook';
import styles from "./FullServiceCardInfo.module.css";

export function FullServiceCardInfo() {
    const { id } = useParams();
    const location = useLocation(); // Выносим хук на верхний уровень
    const { services } = ServiceListHook();
    const service = services.find(service => String(service.id) === String(id));

    if (!service) {
        return;
    }

    return (
        <div className={styles.card}>
            <p className={styles.pathway}>{location.pathname}</p> {/* Используем полученное значение */}
            <h2 className={styles.title}>{service.name}</h2>
            <img className={styles.image} src={service.image} alt={service.name} />
            <p className={styles.description} dangerouslySetInnerHTML={{ __html: service.description.replace(/\n/g, '<br>') }} />
        </div>
    );
}