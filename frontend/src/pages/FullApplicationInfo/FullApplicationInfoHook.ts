import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { statusTranslate } from "../../assets/utils/statusTranslate";
import axiosClient from "./../../Clients"


export function FullApplicationInfoHook() {
    const { id } = useParams();


    const { statusMapping, getStatus } = statusTranslate();
    const [creatorName, setCreatorName] = useState<string | null>(null); // Состояние для имени автора
    const [moderatorName, setModeratorName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [application, setApplication] = useState<any>({});
    const [applicationServices, setApplicationServices] = useState<any[]>([]);
    const [editedApplication, setEditedApplication] = useState<{
      status: string;
      form_date: string;
      completion_date: string;
    }>({
      status: application.status,
      form_date: application.form_date,
      completion_date: application.completion_date,
    });

    useEffect(() => {
      const fetchApp = async () => {
        try {
          // setLoading(true);
          const response = await axiosClient.get(`/api/applications/${id}/`);
          
          // Используем функцию getStatus для преобразования статуса
          const englishStatus = getStatus(response.data.status);

          setApplication(response.data);
          setEditedApplication({
            ...response.data,
            status: englishStatus, // Устанавливаем статус в английской версии
          });
          
          // setError(null);
        } catch (e) {
          // setError(isAxiosError(e) ? e.message : 'Ошибка запроса');
        } finally {
          // setLoading(false);
        }
      };

      if (id) {
        fetchApp(); // Загружаем данные только если есть id
      }
    }, [id]);



    useEffect(() => {
      const fetchApplicationServices = async () => {
        if (application.id && application.application_services?.length > 0) {
          try {
            // Извлекаем все ID услуг из application_services
            const serviceIds = application.application_services.map((service: any) => service.service);
            // Выполняем запросы для всех ID услуг
            const serviceRequests = serviceIds.map((serviceId: number) =>
              axiosClient.get(`/api/services/${serviceId}/`)
            );
            // Ожидаем выполнения всех запросов
            const responses = await Promise.all(serviceRequests);
            // Собираем все данные о сервисах в массив
            const servicesData = responses.map((response: any) => response.data);
            setApplicationServices(servicesData); // Присваиваем данные о услугах в состояние
          } catch (error) {
            console.error("Ошибка при загрузке услуг:", error);
          }
        }
      };

      fetchApplicationServices();
    }, [application]);

    useEffect(() => {
    const checkAdminStatus = async () => {
        try {

            const response = await axiosClient.get('/api/check-admin/');
            
            setIsAdmin(response.data.is_admin);
        } catch (error) {
            console.error("Ошибка при проверке прав администратора:", error);
            setIsAdmin(false);
        }
    };
    
    checkAdminStatus();
}, []);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedApplication(prev => ({
        ...prev,
        [name]: value
    }));
    setApplication((prev: any) => ({
            ...prev,
            [name]: value
        }));
    };
    
    
    const handleSave = async () => {
      try {
        // Получаем токен и проверяем его
        const token = await localStorage.getItem('access_token');
        if (!token) {
          throw new Error("Access token is missing");
        }

        // Декодируем токен, чтобы получить user_id
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.user_id;
        if (!userId) {
          throw new Error("User ID not found in token");
        }

        // Преобразуем даты в ISO-формат прямо в editedApplication
        if (editedApplication.form_date) {
          editedApplication.form_date = new Date(editedApplication.form_date).toISOString();
        }
        if (editedApplication.completion_date) {
          editedApplication.completion_date = new Date(editedApplication.completion_date).toISOString();
        }

        // Отправляем PUT-запрос
        const response = await axiosClient.put(
          `/api/applications/${application.id}/`,
          editedApplication);

        // Обновляем локальное состояние
        setApplication(response.data);
        setIsEditing(false);
      } catch (error) {
        console.error('Error while saving:', error);
        // Показываем ошибку пользователю (например, через useState)
        // setError(error.message);
      }
    };
    
    useEffect(() => {
      if (isLoading) return;

      const fetchData = async () => {
        if (!application) return; // Если application отсутствует, прерываем выполнение функции.

        setIsLoading(true); // Включаем состояние загрузки один раз для обоих запросов.

        const fetchUser = async (userId: string, type: 'creator' | 'moderator') => {
          try {
            const response = await axiosClient.get(`/api/users/${userId}`);
            if (type === 'creator') {
              setCreatorName(response.data.username);
            } else if (type === 'moderator') {
              setModeratorName(response.data.username);
            }
          } catch (error) {
            console.error(`Ошибка при получении имени ${type}:`, error);
            if (type === 'creator') {
              setCreatorName("Не удалось загрузить имя");
            } else if (type === 'moderator') {
              setModeratorName("Не удалось загрузить имя");
            }
          }
        };

        try {
          // Создаём массив промисов для параллельных запросов
          const promises = [];
          
          if (application.creator) {
            promises.push(fetchUser(application.creator, 'creator'));
          }

          if (application.moderator) {
            promises.push(fetchUser(application.moderator, 'moderator'));
          }

          // Ожидаем выполнения всех запросов
          await Promise.all(promises);
        } catch (err) {
          console.error("Ошибка при получении токена или данных:", err);
        } finally {
          setIsLoading(false); // Останавливаем загрузку, когда все запросы завершены
        }
      };


      fetchData();
    }, [application]);


    return {
      creatorName,
      moderatorName,
      isAdmin,
      isEditing,
      editedApplication,
      applicationServices,
      application,
      statusMapping,
      getStatus,
      handleSave,
      setIsEditing,
      handleInputChange
    };
}
