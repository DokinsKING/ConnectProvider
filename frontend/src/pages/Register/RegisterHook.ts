import { useState } from 'react';

import { useDispatch } from 'react-redux';
import { login_slice } from './../../redux/userSlice';

import { Hook } from './../../Hook';
import axios from 'axios';

export function RegisterHook() {
    const { navigate } = Hook();
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();


    const goToLogin = () => navigate('/login');

    const handleGoBack = () => {
        navigate("-1");
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            const response = await axios.post('/api/register/', {
                username,
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            return response;
        } catch (error) {
            console.error("Ошибка при регистрации", error);
            return false;
        }
    };

    const handleSubmit = async (username: string, email: string, password: string) => {
        try {
            const isRegistered = await register(username, email, password);
            if (isRegistered) {
                localStorage.setItem('access_token', isRegistered.data.access);
                localStorage.setItem('refresh_token', isRegistered.data.refresh);
                dispatch(login_slice({ username: username }));
                navigate('/');
            } else {
                setError('Ошибка регистрации. Проверьте данные.');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'Ошибка регистрации');
            } else {
                setError('Ошибка сети или сервер недоступен.');
            }
        }
    };

    return {
        error,
        handleSubmit,
        goToLogin,
        handleGoBack
    };
}