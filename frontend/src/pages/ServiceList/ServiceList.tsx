import { useState, useEffect } from 'react';
import styles from "./ServiceList.module.css";
import { ServiceCard } from '../ServiceCard/ServiceCard';
import { Cart } from '../../modals/Cart/Cart'; // Импортируем компонент корзины
import CartIcon from "./CartIcon.png";

export function ServiceList({ navigate, services, handleSearchClick, createApplication } : { navigate : any, services : any[], handleSearchClick : any, createApplication : any }) {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [isCartVisible, setIsCartVisible] = useState(false); // Состояние для видимости корзины
    const [isCartLoaded, setIsCartLoaded] = useState(false); // Флаг для загрузки корзины

    // Загружаем корзину из localStorage, если она есть
    useEffect(() => {
        if (!isCartLoaded) {
            const savedCart = localStorage.getItem('cart');
            console.log("Карт в начале")
            console.log(savedCart)
            if (savedCart) {
                setCartItems(JSON.parse(savedCart)); // Загружаем сохраненную корзину из localStorage
            }
            setIsCartLoaded(true); // Устанавливаем флаг, чтобы больше не загружать корзину
        }
    }); // Этот useEffect сработает только один раз, когда isCartLoaded = false

    // Функция для добавления товара в корзину
    const addToCart = (id : number, name : string, description : string, image : string) => {
        const isItemInCart = cartItems.some(item => item.id === id);  // Проверка на наличие товара в корзине

        if (!isItemInCart) {
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
        console.log("Сохраняю catitems")
        console.log(cartItems)
        // Сохраняем корзину в localStorage
        if(isCartLoaded) localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]); // Перезаписываем localStorage при изменении корзины


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
