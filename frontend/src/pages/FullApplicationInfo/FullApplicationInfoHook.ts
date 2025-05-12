import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Hook } from './../../Hook';
import { ApplicationsListHook } from '../Applications/ApplicationsListHook';
import axios from "axios";

export function FullApplicationInfoHook() {
    const { id } = useParams();
    const { getAccessToken } = Hook()
    const { applications, statusMapping, getRussianStatus } = ApplicationsListHook();


    const [creatorName, setCreatorName] = useState<string | null>(null); // Состояние для имени автора
    const [moderatorName, setModeratorName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [application, setApplication] = useState<any>({});
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
        if (applications && id) {
            const foundApp = applications.find((app: any) => String(app.id) === String(id));
            if (foundApp) {
                setApplication(foundApp);
                setEditedApplication({
                  status: foundApp.status,
                  form_date: foundApp.form_date,
                  completion_date: foundApp.completion_date,
                });
            }
        }
    }, [applications, id]);

    useEffect(() => {
    const checkAdminStatus = async () => {
        try {
            // Получаем токен из localStorage/sessionStorage
            const token = await getAccessToken();
            
            if (!token) {
                setIsAdmin(false);
                return;
            }

            const response = await axios.get('/api/check-admin/', {
                headers: {
                    'Authorization': `Bearer ${token}`  // Добавляем токен в заголовки
                }
            });
            
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
      const token = await getAccessToken();
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
      const response = await axios.put(
        `/api/applications/${application.id}/`,
        editedApplication,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

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
      if(isLoading) return;
      // Если заявка существует и у неё есть creator, запрашиваем имя
      if (application && application.creator) {
        setIsLoading(true);
        axios.get(`/api/users/${application.creator}`)
          .then((response) => {
            setCreatorName(response.data.username); // Предполагается, что API возвращает объект с полем 'username'
          })
          .catch((error) => {
            console.error("Ошибка при получении имени автора:", error);
            setCreatorName("Не удалось загрузить имя"); // Если произошла ошибка
          })
          .finally(() => setIsLoading(false));
      }
      if (application && application.moderator) {
        setIsLoading(true);
        axios.get(`/api/users/${application.moderator}`)
          .then((response) => {
            setModeratorName(response.data.username); // Предполагается, что API возвращает объект с полем 'username'
          })
          .catch((error) => {
            console.error("Ошибка при получении имени автора:", error);
            setCreatorName("Не удалось загрузить имя"); // Если произошла ошибка
          })
          .finally(() => setIsLoading(false));
      }
    }, [application]); // Хук будет срабатывать при изменении application   


    return {
      creatorName,
      moderatorName,
      isAdmin,
      isEditing,
      editedApplication,
      application,
      statusMapping,
      getRussianStatus,
      handleSave,
      setIsEditing,
      handleInputChange
    };
}
