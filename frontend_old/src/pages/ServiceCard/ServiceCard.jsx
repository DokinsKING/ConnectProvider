import styles from "./ServiceCard.module.css";

export function ServiceCard({ id, name, description, image, navigate, addToCart}) {
    return (
        <div className={styles.card}>
            <h2 className={styles.title}>{name}</h2>
            <img className={styles.image} src={image} alt={name} />
            <p className={styles.description} dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br>') }} />
            <div className={styles.buttons}>
                <button onClick={() => {navigate(`/services/${id}`)}}>Подробнее</button>
                <button onClick={() => addToCart(id, name, description, image)}>Добавить в заявки</button>
            </div>
        </div>
    );
}
