import { useState, useEffect } from 'react';
import axios from 'axios';
export interface Room {
    id: string;
    name: string;
    service: string;
    description: string;
    cost: number;
    due_date: string;
    created_at: string;
    role: string;
    payment_status: string;
    member_count: number;
    owner_username: string;
}

export const useRooms = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRooms = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/room/list/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setRooms(response.data.rooms);
            setLoading(false);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.error || 'Failed to fetch rooms');
            } else {
                setError('An unexpected error occurred');
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    return { rooms, loading, error, refetch: fetchRooms };
};