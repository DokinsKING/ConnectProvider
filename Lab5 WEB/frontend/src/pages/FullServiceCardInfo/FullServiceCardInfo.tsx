import { useParams, useLocation  } from 'react-router-dom';
import { ServiceListHook } from './../ServiceList/ServiceListHook';  // Импортируем хук
import styles from "./FullServiceCardInfo.module.css";


export function FullServiceCardInfo() {
    const { id } = useParams(); // Получаем id из URL
    const { services } = ServiceListHook();
    const service = services.find(service => String(service.id) === String(id)); // Сравниваем как строки

    // Если сервис не найден, выводим сообщение
    if (!service) {
        return <div>Сервис не найден</div>;
    }

    return (
        <div className={styles.card}>
            <p className={styles.pathway}>{useLocation().pathname}</p>
            <h2 className={styles.title}>{service.name}</h2>
            <img className={styles.image} src={service.image} alt={service.name} />
            <p className={styles.description} dangerouslySetInnerHTML={{ __html: service.description.replace(/\n/g, '<br>') }} />
        </div>
    );
}
