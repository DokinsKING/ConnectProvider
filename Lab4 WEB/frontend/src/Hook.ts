import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

export function Hook() {
    const navigate = useNavigate();
    const location = useLocation();
    const [services, setServices] = useState<any[]>([]); // any[]
    const [applications, setApplications] = useState<any[]>([]); // any[]
    const [searchQuery, setSearchQuery] = useState("");
    const [type, setType] = useState("");

    const fetchData = useCallback(async () => {
        if (!type) return;

        let url = `http://127.0.0.1:8000/api/${type}`;
        if (searchQuery) url += `?name=${searchQuery}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Network error");
            const data = await response.json();

            if (type === "services/") setServices(data);
            else if (type === "applications/") setApplications(data);
        } catch (error) {
            console.error("Ошибка при получении данных:", error);
        }
    }, [type, searchQuery]);

    useEffect(() => {
        const newType = location.pathname.split('/')[1] + "/";
        if (newType !== "services/") setSearchQuery("");
        if (newType !== type && (newType === "services/" || newType === "applications/")) {
            setType(newType);
        }
    }, [location]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSearchClick = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const searchText = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
        setSearchQuery(searchText);
    };

    const createApplication = async (cartItems: { id: number }[]) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/applications/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'draft',
                    created_at: new Date().toISOString(),
                    creator: 1
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error("Failed to create application");

            await Promise.all(
                cartItems.map(item =>
                    fetch(`http://127.0.0.1:8000/api/application-services/`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
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
        navigate,
        location,
        services,
        applications,
        searchQuery,
        handleSearchClick,
        createApplication,
    };
}