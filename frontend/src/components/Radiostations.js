import React, {useEffect, useState} from 'react';
import { radioAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Cities.css';

const RadiostationsPage = () => {
    const [stations, setStations] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchStationsData();
    }, []);

    const fetchStationsData = async () => {
        try {
            const response = await radioAPI.getStations();
            const allStations = response.data;

            // группируем станции по названию
            const stationsMap = {};
            allStations.forEach(station => {
                const stationName = station.station;
                
                if (!stationsMap[stationName]) {
                    stationsMap[stationName] = {
                        name: stationName,
                        stations: [],
                        image: `/images/radio/${stationName.toLowerCase().replace(/\s+/g, '-')}.png`,
                        activeStations: 0,
                        plannedStations: 0,
                        disabledStations: 0,
                        temporaryStations: 0,
                        cities: new Set(),
                    };
                }
                
                stationsMap[stationName].stations.push(station);
                stationsMap[stationName].cities.add(station.city);
                
                if (station.is_works === 'working') {
                    stationsMap[stationName].activeStations++;
                } else if (station.is_works === 'planned') {
                    stationsMap[stationName].plannedStations++;
                } else if (station.is_works === 'disabled') {
                    stationsMap[stationName].disabledStations++;
                } else if (station.is_works === 'temporary_off') {
                    stationsMap[stationName].temporaryStations++;
                }
            });

            const stationsArray = Object.values(stationsMap).map(station => ({
                ...station,
                totalStations: station.stations.length,
                cityCount: station.cities.size,
                cities: Array.from(station.cities)
            }));

            stationsArray.sort((a, b) => {
                if (b.activeStations !== a.activeStations) {
                    return b.activeStations - a.activeStations;
                }
                return b.cityCount - a.cityCount;
            });
            
            setStations(stationsArray);
            
        } catch (err) {
            console.error('Error fetching stations data:', err);
        }
    };

    const getStationText = (count) => {
        if (count % 10 === 1 && count % 100 !== 11) {
            return `${count} передатчик`;
        } else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
            return `${count} передатчика`;
        } else {
            return `${count} передатчиков`;
        }
    };

    const getCityText = (count) => {
        if (count % 10 === 1 && count % 100 !== 11) {
            return `${count} город`;
        } else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
            return `${count} города`;
        } else {
            return `${count} городов`;
        }
    };

    const translateToEnglish = (stationName) => {
        const translations = {
            "Русское Радио": "russkoe-radio",
            "Европа Плюс": "evropa-plus",
            "Авторадио": "avtoradio",
            "Дорожное Радио": "dorozhnoe-radio",
            "Радио Маяк": "radio-mayak",
        };
        return translations[stationName] || stationName.toLowerCase().replace(/\s+/g, '-');
    };

    const handleStationClick = (station) => {
        const engStation = translateToEnglish(station.name);
        navigate(`/radio/${engStation}`, {
            state: {station}
        });
    };

    // Фильтрация станций
    const filteredStations = stations.filter(station => {
        if (activeFilter === 'active') {
            return station.activeStations > 0;
        } else if (activeFilter === 'planned') {
            return station.plannedStations > 0;
        }
        return true;
    });


    return (
        <div className='cities-page'>

            <div className='cities-grid'>
                {filteredStations.map((station) => (
                    <div key={station.name} className='city-card' onClick={() => handleStationClick(station)}>
                        <img
                            src={station.image}
                            alt={station.name}
                            className='city-image'
                            onError={(e) => {
                                e.target.src = '/images/radio/default.jpg'
                            }}
                        />
                        <div className='city-content'>
                            <h3 className='city-name'>{station.name}</h3>
                            
                            <div className='city-stations'>
                                {station.activeStations > 0 ? getStationText(station.activeStations) : 'Нет активных передатчиков'}
                            </div>
                            <div className='station-status-container'>
                                {station.plannedStations > 0 && (
                                    <span className='city-stations'>
                                        {station.plannedStations} планируются
                                    </span>
                                )}
                                {station.temporaryStations > 0 && (
                                    <span className='city-stations'>
                                        {station.temporaryStations} временно не работают
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>   
                ))}
            </div>
        </div>
    );
};

export default RadiostationsPage;