import { useEffect } from 'react';
import { isAxiosError } from 'axios'; // Импортируем axios и тип AxiosError
import axiosClient from "./../../Clients"

export function CartHook(cartItems: any[], setCartItems: any) {
    // Загрузка корзины из localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, [setCartItems]);

    // Удаление товара из корзины
        const removeAllCart = () => {
            setCartItems([]);
            localStorage.removeItem('cart');
        };

    // Удаление товара из корзины
    const removeFromCart = (index: number) => {
        const updatedCart = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    // Подтверждение заявки
    const confirmApplication = async () => {
        try {
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
            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error("Token is null after refresh");
            }

            // Декодируем JWT токен
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.user_id;

            // Создаем заявку
            const applicationResponse = await axiosClient.post(
                '/api/applications/',
                {
                    status: 'draft',
                    created_at: new Date().toISOString(),
                    creator: userId,
                }
            );

            // Привязываем услуги к заявке
            await Promise.all(
                cartItems.map(item =>
                    axiosClient.post(
                        '/api/application-services/',
                        {
                            application: applicationResponse.data.id,
                            service: item.id,
                        }
                    )
                )
            );

            return applicationResponse.data;
        } catch (error) {
            if (isAxiosError(error)) {
                console.error('Ошибка сервера:', error.response?.data);
            } else {
                console.error('Ошибка:', error);
            }
            return null;
        }
    };

    return {
        removeFromCart,
        confirmApplication,
        removeAllCart
    };
}