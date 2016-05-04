import _ from 'underscore';
import api from '../api/index.js'
import { combineReducers } from 'redux';
import city from './city.js';
import district from './district.js';
import comm from './comm.js';
import input from './input.js';
import building from './building.js';
import area from './area.js';
import price from './price.js';
import mode from './mode.js';
import map from './map.js';

const app = combineReducers({
  map,
  city,
  district,
  comm,
  input,
  building,
  area,
  price,
  mode

});

export default app;
