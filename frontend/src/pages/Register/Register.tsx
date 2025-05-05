import React, { useState } from 'react';

export function Register({ navigate, register }: { navigate: any, register: any }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await register(username, email, password);
            if (response) {
                // Переход на страницу логина после успешной регистрации
                navigate('/login');
            } else {
                setError('Ошибка регистрации. Проверьте данные.');
            }
        } catch (error) {
            setError('Ошибка сети или сервер недоступен.');
        }
    };

    return (
        <div className="register-container">
            <h2>Регистрация</h2>
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
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <button type="submit">Зарегистрироваться</button>
            </form>

            <div className="login-link">
                <p>Уже есть аккаунт? <button onClick={() => navigate('/login')}>Войти</button></p>
            </div>
        </div>
    );
}
