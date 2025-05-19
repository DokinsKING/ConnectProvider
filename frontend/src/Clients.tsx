import axios from 'axios';  // Импортируем axios

let isRefreshing = false;  // Флаг, указывающий, что токен обновляется

// Функция для проверки истечения срока действия токена
const isTokenExpired = (token: string) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp * 1000;
        return Date.now() > expiry;
    } catch (e) {
        return true;
    }
};

// Функция для получения нового токена (если токен истек)
const refreshAccessToken = async () => {
    try {
        // Выполняем запрос на обновление токена через axiosClient
        const response = await axios.post('/api/refresh-token', { /* данные для обновления токена */ });
        const newToken = response.data.access_token;  // Предположим, что сервер возвращает новый токен
        localStorage.setItem('access_token', newToken);
        
        return newToken;
    } catch (error) {
        console.error('Failed to refresh access token:', error);
        throw error;  // Если обновление токена не удалось, выбрасываем ошибку
    }
};

// Создаем клиент axios с нужными заголовками
const axiosClient = axios.create({
  headers: {
    'Content-Type': 'application/json',  // Тип контента по умолчанию
  },
});

// Добавляем перехватчик запросов, чтобы проверять и обновлять токен перед каждым запросом
axiosClient.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('access_token');  // Берем токен из localStorage

    if (token && isTokenExpired(token)) {
      if (!isRefreshing) {
        // Если токен истек и мы еще не обновляем его, запускаем процесс обновления
        isRefreshing = true;
        token = await refreshAccessToken();  // Обновляем токен
        isRefreshing = false;  // Сбрасываем флаг после обновления
      } else {
        // Если токен уже обновляется, просто ждем, пока он будет обновлен
        token = await refreshAccessToken();
      }
    }

    if (token) {
      // Добавляем токен в заголовок Authorization
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;  // Возвращаем измененный конфиг
  },
  (error) => {
    return Promise.reject(error);  // Обработка ошибок
  }
);

export default axiosClient;  // Экспортируем клиента для использования в других файлах
