import React, { useState } from 'react';

export function Login({ navigate, login } : { navigate: any, login : any}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await login(username, password);
            if (response) {
                // Переход на главную страницу после успешного логина
                navigate('/');
            } else {
                setError('Ошибка авторизации. Проверьте данные.');
            }
        } catch (error) {
            setError('Ошибка сети или сервер недоступен.');
        }
    };

    return (
        <div className="login-container">
            <h2>Вход в систему</h2>
            <form onSubmit={handleSubmit}>
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
                {error && <div className="error">{error}</div>}
                <button type="submit">Войти</button>
            </form>

            <div className="register-link">
                <p>Нет аккаунта? <button onClick={()=>navigate('/register')}>Зарегистрироваться</button></p>
            </div>
        </div>
    );
};
