import styles from './Applications.module.css';

export function Applications({ applications } : {applications: any[]}) {
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
                <td>
                {application.completion_date ? 
                  new Date(application.completion_date).toLocaleString('ru-RU') : 
                  'Неизвестно'}
              </td> {/* Дата завершения, если есть, или "Неизвестно" */}
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
