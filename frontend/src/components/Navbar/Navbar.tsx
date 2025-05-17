import styles from "./Navbar.module.css";
import { type RootState } from '../../redux/store';  // Добавляем `type`
import { useSelector } from 'react-redux';
import { Hook } from '../../Hook';

export function Navbar() {
    const { navigate, isLoggedIn, handleLogout } = Hook();
    const username = useSelector((state: RootState) => state.user.username);
    return (
        <nav className={styles.navbar}>
        <div className={styles.full_logo} onClick={() => navigate("/")}>
          <span className={styles.logo}>IS-COM</span>
          <span className={styles.under_logo}>ваш надежный <br />провайдер!</span>
        </div>

        <div className={styles.right_buttons_container}>
          {isLoggedIn && (
            <div className={styles.user_info_container}>
              <span className={styles.username}>Username: {username}</span>
              <button 
                className={styles.logout_button}
                onClick={handleLogout}
              >
                Выйти из аккаунта
              </button>
            </div>
          )}
          <button className={styles.right_buttons} onClick={() => navigate("/services")}>
            Услуги
          </button>
          <button className={styles.right_buttons} onClick={() => navigate("/applications")}>
            Заявки
          </button>
        </div>
      </nav>
    );
}
