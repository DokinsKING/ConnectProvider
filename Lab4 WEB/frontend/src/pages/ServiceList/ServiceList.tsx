import { useState, useEffect } from 'react';
import styles from "./ServiceList.module.css";
import { ServiceCard } from '../ServiceCard/ServiceCard';
import { Cart } from '../../modals/Cart/Cart'; // Импортируем компонент корзины
import CartIcon from "./CartIcon.png";

export function ServiceList({ navigate, services, handleSearchClick, createApplication } : { navigate : any, services : any[], handleSearchClick : any, createApplication : any }) {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [isCartVisible, setIsCartVisible] = useState(false); // Состояние для видимости корзины

    // Загружаем корзину из localStorage, если она есть
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart)); // Загружаем сохраненную корзину
        }
    }, []);

    // Функция для добавления товара в корзину
    const addToCart = (id : number, name : string, description : string, image : string) => {
        // Проверяем, есть ли уже товар с таким id в корзине
        const isItemInCart = cartItems.some(item => item.id === id);

        if (!isItemInCart) {
            // Добавляем товар в корзину, если его там нет
            const newItem = { id, name, description, image };
            setCartItems((prevItems) => {
                const updatedItems = [...prevItems, newItem];
                // Сохраняем корзину в localStorage
                localStorage.setItem('cart', JSON.stringify(updatedItems));
                return updatedItems;
            });
        }
    };

    // Функция для отображения корзины
    const toggleCartVisibility = () => {
        setIsCartVisible(!isCartVisible); // Переключаем видимость корзины
    };

    // useEffect для скрытия корзины, когда она пуста
    useEffect(() => {
        if (cartItems.length === 0) {
            setIsCartVisible(false); // Скрыть корзину, если она пуста
        }
        // Сохраняем корзину в localStorage
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Услуги</h2>

            <form className={styles.search_field} onSubmit={handleSearchClick}>
              <input
                type="text"
                name="q"
                aria-label="Поиск"
                placeholder="Поиск по услугам..."
              />
              <button type="submit">Поиск</button>
            </form>
            
            {services.length > 0 ? (
                services.map(service => (
                    <ServiceCard
                        key={service.id}
                        id={service.id}
                        name={service.name}
                        description={service.description}
                        image={service.image}
                        navigate={navigate}
                        addToCart={addToCart} // Передаем функцию добавления в корзину
                    />
                ))
            ) : (
                <p className={styles.title}>Сервисы не найдены.</p>
            )}

            {/* Иконка корзины отображается, если в корзине есть товары */}
            {cartItems.length !== 0 && (
                <img 
                    className={styles.cart} 
                    onClick={toggleCartVisibility} 
                    src={CartIcon} 
                    alt="Корзина" 
                    title="Документы в корзине" 
                />
            )}

            {/* Если корзина видимая, показываем содержимое корзины */}
            {isCartVisible && cartItems.length !== 0 && (
                <Cart
                    cartItems={cartItems}
                    setCartItems={setCartItems} // Передаем возможность изменения корзины
                    createApplication={createApplication}
                />
            )}
        </div>
    );
}
