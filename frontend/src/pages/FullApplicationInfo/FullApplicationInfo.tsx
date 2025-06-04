import { Link } from 'react-router-dom';

import { FullApplicationInfoHook } from './FullApplicationInfoHook';
import styles from './FullApplicationInfo.module.css';

export function FullApplicationInfo() {
  const { creatorName, moderatorName, isAdmin, isEditing, editedApplication, application, applicationServices, statusMapping, handleInputChange, getStatus, handleSave, setIsEditing} = FullApplicationInfoHook();

  if (!application) {
    return;
  }

  const formatDate = (dateString: any) => {
    if (!dateString) return 'Не указано';
    try {
      return new Date(dateString).toLocaleString('ru-RU');
    } catch {
      return 'Некорректная дата';
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.pathway}>
          /
          <Link to="/applications" className={styles.linkOnly}>applications</Link>
          / 
          <span className={styles.linkOnly}>Заявка #{application.id}</span>
      </p>
      
      <h2 className={styles.title}>Заявка #{application.id}</h2>
      
      <div className={styles.statusSection}>
        {isEditing ? (
          <select
            name="status"
            value={editedApplication.status}
            onChange={handleInputChange}
            className={`${styles.status} ${styles[editedApplication.status] || ''} ${styles.statuseditInput}`}
          >
            {Object.keys(statusMapping).map((russianStatus) => (
              <option key={russianStatus} value={statusMapping[russianStatus]}>
                {russianStatus}
              </option>
            ))}
          </select>
        ) : (
          <span className={`${styles.status} ${styles[application.status] || ''}`}>
            {getStatus(application.status) || 'без статуса'}
          </span>
        )}
        <p>Создана: {formatDate(application.created_at)}</p>
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}>
          <h3>Дата оформления</h3>
          {isEditing ? (
            <input
              type="datetime-local"
              name="form_date"
              value={editedApplication.form_date}
              onChange={handleInputChange}
              className={styles.editInput}
            />
          ) : (
            <p>{formatDate(application.form_date)}</p>
          )}
        </div>
        <div className={styles.detailItem}>
          <h3>Дата завершения</h3>
          {isEditing ? (
            <input
              type="datetime-local"
              name="completion_date"
              value={editedApplication.completion_date}
              onChange={handleInputChange}
              className={styles.editInput}
            />
          ) : (
            <p>{formatDate(application.completion_date)}</p>
          )}
        </div>
        <div className={styles.detailItem}>
          <h3>Автор</h3>
          <p>{creatorName || 'не указан'}</p>
        </div>
        <div className={styles.detailItem}>
          <h3>Модератор</h3>
          <p>{moderatorName || 'не назначен'}</p>
        </div>
      </div>

      {isAdmin && (
        <div className={styles.editControls}>
          {isEditing ? (
            <>
              <button onClick={handleSave} className={styles.saveButton}>
                Сохранить
              </button>
              <button onClick={() => setIsEditing(false)} className={styles.cancelButton}>
                Отмена
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className={styles.editButton}>
              Редактировать
            </button>
          )}
        </div>
      )}

      <div className={styles.servicesSection}>
  <h3 className={styles.servicesTitle}>Услуги</h3>
  {applicationServices.length > 0 ? (
    <div>
      <ul className={styles.servicesList}>
        {applicationServices.map((item:any, index:any,) => (
          <li key={index} className={styles.serviceCard}>
            <h2 className={styles.serviceName}>{item.name}</h2>
            <img className={styles.serviceImage} src={item.image} alt={item.name} />
            <p className={styles.serviceDescription}>{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <p>Корзина пуста.</p>
  )}
</div>

    </div>
  );
}