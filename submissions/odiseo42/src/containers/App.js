import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ui } from '../selectors';
import PlanetMonitor from '../components/PlanetMonitor';
import Siths from '../components/Siths';
import ScrollButtons from '../components/ScrollButtons';
import {
  UP,
  DOWN,
  thunks,
} from '../actions';
import { OBI_WS } from '../config';

class App extends Component {
  constructor(props) {
    super(props);
    this.ws = new WebSocket(OBI_WS);
  }

  componentDidMount() {
    const { obiWanMoved, initialRequest } = this.props;
    this.ws.onmessage = obiWanMoved;
    initialRequest();
  }

  componentWillUnmount() {
    this.ws.close();
  }

  render() {
    const {
      currentPlanet,
      siths,
      paddingTop,
      paddingBottom,
      isScrollUpDisabled,
      isScrollDownDisabled,
      scrollUp,
      scrollDown,
    } = this.props;

    return (
      <div className="app-container">
        <div className="css-root">
          <PlanetMonitor name={currentPlanet.name} />

          <section className="css-scrollable-list">
            <Siths
              siths={siths}
              obiCurrentPlanetId={currentPlanet.id}
              paddingTop={paddingTop}
              paddingBottom={paddingBottom}
            />

            <ScrollButtons
              onScrollUp={scrollUp}
              onScrollDown={scrollDown}
              isScrollUpDisabled={isScrollUpDisabled}
              isScrollDownDisabled={isScrollDownDisabled}
            />

          </section>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  currentPlanet: PropTypes.object.isRequired,
  siths: PropTypes.array.isRequired,
  paddingTop: PropTypes.number,
  paddingBottom: PropTypes.number,
  isScrollUpDisabled: PropTypes.bool.isRequired,
  isScrollDownDisabled: PropTypes.bool.isRequired
};


const mapStateToProps = (state, ownProps) => {
  const selector = ui(state, ownProps);
  return {
    currentPlanet: selector.currentPlanet,
    siths: selector.siths,
    paddingTop: selector.paddingTop,
    paddingBottom: selector.paddingBottom,
    isScrollUpDisabled: selector.isScrollUpDisabled,
    isScrollDownDisabled: selector.isScrollDownDisabled,
  };
};

const mapDispatchToProps = (dispatch) => ({
  obiWanMoved: (e) => {
    dispatch(thunks.obiWanMoved(JSON.parse(e.data)));    
  },
  initialRequest: () => {
    dispatch(thunks.initialRequest());
  },
  scrollUp: () => {
    dispatch(thunks.scroll(UP));
  },
  scrollDown: () => {
    dispatch(thunks.scroll(DOWN));
  },
});


export default connect(mapStateToProps, mapDispatchToProps)(App);


// export default connect(ui)(App);
