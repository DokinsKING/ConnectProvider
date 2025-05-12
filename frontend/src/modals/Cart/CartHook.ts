import { useEffect } from 'react';
import { Hook } from './../../Hook';
import axios from 'axios';

export function CartHook(cartItems: any[], setCartItems: any) {
    const { getAccessToken, navigate } = Hook();

    // Загрузка корзины из localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, [setCartItems]);

    // Удаление товара из корзины
    const removeFromCart = (index: number) => {
        const updatedCart = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    // Подтверждение заявки
    const confirmApplication = async () => {
        try {
            const token = await getAccessToken();
            if (!token) {
                navigate("/login");
                return;
            }

            const data = await createApplication(cartItems);
            
            if (data) {
                setCartItems([]);
                localStorage.removeItem('cart');
            }
        } catch (error) {
            console.error("Ошибка при подтверждении заявки:", error);
        }
    };

    // Создание заявки и привязка услуг
    const createApplication = async (cartItems: { id: number }[]) => {
        try {
            const token = await getAccessToken();
            if (!token) {
                throw new Error("Token is null after refresh");
            }

            // Декодируем JWT токен
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.user_id;

            // Создаем заявку
            const applicationResponse = await axios.post(
                '/api/applications/',
                {
                    status: 'draft',
                    created_at: new Date().toISOString(),
                    creator: userId,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );

            // Привязываем услуги к заявке
            await Promise.all(
                cartItems.map(item =>
                    axios.post(
                        '/api/application-services/',
                        {
                            application: applicationResponse.data.id,
                            service: item.id,
                        },
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            }
                        }
                    )
                )
            );

            return applicationResponse.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Ошибка сервера:', error.response?.data);
            } else {
                console.error('Ошибка:', error);
            }
            return null;
        }
    };

    return {
        removeFromCart,
        confirmApplication
    };
}