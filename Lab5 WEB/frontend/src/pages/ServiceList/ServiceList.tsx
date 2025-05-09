import { ServiceListHook } from './ServiceListHook';  // Импортируем хук
import styles from "./ServiceList.module.css";
import { ServiceCard } from '../ServiceCard/ServiceCard';
import { Cart } from '../../modals/Cart/Cart'; // Импортируем компонент корзины
import CartIcon from "./CartIcon.png";

export function ServiceList() {
    const { 
        services, 
        handleSearchClick, 
        addToCart, 
        toggleCartVisibility, 
        isCartVisible, 
        cartItems, 
        setCartItems  // Получаем setCartItems из хука
    } = ServiceListHook();  // Получаем все функции из ServiceListHook

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
                />
            )}
        </div>
    );
}
