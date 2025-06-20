import styles from "./ServiceCard.module.css";
import { useNavigate } from "react-router-dom";

export function ServiceCard({ id, name, description, image, price, addToCart} : { id : number, name : string, description : string, image : string, price : number, addToCart : any}) {
    const navigate = useNavigate();

    return (
        <div className={styles.card}>
            <h2 className={styles.title}>{name}</h2>
            <img className={styles.image} src={image} alt={name} />
            <p className={styles.description} dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br>') }} />
            <h2 className={styles.price}>{price} ₽/мес</h2>
            <div className={styles.buttons}>
                <button onClick={()=>navigate(`${id}`)}>Подробнее</button>
                <button onClick={() => addToCart(id, name, description, image, price)}>Добавить в корзину</button>
            </div>
        </div>
    );
}
