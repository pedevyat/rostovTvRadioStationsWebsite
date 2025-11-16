import React, { useState, useEffect } from 'react';
import { radioAPI } from '../services/api';
import './Home.css';
import { ReactComponent as TgLogo } from '../images/tg_logo.svg';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [recentChanges, setRecentChanges] = useState([]);
    const [randomStation, setRandomStation] = useState(null);
    const [activeTab, setActiveTab] = useState('changes');
    const [loading, setLoading] = useState(true);
    const [currentAudioUrl, setCurrentAudioUrl] = useState(null); // URL потока
    const [currentStationName, setCurrentStationName] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        fetchData(); 
        handleRandomStation();       
    }, []);

    const fetchData = async () => {
        try {
            // получение последнего изменения
            const changesResponse = await radioAPI.getStations();
            const stations = changesResponse.data;
            //console.log('Данные от API:', stations[22]);

            // сортировка по дате. берем 10 свежих
            const sortedByDate = [...stations].sort((a, b) =>
                new Date(b.updated_at) - new Date(a.updated_at))
                .slice(0, 10);
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
            
            setCurrentAudioUrl(null);
            setCurrentStationName('');
            const response = await radioAPI.getStations();
            const stations = response.data;
            const onlineStations = stations.filter(station => station.online != null); 
            const randomIndex = Math.floor(Math.random() * onlineStations.length);
            setRandomStation(onlineStations[randomIndex]);
        } catch(err) {
            console.error('Error fetching data:', err);
        }
    };

    const handleSetAudioStream = (station) => {
        setCurrentAudioUrl(station.online);
        setCurrentStationName(`${station.station} ${station.local_station || ''}`.trim());
    }

    if (loading) {
        return <div className='loading'>Загрузка...</div>
    }



    return (
        <div className='home-page'>
        

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
                                    <h3>{randomStation.station} {randomStation.local_station}</h3>
                                    <p><strong>{randomStation.city} {randomStation.freq}</strong></p>
                                    <button className="listen-button" onClick={() => handleSetAudioStream(randomStation)}>
                                        Слушать
                                    </button>
                                </div>
                            </div>
                        )}
                        <button className='new-random-button' onClick={handleRandomStation}>
                            Другая станция
                        </button>

                        {currentAudioUrl && (
                            <div className="audio-player-container">
                                <br></br>
                                    <audio 
                                        controls 
                                        autoPlay 
                                        className="browser-audio-player"
                                    >
                                        <source src={currentAudioUrl} type="audio/mpeg" />
                                        <source src={currentAudioUrl} type="audio/aac" />
                                        <source src={currentAudioUrl} type="audio/ogg" />
                                        Ваш браузер не поддерживает аудиоплеер.
                                    </audio>
                               
                            </div>
                     )}            
                    </div>
                    
                </div>
                {/* */}
            </main>
            
        </div>
    );
};

export default Home;


