import React, {useEffect, useState} from 'react';


const aboutPage = () => {
    return (
        <div className='about-page'>
            <div className='header-about'>
                <h1>О сайте</h1>
            </div>
            <div className='description'>
                В этом сайте содержится информация об актуальных частотах и станциях Ростовской области. Здесь указаны только те частоты, 
                которые были зарегистрированы в Роскомнадзоре, за исключением интернет-станций, которые не имеют эфирной частоты.<br></br><br></br> 
                Если у автора сайта появится желание, то сайт выйдет за рамки Ростовской области<br></br><br></br> 
            </div>
            <div className='utility-information'>
                Полезные ссылки:<br></br> <br></br> 
                <a href='https://vcfm.ru/'>Victor City</a> - реестр частот ТВ и радио России, Беларуси и Казахстана<br></br> <br></br> 
                <a href='https://t.me/radiornd'>Telegram ТВиР РО</a> - новостной канал о телерадиовещании Ростовской области<br></br> <br></br> 
                <a href='https://t.me/radiornd161'>Чат ТВиР РО</a> - чат, дополнение к каналу<br></br> <br></br> 
                <a href='https://radiornd.ucoz.ru/'>Радио и ТВ в Ростове-на-Дону и области</a><br></br> <br></br> 
                Здесь может быть ваша реклама
            </div>
        </div>
    );
};

export default aboutPage;