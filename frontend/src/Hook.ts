import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

export function Hook() {
    const navigate = useNavigate();
    const location = useLocation();
    const [services, setServices] = useState<any[]>([]); // any[]
    const [applications, setApplications] = useState<any[]>([]); // any[]
    const [searchQuery, setSearchQuery] = useState("");
    const [type, setType] = useState("");

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
                navigate("/login");
                return null;
            }
        } catch (error) {
            console.error("Ошибка при обновлении токена", error);
            return null;
        }
    };

    // Функция для логина
    const login = async (username: string, password: string) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (response.ok) {
                const { access, refresh } = data;
                localStorage.setItem('access_token', access);  // Сохраняем токен
                localStorage.setItem('refresh_token', refresh);  // Сохраняем refresh токен
                return true;  // Успешная авторизация
            } else {
                throw new Error('Ошибка авторизации');
            }
        } catch (error) {
            console.error("Ошибка при авторизации", error);
            return false;  // Неудачная авторизация
        }
    };

    // Функция для регистрации
    const register = async (username: string, email: string, password: string) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/register/', { // Убедитесь, что у вас есть эндпоинт для регистрации
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

    // Функция для выполнения запроса с авторизацией и автоматическим обновлением токена
    const fetchData = useCallback(async (url: string) => {
        let token = await getAccessToken();  // Получаем актуальный токен

        if (!token) return;  // Если токен не получен, выходим

        console.log(token);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Network error");
            const data = await response.json();

            if (url.includes("services")) {
                setServices(data);
            } else if (url.includes("applications")) {
                setApplications(data);
            }
        } catch (error) {
            console.error("Ошибка при получении данных:", error);
        }
    }, []);

    useEffect(() => {
        const newType = location.pathname.split('/')[1] + "/";
        setType(newType);

        if (!getAccessToken() && newType !== "register/") {
            navigate("/login");
        }
    }, [location]);

    useEffect(() => {
        if (type === "services/" || type === "applications/") {
            fetchData(`http://127.0.0.1:8000/api/${type}`);
        }
    }, [type, fetchData]);

    const handleSearchClick = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const searchText = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
        setSearchQuery(searchText);
    };

    const createApplication = async (cartItems: { id: number }[]) => {
        try {
            let token = await getAccessToken();  // Получаем актуальный токен

            if (!token) {
                throw new Error("Token is null after refresh");
            }

            // Декодируем JWT токен чтобы получить user_id
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.user_id;

            console.log(token);

            // Создание заявки
            const response = await fetch(`http://127.0.0.1:8000/api/applications/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    status: 'draft',
                    created_at: new Date().toISOString(),
                    creator: userId,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error("Failed to create application");

            // Привязка услуг к заявке
            await Promise.all(
                cartItems.map(item =>
                    fetch(`http://127.0.0.1:8000/api/application-services/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            application: data.id,
                            service: item.id,
                        }),
                    })
                )
            );

            return data;
        } catch (error) {
            console.error('Ошибка:', error);
            return null;
        }
    };

    return {
        navigate,
        location,
        services,
        applications,
        searchQuery,
        handleSearchClick,
        createApplication,
        login,
        register,  // Добавляем функцию регистрации в возвращаемые данные
    };
}
