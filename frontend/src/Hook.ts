import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { login_slice } from './redux/userSlice';

import axios from 'axios';

export function Hook() {
    const dispatch = useDispatch();

    const usenavigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Проверка авторизации при загрузке и изменении токена
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setIsLoggedIn(!!token);
    }, [location]);

    const navigate = (pathname: string) => {
        if (pathname === "-1") {
            usenavigate(-1);
            return;
        }

        getAccessToken().then(token => {
            if (token || pathname === "/" || pathname === "/register" || pathname.startsWith("/services")) {
                usenavigate(pathname);
            } else {
                usenavigate("/login");
            }
        });
    };

    const handleLogout = async () => {
        try {
            const token = await getAccessToken();
            
            if (token) {
                const refreshToken = localStorage.getItem('refresh_token');
                
                await axios.post('/api/logout/', {
                    refresh_token: refreshToken
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
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

    const getAccessToken = async () => {
        let token = localStorage.getItem('access_token');
        if (token && isTokenExpired(token)) {
            token = await refreshAccessToken();
        }
        return token;
    };

    const isTokenExpired = (token: string) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiry = payload.exp * 1000;
            return Date.now() > expiry;
        } catch (e) {
            return true;
        }
    };

    const refreshAccessToken = async () => {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) return null;

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
                refresh: refreshToken
            });

            if (response.data.access) {
                localStorage.setItem('access_token', response.data.access);
                setIsLoggedIn(true);
                return response.data.access;
            } else {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                setIsLoggedIn(false);
                return null;
            }
        } catch (error) {
            console.error("Ошибка при обновлении токена", error);
            return null;
        }
    };

    return {
        getAccessToken,
        navigate,
        location,
        isLoggedIn,
        handleLogout
    };
}