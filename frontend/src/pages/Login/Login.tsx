import { useState } from 'react';
import { LoginHook } from './LoginHook';
import styles from './Login.module.css'; // Импортируем стили из .module.css

export function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { error, handleSubmit, goToRegister, handleGoBack, goToMain } = LoginHook(); // Используем хук

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleSubmit(username, password); // Теперь navigate не передается
    };

    return (
        <div className={styles.login_container}>
            <h2>Вход в систему</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="username">Имя пользователя:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Пароль:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className={styles.error}>{error}</div>}
                <button className={styles.button} onClick={goToMain} type="submit">Войти</button>
            </form>

            <div className={styles.register_link}>
                <p>Нет аккаунта? <button className={styles['register-button']} onClick={goToRegister}>Зарегистрироваться</button></p>
            </div>

            <button 
                type="button"
                className={styles['back-button']}
                onClick={handleGoBack} // Возврат на 1 страницу назад в истории
            >
                Назад
            </button>
        </div>
    );
}
