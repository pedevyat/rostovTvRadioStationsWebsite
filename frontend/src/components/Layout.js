import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './Layout.css';
import { ReactComponent as TgLogo } from '../images/tg_logo.svg';


const Layout = ({children}) => {
    const navigate = useNavigate();
    const location = useLocation();

        const socialLinks = [
            {name: 'Telegram', url: 'https://t.me/radiornd', icon: TgLogo}
        ];

    return (
        <div className="layout">
            <header className="header">
                <div className="header-background">
                    <div className="header-content">
                        <h1 className='title'>Радио Ростовской области</h1>
                        <p className='subtitle'>Актуальный список частот по области</p>                    
                    </div>
                    <nav className="tabs">
                        <button 
                            className='tab-button'
                            onClick={() => navigate('/')}
                        >
                            Главная
                        </button>
                        <button 
                            className='tab-button'
                            onClick={() => navigate('/cities')}
                        >
                            Города
                        </button>
                        <button 
                            className='tab-button'
                        >
                            Станции
                        </button>
                        <button 
                            className='tab-button'
                        >
                            Слушать онлайн
                        </button>
                        <button 
                            className='tab-button'
                        >
                            О сайте
                        </button>                
                    </nav>
                </div>
            </header>

            <main className="main-content">
                {children}
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

export default Layout;