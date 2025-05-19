import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { login_slice } from '../../redux/userSlice';

import axiosClient from "../../Clients"

export function NavbarHook() {
    const dispatch = useDispatch();
    const location = useLocation();
    const usenavigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Проверка авторизации при загрузке и изменении токена
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setIsLoggedIn(!!token);
    }, [location]);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('access_token');
            
            if (token) {
                const refreshToken = localStorage.getItem('refresh_token');
                
                await axiosClient.post('/api/logout/', {
                    refresh_token: refreshToken
                });
            }
            
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            dispatch(login_slice({ username: "" }));
            setIsLoggedIn(false);
            usenavigate('/login');
            
        } catch (error) {
            console.error('Logout failed:', error);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setIsLoggedIn(false);
            usenavigate('/login');
        }
    };


    return {
        isLoggedIn,
        handleLogout
    };
}