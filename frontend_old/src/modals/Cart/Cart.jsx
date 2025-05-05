import styles from './Cart.module.css'; // Путь к стилям корзины

export function Cart({ cartItems, setCartItems, createApplication }) {
    // Функция для удаления товара из корзины
    const removeFromCart = (index) => {
        const updatedCart = cartItems.filter((_, i) => i !== index); // Удаляем товар по индексу
        setCartItems(updatedCart); // Обновляем корзину
        // Сохраняем обновленную корзину в localStorage
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const confirmApplication = async () => {
        const data = await createApplication(cartItems); // Вызываем функцию из хука
        if (data) {
            setCartItems([]); // Очистить корзину после успешного создания заявки
            // Также очищаем корзину в localStorage
            localStorage.removeItem('cart');
        }
    };

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
