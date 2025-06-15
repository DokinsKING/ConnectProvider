import { useState, useEffect, useCallback } from "react";
import Mock from "./mock.png";
import axiosClient from "./../../Clients"

export function ServiceListHook() {
    const [services, setServices] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [isCartVisible, setIsCartVisible] = useState(false);
    const [isCartLoaded, setIsCartLoaded] = useState(false);

        // Добавляем мок-данные
    const mockServices = [
        {
            id: 1,
            name: "Что-то не так",
            description: "Нет доступа к серверу(",
            image: Mock,
            price: 0
        }
    ];

    const processServiceImages = (services: any[]) => {
        return services.map(service => ({
            ...service,
            // Подставляем мок-изображение если:
            // - изображение отсутствует
            // - это строка нулевой длины
            // - это значение null/undefined
            image: service.image || Mock
        }));
    };

    // Функция для загрузки данных о сервисах
    const fetchServices = useCallback(async () => {
        try {
            const response = await axiosClient.get(`/api/services?name=${searchQuery}`);
            
            // Обрабатываем изображения перед установкой состояния
            const processedServices = processServiceImages(response.data);
            
            // Используем моки если сервер вернул пустой ответ
            setServices(processedServices.length > 0 
                ? processedServices 
                : processServiceImages(mockServices));
        } catch (error) {
            console.error("Ошибка при получении данных. Используем мок-данные.", error);
            // При ошибке загрузки используем обработанные мок-данные
            setServices(processServiceImages(mockServices));
        }
    }, [searchQuery]);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    // Функция для обработки клика по поиску
    const handleSearchClick = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const searchText = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
        setSearchQuery(searchText);
    };

    // Функция для добавления товара в корзину
    const addToCart = (id: number, name: string, description: string, image: string, price: number) => {
        const isItemInCart = cartItems.some(item => item.id === id);

        if (!isItemInCart) {
            const newItem = { id, name, description, image, price };
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
        setCartItems
    };
}