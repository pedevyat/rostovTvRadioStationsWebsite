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
                        image: `/images/radio/${stationName.toLowerCase().replace(/\s+/g, '-')}.jpg`,
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


    const translateToEnglish = (stationName) => {
        const translations = {
            "Русское радио": "russkoe-radio",
            "Европа плюс": "evropa-plus",
            "Авторадио": "avtoradio",
            "Дорожное радио": "dorozhnoe-radio",
            "Маяк": "radio-mayak",
            "ФМ-на Дону": "fm-na-donu",
            "Вести FM": "vesti-fm",
            "Радио России": "radio-rossii",
            "Радио Дача": "radio-dacha",
            "Радио Мир": "radio-mir",
            "Радио Шансон": "radio-shanson",
            "Радио Вера": "radio-vera",
            "Ретро FM": "retro-fm",
            "Хит FM": "hit-fm",
            "Юмор FM": "yumor-fm",
            "Радио ENERGY": "radio-energy",
            "Радио Монте-Карло": "radio-monte-carlo",
            "Маруся ФМ": "marusya-fm",
            "Новое радио": "novoye-radio",
            "Радио Н": "radio-n",
            "Атаман FM": "ataman-fm",
            "Детское радио": "detskoye-radio",
            "Тихий Дон": "tikhiy-don",
            "Радио Таганрогский университет": "radio-taganrogskiy-universitet",
            "Радио Комсомольская правда": "radio-komsomolskaya-pravda",
            "Доброе радио": "dobroye-radio",
            "Наше радио": "nashe-radio",
            "Радио 101.9": "radio-101.9",
            "Радио Sputnik": "radio-sputnik",
            "Радио Рекорд": "radio-record",
            "Радио Ваня": "radio-vanya",
            "Малина FM": "malina-fm",
            "Радио 7": "radio-7",
            "Донское радио": "donskoye-radio",
            "Радио Гордость": "radio-gordost",
            "Казачий Дон": "kazachiy-don",
            "Эхо Москвы": "echo-moskvy",
            "Донская волна": "donskaya-volna",
            "Радио Ника": "radio-nika",
            "Радио 1": "radio-1",
            "Народное радио": "narodnoye-radio",
            "Радио 103": "radio-103",
            "Канал Воскресение": "kanal-voskreseniye",
            "Русский Хит": "russkiy-khit",
            "Радио Орфей": "radio-orfey",
            "Милицейская волна": "militseyskaya-volna",
            "Радио Атмосфера": "radio-atmosfera",
            "Радио Контур": "radio-kontur"

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
                                {station.activeStations > 0 ? getStationText(station.activeStations) : ''}
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