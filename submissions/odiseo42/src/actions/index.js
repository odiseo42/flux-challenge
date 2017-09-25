import { SITHS_API } from '../config';
import xhr from 'xhr';
import { redMatch, sithsToLoad, requestsToCancel } from '../selectors';

export const OBI_WAN_MOVED = 'OBI_WAN_MOVED';
export const UP = 'UP';
export const DOWN = 'DOWN';
export const LOADING_SITH = 'LOADING_SITH';
export const ABORT_REQUEST = 'ABORT_REQUEST';
export const SITH_LOADED = 'SITH_LOADED';
const ABORT_MSG = 'Internally aborted request';

function getRequest(sithId) {
  let request;
  const promise = new Promise((resolve, reject) => {
    request = xhr({uri: `${SITHS_API}/${sithId}`}, (err, resp, body) => {
      if(err) {
        reject(resp.statusCode === 0 ? new Error(ABORT_MSG) : err);
      } else if(resp.statusCode !== 200) {
        reject(new Error(
          `Wrong Request with code: ${resp.statusCode} and body: ${body}`
        ));
      } else {
        resolve(JSON.parse(body));
      }
    });
  });

  return { request, promise };
}

const thunks = {};

thunks.cancelUnnecessaryRequests = () => (dispatch, getState) => {
  const state = getState();
  requestsToCancel(state).forEach(({ request, direction }) => {
    request.abort();
    dispatch({ type: ABORT_REQUEST, direction });
  });
};

thunks.loadSiths = () => (dispatch, getState) => {
  const state = getState();
  sithsToLoad(state)
    .map((sithToLoad) => {
      return {
        direction: sithToLoad.direction,
        req: getRequest(sithToLoad.id)
      };
    })
    .forEach(({ direction, req }) => {
      dispatch({
        type: LOADING_SITH,
        direction,
        request: req.request
      });

      req.promise.then((sith) => {
        dispatch({ type: SITH_LOADED, direction, sith });

        const dispatchNext = redMatch(state) ?
          thunks.cancelUnnecessaryRequests :
          thunks.loadSiths;
          
        dispatch(dispatchNext());
      },
      (err) => {
        if(err.message !== ABORT_MSG) throw err;
      });
    });
};

thunks.initialRequest = () => (dispatch) => dispatch(thunks.loadSiths([DOWN]));

thunks.scroll = (direction) => (dispatch) => {
  dispatch({ type: direction });
  dispatch(thunks.cancelUnnecessaryRequests());
  dispatch(thunks.loadSiths());
};

thunks.obiWanMoved = (planet) => (dispatch, getState) => {
  const redMatchBefore = redMatch(getState());
  dispatch({
    type: OBI_WAN_MOVED,
    planet
  });
  const redMatchAfter = redMatch(getState());

  if(redMatchBefore !== redMatchAfter) {
    const action = redMatchAfter ? thunks.cancelUnnecessaryRequests : thunks.loadSiths;
    dispatch(action());
  }
};


export {thunks};









