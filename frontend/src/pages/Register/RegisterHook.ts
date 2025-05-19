import { useState } from 'react';

import { useDispatch } from 'react-redux';
import { login_slice } from './../../redux/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';


import axiosClient from "./../../Clients"
import { isAxiosError } from 'axios'; // Импортируем axios и тип AxiosError

export function RegisterHook() {
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();


    const goToLogin = () => navigate('/login');

    const handleGoBack = () => {
        const previousPath = location.state?.from || '/';  // Если нет состояния, то перенаправляем на главную
        navigate(previousPath);
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            const response = await axiosClient.post('/api/register/', {
                username,
                email,
                password
            });


            console.log("awapa: ",response);
            
            return response;
        } catch (error) {
            if (isAxiosError(error))
            {
                if (
                error.response?.data &&
                typeof error.response.data === 'object' &&
                'username' in error.response.data &&
                Array.isArray(error.response.data.username) &&
                error.response.data.username.length > 0
                )
                {setError(error.response.data.username[0]);}
            }
            
            console.error("Ошибка при регистрации", error);
            return false;
        }
    };

    const handleSubmit = async (username: string, email: string, password: string) => {
        const isRegistered = await register(username, email, password);
        console.log(isRegistered);
        if (isRegistered) {
            localStorage.setItem('access_token', isRegistered.data.access);
            localStorage.setItem('refresh_token', isRegistered.data.refresh);
            dispatch(login_slice({ username: username }));
            navigate('/');
        }
    };

    return {
        error,
        handleSubmit,
        goToLogin,
        handleGoBack
    };
}