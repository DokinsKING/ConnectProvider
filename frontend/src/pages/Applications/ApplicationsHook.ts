import { useState, useEffect, useCallback } from "react";
import { Hook } from "../../Hook"; // Импортируем основной хук

export function ApplicationsListHook() {
    const { getAccessToken } = Hook(); // Получаем метод для работы с токеном
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Основная функция загрузки заявок
    const fetchApplications = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const token = await getAccessToken();
            if (!token) throw new Error("Требуется авторизация");

            const response = await fetch('/api/applications', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) throw new Error("Ошибка загрузки заявок");
            
            const data = await response.json();
            setApplications(data);
        } catch (error) {
            console.error("Ошибка при получении заявок:", error);
            setError(error instanceof Error ? error.message : "Неизвестная ошибка");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Загрузка данных при монтировании
    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    // Обновление статуса заявки
    const updateApplicationStatus = async (id: number, newStatus: string) => {
        try {
            const token = await getAccessToken();
            if (!token) throw new Error("Требуется авторизация");

            const response = await fetch(`/api/applications/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) throw new Error("Ошибка обновления статуса");

            setApplications(prev => prev.map(app => 
                app.id === id ? { ...app, status: newStatus } : app
            ));
            
            return true;
        } catch (error) {
            console.error("Ошибка при обновлении статуса:", error);
            setError(error instanceof Error ? error.message : "Ошибка обновления");
            return false;
        }
    };

    // Удаление заявки
    const deleteApplication = async (id: number) => {
        try {
            const token = await getAccessToken();
            if (!token) throw new Error("Требуется авторизация");

            const response = await fetch(`/api/applications/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Ошибка удаления заявки");

            setApplications(prev => prev.filter(app => app.id !== id));
            
            return true;
        } catch (error) {
            console.error("Ошибка при удалении заявки:", error);
            setError(error instanceof Error ? error.message : "Ошибка удаления");
            return false;
        }
    };

    return {
        applications,
        updateApplicationStatus,
        deleteApplication,
        refreshApplications: fetchApplications
    };
}