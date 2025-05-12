import styles from './Applications.module.css';
import { ApplicationsListHook } from './ApplicationsListHook';
import { Hook } from './../../Hook';

export function Applications() {
  const { applications, statuses, filters, handleFilterChange } = ApplicationsListHook();
  const { navigate } = Hook();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Заявки</h2>

      <div>
        <input
          type="date"
          name="start_date"
          value={filters.start_date}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="end_date"
          value={filters.end_date}
          onChange={handleFilterChange}
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">Все статусы</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

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
              <tr onClick={()=>navigate(`${application.id}`)} className={styles.row} key={application.id}>
                <td>{application.status}</td>
                <td>{new Date(application.created_at).toLocaleString('ru-RU')}</td>
                <td>
                  {application.completion_date
                    ? new Date(application.completion_date).toLocaleString('ru-RU')
                    : 'Неизвестно'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.title}>Заявки не найдены.</p>
      )}
    </div>
  );
}