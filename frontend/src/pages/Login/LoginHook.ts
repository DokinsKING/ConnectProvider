import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login_slice } from './../../redux/userSlice';


import axiosClient from "./../../Clients"

import { isAxiosError } from 'axios'; // Импортируем axios и тип AxiosError

export function LoginHook() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [error, setError] = useState<string | null>(null);

    const goToRegister = () => navigate('/register');
    const handleGoBack = () => navigate(-1);

    const login = async (username: string, password: string) => {
        try {
            const response = await axiosClient.post('/api/token/', {
                username,
                password
            });

            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            return true;
        } catch (error) {
            if (isAxiosError(error)) {
                const errorMessage = error.response?.data?.detail || 'Ошибка авторизации';
                setError(errorMessage);
                console.error("Ошибка при авторизации", errorMessage);
            } else {
                setError('Неизвестная ошибка');
                console.error("Неизвестная ошибка при авторизации", error);
            }
            return false;
        }
    };

    const handleSubmit = async (username: string, password: string) => {
        try {
            const success = await login(username, password);
            if (success) {
                dispatch(login_slice({ username: username }));
                const whereWant = localStorage.getItem('where_want');
                if (whereWant) {
                    navigate(whereWant);
                } else {
                    navigate('/'); // Переход на главную страницу или любой другой дефолтный путь
                }
            }
        } catch (error) {
            setError('Ошибка сети или сервер недоступен.');
            console.error("Сетевая ошибка", error);
        }
    };

    return {
        error,
        handleSubmit,
        goToRegister,
        handleGoBack,
    };
}