import React, {useEffect, useState} from 'react';
import { radioAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Cities.css';

const CititesPage = () => {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const navigate = useNavigate();

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

    const translateToEnglish = (city) => {
        const translations = {
            "Ростов-на-Дону": "rostov-on-don",
            "Новочеркасск": "novocherkassk",
            "Дегтево": "degtevo",
            "Азов": "azov",
            "Сальск": "salsk",
            "Морозовск": "morozovsk",
            "Гуково": "gukovo",
            "Волгодонск": "volgodonsk",
            "Таганрог": "taganrog",
            "Каменск-Шахтинский": "kamensk-shakhtinskiy",
            "Вешенская": "veshenskaya",
            "Белая Калитва": "belaya-kalitva",
            "Миллерово": "millerovo",
            "Боковская": "bokovskaya",
            "Целина": "tselina",
            "Дубовское": "dubovskoye",
            "Пролетарск": "proletarsk",
            "Орловский": "orlovskiy",
            "Зерноград": "zernograd",
            "Донецк (Ростовская область)": "donetsk-rostov",
            "Заветное": "zavetnoye",
            "Чертково": "chertkovo",
            "Тацинская": "tatsinkaya",
            "Развильное": "razvilnoye",
            "Новошахтинск": "novoshakhtinsk",
            "Красный Сулин": "krasnyy-sulin",
            "Алексеево-Лозовское": "alekseyevo-lozovskoye",
            "Ремонтное": "remontnoye",
            "Константиновск": "konstantinovsk",
            "Семикаракорск": "semikarakorsk",
            "Обливская": "oblivskaya",
            "Матвеев Курган": "matveyev-kurgan",
            "Летник": "letnik",
            "Зимовники": "zimovniki",
            "Казанская": "kazanskaya",
            "Песчанокопское": "peschanokopskoye",
            "Красная Поляна (Ростовская область)": "krasnaya-polyana-rostov",
            "Усть-Донецкий": "ust-donetskiy",
            "Зверево": "zverevo"
        };
        return translations[city] || city.toLowerCase().replace(/\s+/g, '-');
    };

    const handleCityClick = (city) => {
        const engCity = translateToEnglish(city.name);
        navigate(`/cities/${engCity}`, {
            state: {city}
        });
    };

    function getStationText(count) {
        if (count % 10 === 1 && count % 100 !== 11) {
            return `${count} станция`;
        } else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
            return `${count} станции`;
        } else {
            return `${count} станций`;
        }
    }
    

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
                    <div key={city.name} className='city-card' onClick={() => handleCityClick(city)}>
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
                                {city.activeStations > 0 ? getStationText(city.activeStations) : 'Нет станций'}<br></br>
                                {city.plannedStations > 0 ? `${getStationText(city.plannedStations)} планируются` : ''} 
                            </div>   
                        </div>
                    </div>   
                ))}
            </div>
        </div>
    );
};

export default CititesPage;