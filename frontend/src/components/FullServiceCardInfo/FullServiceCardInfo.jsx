import { useParams } from 'react-router-dom';
import styles from "./FullServiceCardInfo.module.css";

export function FullServiceCardInfo({ services, location }) {
    const { id } = useParams(); // Получаем id из URL
    const service = services.find(service => String(service.id) === String(id)); // Сравниваем как строки

    // Если сервис не найден, выводим сообщение
    if (!service) {
        return <div>Сервис не найден</div>;
    }

    return (
        <div className={styles.card}>
            <p className={styles.pathway}>{location.pathname}</p>
            <h2 className={styles.title}>{service.name}</h2>
            <img className={styles.image} src={service.image} alt={service.name} />
            <p className={styles.description} dangerouslySetInnerHTML={{ __html: service.description.replace(/\n/g, '<br>') }} />
        </div>
    );
}
