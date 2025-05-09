import React, { useState } from 'react';
import { RegisterHook } from "./RegisterHook";

export function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { error, handleSubmit, goToLogin, handleGoBack } = RegisterHook(); // Используем хук

    const onSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            await handleSubmit(username, email, password); // Теперь navigate не передается
        };

    return (
        <div className="register-container">
            <h2>Регистрация</h2>
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
                <p>Уже есть аккаунт? <button onClick={goToLogin}>Войти</button></p>
            </div>

            <button 
                type="button"
                onClick={handleGoBack} // Возврат на 1 страницу назад в истории
            >
                Назад
            </button>
        </div>
    );
}
