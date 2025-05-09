import React, { useState } from 'react';
import { LoginHook } from "./LoginHook";

export function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { error, handleSubmit, goToRegister, handleGoBack, goToMain } = LoginHook(); // Используем хук

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleSubmit(username, password); // Теперь navigate не передается
    };

    return (
        <div className="login-container">
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
                {error && <div className="error">{error}</div>}
                <button onClick={goToMain} type="submit">Войти</button>
            </form>

            <div className="register-link">
                <p>Нет аккаунта? <button onClick={goToRegister}>Зарегистрироваться</button></p>
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