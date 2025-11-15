import React, { useState, useEffect } from 'react';
import { radioAPI } from '../services/api';
import './Home.css';
import { ReactComponent as TgLogo } from '../images/tg_logo.svg';

const HomePage = () => {
    const [recentChanges, setRecentChanges] = useState([]);
    const [randomStation, setRandomStation] = useState(null);
    const [activeTab, setActiveTab] = useState('changes');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();        
    }, []);

    const fetchData = async () => {
        try {
            // получение последнего изменения
            const changesResponse = await radioAPI.getStations();
            const stations = changesResponse.data;
            //console.log('Данные от API:', stations[22]);

            // сортировка по дате. берем 5 свежих
            const sortedByDate = [...stations].sort((a, b) =>
                new Date(b.updated_at) - new Date(a.updated_at))
                .slice(0, 5);
            setRecentChanges(sortedByDate);

            // random station
            const randomIndex = Math.floor(Math.random() * stations.length);
            setRandomStation(stations[randomIndex]);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err);
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'working':
                return 'working';
            case 'temporary_off':
                return 'temporary-off';
            case 'planned':
                return 'planned';
            case 'disabled':
                return 'disabled';
            default:
                return 'disabled';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'working':
                return 'В эфире';
            case 'temporary_off':
                return 'Временно не работает';
            case 'planned':
                return 'План';
            case 'disabled':
                return 'Отключен';
            default:
                return 'Отключен';
        }
    };

    const handleRandomStation = async () => {
        try {
            const response = await radioAPI.getStations();
            const stations = response.data;
            const randomIndex = Math.floor(Math.random() * stations.length);
            setRandomStation(stations[randomIndex]);
        } catch(err) {
            console.error('Error fetching data:', err);
        }
    };

    const socialLinks = [
        {name: 'Telegram', url: 'https://t.me/radiornd', icon: TgLogo}
    ];

    if (loading) {
        return <div className='loading'>Загрузка...</div>
    }



    return (
        <div className='home-page'>
            <header className='header'>
                <div className='header-content'>
                    <h1 className='title'>Радио Ростовской области</h1>
                    <p className='subtitle'>Актуальный список частот по области</p>
                </div>
                <nav className='tabs'>
                <button className='tab-button'>
                    Города
                </button>
                <button className='tab-button'>
                    Станции
                </button>
                <button className='tab-button'>
                    Список станций
                </button>
                <button className='tab-button'>
                    Слушать онлайн
                </button>
                <button className='tab-button'>
                    О сайте
                </button>
            </nav>
            </header>
            

            <main className="main-content">
                <div className="content-columns">
                    <div className="changes-column">
                        <h2 className="section-title">Последние изменения:</h2>
                        <div className='changes-list'>
                            {recentChanges.map(station => (
                                <div key={station.id} className='change-item'>
                                    <div className='station-info'>
                                        <span className='station-name'>{station.station}</span>
                                        <span className='frequency'>{station.freq} МГц</span>
                                    </div>
                                    <div className='change-details'>
                                        <span className="city">{station.city}</span>
                                        <span className="update-time">
                                            Обновлено: {new Date(station.updated_at).toLocaleDateString('ru-RU')}
                                        </span>
                                    </div>
                                    <div className={`status ${getStatusClass(station.is_works)}`}>
                                        {getStatusText(station.is_works)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                
                
                    <div className="random-column">
                        <h2 className="section-title">Случайная станция:</h2>
                        {randomStation && (
                            <div className='random-station'>
                                <div className='station-card'>
                                    <h3>{randomStation.station}</h3>
                                    <p><strong>{randomStation.city} {randomStation.freq}</strong></p>
                                    <button className="listen-button">
                                        Слушать
                                    </button>
                                </div>
                            </div>
                        )}
                        <button className='new-random-button' onClick={handleRandomStation}>
                            Другая станция
                        </button>
                    </div>
                    
                </div>
                {/* */}
            </main>
            <footer className='footer'>
                <div className='social-links'>
                    <div className="social-icons">
                        {socialLinks.map(social => (
                            <a key={social.name} href={social.url}>
                                <social.icon className="social-icon" />
                                <span>{social.name}</span>
                            </a>
                    ))}
                </div>
            </div>
            <div className="footer-info">
                <p>© 2025 Konstantin P</p>
            </div>
            </footer>
        </div>
    );
};

export default HomePage;


