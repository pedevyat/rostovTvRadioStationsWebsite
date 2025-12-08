import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { radioAPI } from '../services/api';
import './City.css';

const City = () => {
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({key: null, direction: 'asc'}); // для сортировки
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        city: '',
        status: '',
        hasRds: '',
    });
    const [editCell, setEditCell] = useState(null);
    const [editingValue, setEditingValue] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        fetchStations();
    }, []);

    const fetchStations = async () => {
        try {
            const response = await radioAPI.getStations();
            const stationsWithId = response.data.map((station, index) => ({
                ...station,
                id: index + 1,
            }));
            setStations(stationsWithId);
            setLoading(false);
        } catch(err) {
            console.error('Error fetching stations: ', err);
            setLoading(false);
        }
    };

    const columns = [
        { key: 'freq', label: 'Частота', width: '120px', sortable: true, searchable: true },
        { key: 'station', label: 'Название', width: '200px', sortable: true, searchable: true },
        { key: 'local_station', label: 'Местная программа', width: '150px', sortable: true, searchable: true },
        { key: 'city', label: 'Город', width: '150px', sortable: true, filterable: true, searchable: true },
        { key: 'place', label: 'Место', width: '180px', searchable: true, searchable: true },
        { key: 'trp', label: 'кВт', width: '120px', sortable: true, searchable: true },
        { key: 'is_works', label: 'Статус', width: '130px', sortable: true, filterable: true, searchable: true },
        { key: 'is_rds', label: 'RDS', width: '80px', sortable: true, filterable: true, searchable: true },
        { key: 'asl', label: 'ASL', width: '100px', sortable: true, searchable: true },
        { key: 'ant', label: 'ANT', width: '140px', sortable: true, searchable: true },
        { key: 'online', label: 'Онлайн', width: '200px', sortable: true },
    ];

    const sortedStations = useMemo(() => {
        let result = [...stations];

        // применение поиска
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter(station =>
                columns.some(col => {
                    if (!col.searchable || !station[col.key]) 
                        return false;
                    return String(station[col.key]).toLowerCase().includes(searchLower);
                })
            );
        }

        // применение фильтров
        if (filters.city) 
            result = result.filter(station => station.city === filters.city);
        if (filters.status)
            result = result.filter(station => station.is_works === filters.status)
        if (filters.hasRds !== '') {
            const rdsBool = filters.hasRds === 'true';
            result = result.filter(station => station.is_rds === rdsBool);
        }

        // применение сортировки
        if (sortConfig.key) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue === bValue)
                    return 0;

                const direction = sortConfig.direction === 'asc' ? 1 : -1;

                // для чисел
                if (typeof aValue === 'number' && typeof bValue === 'number')
                    return (aValue - bValue) * direction;

                return String(aValue).localeCompare(String(bValue)) * direction;
            });
        }

        return result;
    }, [stations, sortConfig, searchTerm, filters]);
    
    // обработчик сортировки
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc' )
            direction = 'desc';
        setSortConfig({key, direction});
    };

    // обработчик редактирования
    const handleEditStart = (rowId, field, value) => {
        setEditCell({rowId, field});
        setEditingValue(value);
    };

    const handleEditSave = (rowId, field) => {
        setStations(prev => 
            prev.map(station =>
                station.id === rowId
                    ? {...station, [field]: editingValue }
                    : station
            )
        );
        setEditCell(null);
        setEditingValue('');
    };

    const handleEditCancel = () => {
        setEditCell(null);
        setEditingValue('');
    };

    // Получение уникальных значений для фильтров
    const uniqueCities = useMemo(() => 
        [...new Set(stations.map(s => s.city))].filter(Boolean).sort(),
        [stations]
    );

    const statusOptions = [
        { value: 'working', label: 'Работает' },
        { value: 'temporary_off', label: 'Временно не работает' },
        { value: 'planned', label: 'Планируется' },
        { value: 'disabled', label: 'Отключен' },
        { value: 'online', label: 'Онлайн' },
    ];

    // Форматирование значений для отображения
    const formatValue = (key, value) => {
        if (value === null || value === undefined || value === '') return '-';
        
        switch(key) {
            case 'is_works':
                return statusOptions.find(opt => opt.value === value)?.label || value;
            case 'is_rds':
                return value ? 'Да' : 'Нет';
            case 'freq':
                return value === 0 ? 'Онлайн' : `${value}`;
            case 'trp':
                return value ? `${value}` : '-';
            case 'online':
                return value ? (
                    <a href={value} target="_blank" rel="noopener noreferrer" className="online-link">
                        Слушать
                    </a>
                ) : '-';
            default:
                return value;
        }
    };

    return (
        <div className="radio-table">
            {/* Панель инструментов */}
            <div className="toolbar">
                <div className="toolbar-left">
                    <button 
                        className={`search-toggle ${showSearch ? 'active' : ''}`}
                        onClick={() => setShowSearch(!showSearch)}
                    >
                        {showSearch ? 'Скрыть поиск' : 'Поиск'}
                    </button>
                </div>
                
                <div className="stats">
                    Всего: {stations.length} | Отфильтровано: {sortedStations.length}
                </div>
            </div>

            {/* Панель поиска и фильтров */}
            {showSearch && (
                <div className="search-panel">
                    <div className="search-input">
                        <input
                            type="text"
                            placeholder="Поиск по всем полям..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-box"
                        />
                        {searchTerm && (
                            <button 
                                className="clear-search"
                                onClick={() => setSearchTerm('')}
                            >
                                ×
                            </button>
                        )}
                    </div>
                    
                    <div className="filters">
                        <select 
                            value={filters.city}
                            onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                            className="filter-select"
                        >
                            <option value="">Все города</option>
                            {uniqueCities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                        
                        <select 
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            className="filter-select"
                        >
                            <option value="">Все статусы</option>
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        
                        <select 
                            value={filters.hasRds}
                            onChange={(e) => setFilters(prev => ({ ...prev, hasRds: e.target.value }))}
                            className="filter-select"
                        >
                            <option value="">Все RDS</option>
                            <option value="true">С RDS</option>
                            <option value="false">Без RDS</option>
                        </select>
                        
                        <button 
                            className="clear-filters"
                            onClick={() => setFilters({ city: '', status: '', hasRds: '' })}
                        >
                            Сбросить фильтры
                        </button>
                    </div>
                </div>
            )}

            {/* Таблица */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            {columns.map(column => (
                                <th 
                                    key={column.key}
                                    style={{ width: column.width }}
                                    onClick={() => column.sortable && handleSort(column.key)}
                                    className={column.sortable ? 'sortable' : ''}
                                >
                                    <div className="header-content">
                                        {column.label}
                                        {sortConfig.key === column.key && (
                                            <span className="sort-arrow">
                                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedStations.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="no-data">
                                    Нет данных, соответствующих критериям поиска
                                </td>
                            </tr>
                        ) : (
                            sortedStations.map(station => (
                                <tr key={station.id} className="data-row">
                                    {columns.map(column => (
                                        <td 
                                            key={`${station.id}-${column.key}`}
                                            onDoubleClick={() => {
                                                // Разрешаем редактирование только некоторых полей
                                                const editableFields = ['station', 'local_station', 'place', 'online'];
                                                if (editableFields.includes(column.key)) {
                                                    handleEditStart(station.id, column.key, station[column.key]);
                                                }
                                            }}
                                            className={column.key === 'is_works' ? `status-${station.is_works}` : ''}
                                        >
                                            {editCell?.rowId === station.id && editCell?.field === column.key ? (
                                                <div className="edit-cell">
                                                    <input
                                                        type="text"
                                                        value={editingValue}
                                                        onChange={(e) => setEditingValue(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handleEditSave(station.id, column.key);
                                                            } else if (e.key === 'Escape') {
                                                                handleEditCancel();
                                                            }
                                                        }}
                                                        autoFocus
                                                    />
                                                    <div className="edit-buttons">
                                                        <button 
                                                            onClick={() => handleEditSave(station.id, column.key)}
                                                            className="save-btn"
                                                        >
                                                            ✓
                                                        </button>
                                                        <button 
                                                            onClick={handleEditCancel}
                                                            className="cancel-btn"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                formatValue(column.key, station[column.key])
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Пагинация (опционально) */}
            <div className="pagination">
                <div className="pagination-info">
                    Показано {sortedStations.length} из {stations.length} записей
                </div>
            </div>
        </div>
    );
};

export default City;