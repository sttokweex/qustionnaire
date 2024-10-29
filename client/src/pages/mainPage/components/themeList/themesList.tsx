import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const ThemesList: React.FC<{ themes: any[] }> = ({ themes }) => {
  return (
    <ul className="list">
      {themes.map((theme) => (
        <li key={theme.id} className="list-item">
          <Link to={`/theme/${theme.title}`} className="link">
            {theme.title}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default ThemesList;
