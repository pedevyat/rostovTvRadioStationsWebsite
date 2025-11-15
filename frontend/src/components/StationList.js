// компонент для отображения данных

import React from 'react';
import { useState, useEffect } from 'react';
import { radioAPI } from '../services/api';

const StationList = () => {
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStations();
    }, []);

    const fetchStations = async () => {
        try {
            const response = await radioAPI.getStation();
            setStations(response.data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }

    };

    if (loading) return <div>Загрузка...</div>
    if (error) return <div>Не удалось загрузить: {error}</div>

    return (
        <div>
            <h2></h2>
        </div>
    );
};

export default StationList;