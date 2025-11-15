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
                {activeTab === 'changes' && (
                    <section className="changes-section">
                        <h2>Последние изменения:</h2>
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
                                    <div className={`status ${station.is_works ? 'working' : 'not-working'}`}>
                                        {station.is_works ? 'В эфире' : 'Не работает'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {activeTab === 'random' && (
                    <section className='random-section'>
                        <h2>Случайная станция:</h2>
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
                    </section>
                    
                )}
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


