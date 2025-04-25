import React from 'react';
import styles from './Applications.module.css';

export function Applications({ applications }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Заявки</h2>

      {applications && applications.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Статус</th>
              <th>Дата начала</th>
              <th>Дата окончания</th>
            </tr>
          </thead>
          <tbody id="requests-body">
            {applications.map((application) => (
              <tr className={styles.row} key={application.id}>
                <td>{application.status}</td>  {/* Статус заявки */}
                <td>{new Date(application.created_at).toLocaleString('ru-RU')}</td>  {/* Дата создания */}
                <td>{new Date(application.completion_date).toLocaleString('ru-RU')}</td> {/* Дата завершения */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.title}>Заявки не найдены.</p> // Сообщение, если заявок нет
      )}
    </div>
  );
}
