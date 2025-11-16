import React, {useEffect, useState} from 'react';
import { radioAPI } from '../services/api';
import './Cities.css';

const CititesPage = () => {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        fetchCitiesData();
    }, []);

    const fetchCitiesData = async () => {
        try {
            const response = await radioAPI.getStations();
            const stations = response.data;

            // группируем станции по городам
            const citiesMap = {};
            stations.forEach(station => {
                if (!citiesMap[station.city]) {
                    citiesMap[station.city] = {
                        name: station.city,
                        stations: [],
                        image: `/images/cities/${station.city.
                                                    toLowerCase().
                                                    replace(/\s+/g, '-')}.jpg`,
                        activeStations: 0,
                        plannedStations: 0,
                        };
                    }
                    citiesMap[station.city].stations.push(station);
                    if (station.is_works === 'working') {
                        citiesMap[station.city].activeStations++;
                    } else if (station.is_works === 'planned') {
                        citiesMap[station.city].plannedStations++;
                    }
            
                });
            // Преобразуем в массив и сортируем по количеству станций
            const citiesArray = Object.values(citiesMap).sort((a, b) => 
                b.totalStations - a.totalStations
            );

            setCities(citiesArray);
            setLoading(false);
            
        } catch (err) {
            console.error('Error fetching cities data:', err);
            setLoading(false);
        }
    };

    // Фильтрация городов
    const filteredCities = cities.filter(city => {
        if (activeFilter === 'active') {
            return city.activeStations > 0;
        }
        return true;
    });

    if(loading) {
        return (
            <div className='cities-page'>
                <div className='loading'>Загрузка...</div>
            </div>
        );
    }

    return (
        <div className='cities-page'>
            <div className='cities-filters'>
                { /* Фильтры */}
            </div>

            <div className='cities-grid'>
                {filteredCities.map((city, index) => (
                    <div key={city.name} className='city-card'>
                        <img
                            src={city.image}
                            alt={city.name}
                            className='city-image'
                            onError={(e) => {
                                e.target.src = '/images/cities/default.jpg'
                            }}
                        />

                        <div className='city-content'>
                            <h3 className='city-name'>{city.name}</h3>
                            <div className='city-stations'>
                                {city.activeStations} станций<br></br>
                                {city.plannedStations > 0 ? `${city.plannedStations} станций планируются` : ''} 
                            </div>   
                        </div>
                    </div>   
                ))}
            </div>
        </div>
    );
};

export default CititesPage;