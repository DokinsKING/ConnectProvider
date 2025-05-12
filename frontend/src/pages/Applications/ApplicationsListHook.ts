import { useDispatch } from "react-redux"; // Импортируем хук для доступа к Redux
import { setApplicationFilter } from "../../redux/filtersSlice";

import { useState, useEffect, useCallback } from "react";
import { Hook } from "../../Hook"; // Импортируем основной хук
import axios from "axios";

export function ApplicationsListHook() {
    const { getAccessToken } = Hook(); // Получаем метод для работы с токеном
    const dispatch = useDispatch();

    const [applications, setApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statuses, setStatuses] = useState<string[]>([]); // Статусы для заявок
    const [filters, setFilters] = useState({
        start_date: '',
        end_date: '',
        status: '',
    });

    const statusMapping: { [key: string]: string } = {
      "Черновик": "draft",
      "Удалён": "deleted",
      "Сформирован": "formatted",
      "Завершён": "completed",
      "Отклонён": "rejected"
    };
    
    // Функция для обратного преобразования (английский → русский)
    const getRussianStatus = (englishStatus: string) => {
      return Object.entries(statusMapping).find(
        ([russian, english]) => english === englishStatus
      )?.[0] || englishStatus; // Если не найдено, возвращаем как есть
    };

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const response = await axios.get('/api/application-statuses');
                setStatuses(response.data);
            } catch (error) {
                console.error("Ошибка при получении статусов:", error);
            }
        };

        fetchStatuses();
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        dispatch(setApplicationFilter({
            ...filters,
            [name]: value,
        }));
        
        setFilters({ ...filters, [name]: value });
    };


    // Основная функция загрузки заявок
    const fetchApplications = useCallback(async () => {
        if(isLoading) return;
        setIsLoading(true);
        setError(null);
        
        try {
            const token = await getAccessToken();
            if (!token) throw new Error("Требуется авторизация");

            const queryParams = {
              ...filters,
              status: filters.status ? statusMapping[filters.status] || filters.status : ''
            };
            const query = new URLSearchParams(queryParams).toString();
            console.log(query);
            const response = await axios.get(`/api/applications/?${query}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const dataWithTranslatedStatuses = response.data.map((app: any) => ({
                ...app,
                status: getRussianStatus(app.status) // Преобразуем здесь
            }));
        
            setApplications(dataWithTranslatedStatuses);
        } catch (error) {
            console.error("Ошибка при получении заявок:", error);
            setError(
                axios.isAxiosError(error) 
                    ? error.response?.data?.message || error.message 
                    : "Неизвестная ошибка"
            );
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    // Загрузка данных при монтировании
    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);


    return {
        applications,
        isLoading,
        statuses,
        filters,
        error,
        statusMapping,
        getRussianStatus,
        handleFilterChange,
        refreshApplications: fetchApplications
    };
}