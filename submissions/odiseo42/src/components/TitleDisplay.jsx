import React from 'react';
import css from './styles/TitleDisplay.css';

export default class TitleDisplay extends React.Component {

  render() {
    return (
      <h1 className={css.base}>
        Obi-Wan currently on {'Somewhere'}
      </h1>
    );
  }

}