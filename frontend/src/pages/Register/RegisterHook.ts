import { useState } from 'react';
import { Hook } from './../../Hook';

export function RegisterHook() {
    const { navigate } = Hook(); // Получаем navigate из основного хука
    const [error, setError] = useState<string | null>(null);

    const goToLogin = () => navigate('/login');

    const handleGoBack = () => {
        navigate("-1"); // На 1 страницу назад в истории
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            const response = await fetch('/api/register/', { // Убедитесь, что у вас есть эндпоинт для регистрации
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password })
            });

            if (response.ok) {
                return true;
            } else {
                throw new Error('Ошибка регистрации');
            }
        } catch (error) {
            console.error("Ошибка при регистрации", error);
            return false;
        }
    };

    const handleSubmit = async (username: string, email: string, password: string) => {
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

    return {
        error,
        handleSubmit,
        goToLogin,
        handleGoBack
    };
}