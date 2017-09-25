import React from 'react';
import css from './styles/SithList.css';

export default class SithList extends React.Component {
  render() {
    return (
      <section className={css.base}>
        <ul className={css.sithSlots}>
          
        </ul>
        <div className={css.buttons}>
          <button className={css.buttonUp} />
          <button className={css.buttonDown} />
        </div>
      </section>
    );
  }

}