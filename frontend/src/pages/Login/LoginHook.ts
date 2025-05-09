import { useState } from 'react';
import { Hook } from './../../Hook';

export function LoginHook() {
    const { navigate } = Hook(); // Получаем navigate из основного хука
    const [error, setError] = useState<string | null>(null);

    const goToRegister = () => navigate('/register');

    const handleGoBack = () => {
        navigate("-1"); // На 1 страницу назад в истории
    };

    const goToMain = () => navigate('/');

    const login = async (username: string, password: string) => {
        try {
            const response = await fetch('/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                return true;
            } else {
                throw new Error(data.detail || 'Ошибка авторизации');
            }
        } catch (error) {
            console.error("Ошибка при авторизации", error);
            setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
            return false;
        }
    };

    const handleSubmit = async (username: string, password: string) => {
        try {
            const success = await login(username, password);
            if (success) {
                const referrer = document.referrer;
                const currentOrigin = window.location.origin;
                
                if (referrer.startsWith(currentOrigin)) {
                    const returnPath = new URL(referrer).pathname;
                    navigate(returnPath);
                } else {
                    navigate('/');
                }
            }
        } catch (error) {
            setError('Ошибка сети или сервер недоступен.');
        }
    };

    return {
        error,
        handleSubmit,
        goToRegister,
        handleGoBack,
        goToMain
    };
}