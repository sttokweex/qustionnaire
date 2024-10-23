import React from 'react';
import { Link } from 'react-router-dom';

const ThemesList: React.FC<{ themes: any[] }> = ({ themes }) => {
  return (
    <ul>
      {themes.map((theme) => (
        <li key={theme.id}>
          <Link to={`/theme/${theme.title}`}>{theme.title}</Link>
        </li>
      ))}
    </ul>
  );
};

export default ThemesList;
