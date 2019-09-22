import React, { Component, Fragment } from 'react';
import _ from 'lodash';

import Slider from '../Slider';
import Loader from '../Loader';

import { getInterestRate } from '../../utils/services';

import {
  LOAN_AMOUNT_STEP,
  LOAN_AMOUNT_MIN,
  LOAN_AMOUNT_MAX,

  LOAN_DURATION_STEP,
  LOAN_DURATION_MIN,
  LOAN_DURATION_MAX
} from '../../constants';

class LoanForm extends Component {
  state = {
    amount: LOAN_AMOUNT_MIN,
    duration: LOAN_DURATION_MIN,
    interest: 0,
    emi: 0,

    amountError: null,
    durationError: null,
    isFetching: false
  };

  onAmountChange = amount => {
    this.setState({ amount, amountError: null, interest: 0 });
  }

  onTenureChange = duration => {
    this.setState({ duration, durationError: null, interest: 0 });
  }

  onEnterAmount = e => {
    e.preventDefault();

    const amount = Number(e.currentTarget.value);
    const isInRange = amount >= LOAN_AMOUNT_MIN && amount <= LOAN_AMOUNT_MAX;

    this.setState({
      amountError: isInRange ? null : `Please enter the amount between $${LOAN_AMOUNT_MAX} and $${LOAN_AMOUNT_MIN}`,
      interest: 0,
      amount
    });
  }

  onEnterTenure = e => {
    const duration = Number(e.currentTarget.value);
    const isInRange = duration >= LOAN_DURATION_MIN && duration <= LOAN_DURATION_MAX;

    this.setState({
      durationError: isInRange ? null : `Please enter the duration between ${LOAN_DURATION_MAX} and ${LOAN_DURATION_MIN} months`,
      interest: 0,
      duration
    });
  }

  onSubmit = e => {
    e.preventDefault();

    const { durationError, amountError } = this.state;

    if (_.isEmpty(durationError) && _.isEmpty(amountError)) {
      this.setState(
        { isFetching: true },
        () => {
          const { amount, duration } = this.state;

          getInterestRate({ amount, duration }).then(
            resp => {
              if (resp.status === 200) {
                const { interestRate, monthlyPayment } = resp.data;

                this.setState({ interest: interestRate, emi: monthlyPayment.amount, isFetching: false });
              }
            },
            err => {
              this.setState({ isFetching: false, interest: 0 });
            }
          );
        }
      );
    }
  }

  render() {
    const { isFetching, emi, interest, duration, durationError, amount, amountError } = this.state;

    return (
      <Fragment>
        <form className="loan" onSubmit={this.onSubmit}>
          <div className="line-sep__h"/>
          <div className="loan__amt">
            <div className="loan__heading">
              <label>Your desired Loan Amount: </label>
              <input
                type="number"
                name="amount"
                value={amount}
                className="loan__amt--input"
                onChange={this.onEnterAmount}
                placeholder="Enter your desired Loan Amount"
              />
              {amountError && <span className="field-error">{amountError}</span>}
            </div>
            <Slider
              value={amount}
              max={LOAN_AMOUNT_MAX}
              min={LOAN_AMOUNT_MIN}
              step={LOAN_AMOUNT_STEP}
              knobLabel={`$${amount}`}
              onChange={this.onAmountChange}
            />
          </div>
          <div className="loan__tenure">
            <label>Enter the tenure: </label>
            <input
              type="number"
              name="duration"
              value={duration}
              onChange={this.onEnterTenure}
              className="loan__tenure--input"
              placeholder="Enter the tenure (In Months) "
            />
            {durationError && <span className="field-error">{durationError}</span>}
            <Slider
              value={duration}
              max={LOAN_DURATION_MAX}
              min={LOAN_DURATION_MIN}
              step={LOAN_DURATION_STEP}
              knobLabel={`${duration} ${duration === 1 ? 'Month' : 'Months'}`}
              onChange={this.onTenureChange}
            />
          </div>
          <div className="line-sep__h"/>
          <div className="loan__actions ta--c">
            <button type="submit" className="loan__calculate">Calculate Interest Rate {isFetching && <Loader/>}</button>
          </div>
          <div className="line-sep__h"/>
          {interest > 0 && (
            <Fragment>
              <div className="loan__interest d--ib">
                <div className="loan__label">Rate of Interest: {interest}</div>
                <div className="loan__label">Monthly Payment: ${emi}</div>
              </div>
              <div className="line-sep__h"/>
            </Fragment>
          )}
        </form>
      </Fragment>
    );
  }
}

export default LoanForm;
