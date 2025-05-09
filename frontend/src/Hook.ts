import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export function Hook() {
    const usenavigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Проверка авторизации при загрузке и изменении токена
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setIsLoggedIn(!!token);
    }, [location.pathname]); // Добавляем зависимость от пути

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
        // Проверяем валидность текущего токена
        const token = await getAccessToken();
        
        // Если токен есть (пользователь авторизован)
        if (token) {
            const refreshToken = localStorage.getItem('refresh_token');
            
            // Отправляем запрос на сервер для аннулирования токенов
            await fetch('/api/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ refresh_token: refreshToken })
            });
        }
        
        // В любом случае очищаем хранилище
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsLoggedIn(false);
        usenavigate('/login');
        
    } catch (error) {
        console.error('Logout failed:', error);
        // Даже если произошла ошибка, выполняем очистку
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
            const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: refreshToken })
            });

            const data = await response.json();
            if (response.ok && data.access) {
                localStorage.setItem('access_token', data.access);
                setIsLoggedIn(true);
                return data.access;
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