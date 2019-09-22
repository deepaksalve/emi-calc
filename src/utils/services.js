import axios from 'axios';
import _ from 'lodash';

import { API_BASE_URL } from '../constants';
import { getItem, setItem } from './localStorage';

export const getInterestRate = ({ amount, duration }) => {
  const lsKey = `${amount}--${duration}`;

  const cached = getItem(lsKey);

  if (_.isEmpty(cached)) {
    return axios.get(`${API_BASE_URL}interest?amount=${amount}&numMonths=${duration}`).then(
      resp => {
        setItem(lsKey, JSON.stringify(resp.data));

        return resp;
      },
      err => { }
    );
  }

  return Promise.resolve({ status: 200, data: JSON.parse(cached) });
}
