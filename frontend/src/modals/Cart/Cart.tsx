import styles from './Cart.module.css'; // Путь к стилям корзины
import { CartHook } from './CartHook';  // Импортируем хук для корзины

export function Cart({ cartItems, setCartItems}: { cartItems: any[], setCartItems: any}) {
    const { removeFromCart, confirmApplication } = CartHook(cartItems, setCartItems);  // Используем хук
    return (
        <div className={styles.cartContainer}>
            <h3 className={styles.title}>Корзина</h3>
            {cartItems.length > 0 ? (
                <div>
                    <ul className={styles.cartList}>
                        {cartItems.map((item, index) => (
                            <li key={index} className={styles.card}>
                                <h2 className={styles.cardTitle}>{item.name}</h2>
                                <img className={styles.image} src={item.image} alt={item.name} />
                                <p className={styles.description}>{item.description}</p>
                                <div className={styles.buttons}>
                                    <button onClick={() => removeFromCart(index)} className={styles.removeButton}>
                                        Удалить из корзины
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button className={styles.confirmButton} onClick={confirmApplication}>
                        Подтвердить добавление в заявки
                    </button>
                </div>
            ) : (
                <p>Корзина пуста.</p>
            )}
        </div>
    );
}
