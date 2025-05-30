import { useState, useEffect, useCallback } from "react";


export function ServiceListHook() {
    const [services, setServices] = useState<any[]>([]); // any[]
    const [searchQuery, setSearchQuery] = useState("");
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [isCartVisible, setIsCartVisible] = useState(false);
    const [isCartLoaded, setIsCartLoaded] = useState(false);

    // Функция для загрузки данных о сервисах
    const fetchServices = useCallback(async (url: string) => {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error("Network error");
            const data = await response.json();
            setServices(data);
        } catch (error) {
            console.error("Ошибка при получении данных:", error);
        }
    }, [searchQuery]);

    useEffect(() => {
        fetchServices(`/api/services?name=${searchQuery}`);
    }, [fetchServices]);

    // Функция для обработки клика по поиску
    const handleSearchClick = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const searchText = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
        setSearchQuery(searchText);
    };

    // Функция для добавления товара в корзину
    const addToCart = (id: number, name: string, description: string, image: string) => {
        const isItemInCart = cartItems.some(item => item.id === id);

        if (!isItemInCart) {
            const newItem = { id, name, description, image };
            setCartItems((prevItems) => {
                const updatedItems = [...prevItems, newItem];
                localStorage.setItem('cart', JSON.stringify(updatedItems));
                return updatedItems;
            });
        }
    };

    // Функция для отображения/скрытия корзины
    const toggleCartVisibility = () => {
        setIsCartVisible(!isCartVisible);
    };


    // Загрузка сохраненной корзины из localStorage
    useEffect(() => {
        if (!isCartLoaded) {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                setCartItems(JSON.parse(savedCart));
            }
            setIsCartLoaded(true);
        }
    }, [isCartLoaded]);

    // Сохранение корзины в localStorage
    useEffect(() => {
        if (cartItems.length === 0) {
            setIsCartVisible(false);
        }
        if (isCartLoaded) localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems, isCartLoaded]);

    return {
        services,
        handleSearchClick,
        addToCart,
        toggleCartVisibility,
        isCartVisible,
        cartItems,
        setCartItems  // Теперь возвращаем setCartItems
    };
}
