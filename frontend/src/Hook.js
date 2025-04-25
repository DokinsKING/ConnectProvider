import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

export function Hook() {
  const navigate = useNavigate();
  const location = useLocation(); // Для отслеживания изменений маршрута
  const [services, setServices] = useState([]); // Состояние для хранения списка сервисов
  const [applications, setApplications] = useState([]); // Состояние для хранения списка заявок
  const [searchQuery, setSearchQuery] = useState("");
  const [type, setType] = useState(""); // Состояние для типа запроса (сервисы или заявки)

  // Функция для выполнения запроса с фильтрацией по имени (по умолчанию для сервисов)
  const fetchData = async () => {
    let url = `http://127.0.0.1:8000/api/${type}`;

    if (searchQuery !== "") {
      url += `?name=${searchQuery}`; // Добавляем поисковый запрос, если он есть
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
  };

  // Сбросить поисковый запрос при переходе на другую страницу
  useEffect(() => {
    const newType = location.pathname.split('/')[1] + "/";
    if (newType !== "services/") {
      setSearchQuery(""); // Загружаем сервисы, если маршрут /services
    }

    if (newType !== type) {
      if (newType === "services/" || newType === "applications/") {
        setType(newType);
        }
    }
  }, [location]); // Следим за изменением маршрута

  // Загружаем данные при изменении типа или поискового запроса
  useEffect(() => {
    console.log("Эффект изза тайпа")
    fetchData(); 

  }, [type]);

  useEffect(() => {
    if(searchQuery !== "")
    {
      console.log("Эффект изза кваери")
      fetchData();
    }
  }, [searchQuery]);

  // Обработчик изменения поискового запроса
  const handleSearchClick = (e) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы (перезагрузку страницы)
    const searchText = e.target.elements.q.value; // Получаем значение поля ввода (name="q")
    console.log(searchText);
    setSearchQuery(searchText); // Обновляем поисковый запрос
  };

  const createApplication = async (cartItems) => {
    try {
      // 1. Создаем заявку
      const response = await fetch(`http://127.0.0.1:8000/api/applications/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'draft', // Статус заявки "Черновик"
          created_at: new Date().toISOString(),
          creator: 1
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Заявка успешно создана', data);
        const applicationId = data.id; // Получаем ID созданной заявки
  
        // 2. После создания заявки, для каждой услуги отправляем отдельный запрос в application-services
        for (let item of cartItems) {
          const serviceResponse = await fetch(`http://127.0.0.1:8000/api/application-services/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              application: applicationId,  // ID созданной заявки
              service: item.id,  // ID услуги из корзины
            }),
          });
  
          const serviceData = await serviceResponse.json();
  
          if (serviceResponse.ok) {
            console.log('Запись в application-services успешно создана', serviceData);
          } else {
            console.error('Ошибка при создании записи в application-services', serviceData);
          }
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
