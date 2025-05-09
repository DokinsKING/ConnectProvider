import { useEffect } from 'react';
import { Hook } from './../../Hook';  // Импортируем основной хук

export function CartHook(cartItems: any[], setCartItems: any) {

    const { getAccessToken, navigate} = Hook(); 
    // Загрузка корзины из localStorage при монтировании компонента
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart)); // Загружаем сохраненную корзину из localStorage
        }
    }, [setCartItems]);

    // Функция для удаления товара из корзины
    const removeFromCart = (index: number) => {
        const updatedCart = cartItems.filter((_, i) => i !== index); // Удаляем товар по индексу
        setCartItems(updatedCart); // Обновляем корзину
        // Сохраняем обновленную корзину в localStorage
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    // Функция для подтверждения создания заявки
    const confirmApplication = async () => {
        try {
            const token = await getAccessToken(); // Ждём получение токена
            if (!token) {
                navigate("/login"); // Если токена нет, перенаправляем на логин
                return;
            }
    
            // Если токен есть, создаём заявку
            const data = await createApplication(cartItems);
            
            if (data) {
                setCartItems([]); // Очищаем корзину в состоянии
                localStorage.removeItem('cart'); // И в localStorage
            }
        } catch (error) {
            console.error("Ошибка при подтверждении заявки:", error);
            // Можно добавить обработку ошибки (например, показать уведомление)
        }
    };

    const createApplication = async (cartItems: { id: number }[]) => {
        try {
            let token = await getAccessToken();  // Получаем актуальный токен

            if (!token) {
                throw new Error("Token is null after refresh");
            }

            // Декодируем JWT токен чтобы получить user_id
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.user_id;

            // Создание заявки
            const response = await fetch(`/api/applications/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    status: 'draft',
                    created_at: new Date().toISOString(),
                    creator: userId,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error("Failed to create application");

            // Привязка услуг к заявке
            await Promise.all(
                cartItems.map(item =>
                    fetch(`http://127.0.0.1:8000/api/application-services/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            application: data.id,
                            service: item.id,
                        }),
                    })
                )
            );

            return data;
        } catch (error) {
            console.error('Ошибка:', error);
            return null;
        }
    };

    return {
        removeFromCart,
        confirmApplication
    };
}
