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
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    const response = await axios.post('/api/token/refresh/', {
      refresh: refreshToken,
    });
    const newAccessToken = response.data.access;
    localStorage.setItem('access_token', newAccessToken);

    return newAccessToken;
  } catch (error: any) {
    // Если ошибка 401 (неавторизованный), удаляем токены из localStorage
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }

    
    console.error('Failed to refresh access token:', error);
    throw error;
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
