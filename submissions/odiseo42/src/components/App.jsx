import React from 'react';
import TitleDisplay from './TitleDisplay.jsx';
import SithList from './SithList.jsx';


import css from './styles/App.css';

export default class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={css.base}>
        <div className={css.border}>
          <TitleDisplay/>
          <SithList/>
        </div>
      </div>
    );
  }

}