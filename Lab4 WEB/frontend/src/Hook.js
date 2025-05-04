import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

export function Hook() {
    const navigate = useNavigate();
    const location = useLocation();
    const [services, setServices] = useState([]);
    const [applications, setApplications] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [type, setType] = useState("");

    // Мемоизированная функция fetchData
    const fetchData = useCallback(async () => {
        if (!type) return; // Не выполняем запрос, если тип не установлен

        let url = `http://127.0.0.1:8000/api/${type}`;
        if (searchQuery !== "") {
            url += `?name=${searchQuery}`;
        }

        console.log(url);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();

            if (type === "services/") {
                setServices(data);
            } else if (type === "applications/") {
                setApplications(data);
            }
        } catch (error) {
            console.error("Ошибка при получении данных:", error);
        }
    }, [type, searchQuery]); // Зависимости

    // Обработка изменения маршрута
    useEffect(() => {
        const newType = location.pathname.split('/')[1] + "/";
        
        if (newType !== "services/") {
            setSearchQuery("");
        }

        if (newType !== type && (newType === "services/" || newType === "applications/")) {
            setType(newType);
        }
    }, [location]);

    // Единый эффект для загрузки данных
    useEffect(() => {
        fetchData();
    }, [fetchData]); // Срабатывает только при изменении fetchData

    const handleSearchClick = (e) => {
        e.preventDefault();
        const searchText = e.target.elements.q.value;
        setSearchQuery(searchText);
    };

    const createApplication = async (cartItems) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/applications/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'draft',
                    created_at: new Date().toISOString(),
                    creator: 1
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const applicationId = data.id;
                
                for (let item of cartItems) {
                    await fetch(`http://127.0.0.1:8000/api/application-services/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            application: applicationId,
                            service: item.id,
                        }),
                    });
                }

                return data;
            } else {
                console.error('Ошибка при создании заявки', data);
                return null;
            }
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
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
    };
}