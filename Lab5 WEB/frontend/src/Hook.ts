import { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

export function Hook() {
    const usenavigate = useNavigate();
    const location = useLocation();
    const [type, setType] = useState("begin");

    const navigate = (pathname : string) => {
        if(pathname === "-1") {
            usenavigate(-1);
            return;
        }
        const newType = pathname.split('/')[1];
        
        if(newType != type)
        {
            getAccessToken().then(token => {
            if (token || !newType || newType === "" || newType  === "register"|| newType === "services") {
                usenavigate(pathname);
                setType(newType);
            }
            else
            {
                usenavigate("/login");
                setType("login");
            }
        });
        }
    };

    const getAccessToken = async () => {
        let token = localStorage.getItem('access_token');
        if (token && isTokenExpired(token)) {
            token = await refreshAccessToken();  // Если токен истек, обновляем его
        }
        return token;
    };

    const isTokenExpired = (token: string) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiry = payload.exp * 1000; // Expiry time in ms
            return Date.now() > expiry;
        } catch (e) {
            return true;  // Если не удалось декодировать, токен истек
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
                return data.access;
            } else {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
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
    };
}
