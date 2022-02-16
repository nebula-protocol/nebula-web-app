import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled from 'styled-components';

export enum BasicStepsEnum {
  SWAP = 'SWAP',
  MINT = 'MINT',
}

export interface BasicStepsProps {
  className?: string;
  step: BasicStepsEnum;
}

function BasicStepsBase({ className, step }: BasicStepsProps) {
  return (
    <div className={className}>
      <span>
        <div className="in-between" />
        <span>
          <div className="span_swap">
            <span>{step === BasicStepsEnum.SWAP ? '1' : '✓'}</span>
            <div>Swap</div>
          </div>
          <div className="span_mint">
            <span>2</span>
            <div>Mint</div>
          </div>
        </span>
      </span>
      <div className="description">
        {step === BasicStepsEnum.SWAP
          ? '1. Purchase inventory assets to mint with'
          : '2. Mint cluster tokens'}
      </div>
    </div>
  );
}

export const StyledBasicSteps = styled(BasicStepsBase)`
  width: 100%;
  padding-bottom: 2.28571429em;
  margin-top: 2.28571429em;
  margin-bottom: 2.28571429em;

  font-size: 1.14285714em;
  text-align: center;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  border-bottom: 1px solid var(--color-gray11);

  .description {
    font-weight: 500;
    margin-top: 1.42857em;
    color: var(--white-92);
  }

  span {
    position: relative;

    .in-between {
      position: absolute;
      margin-top: 0.9em;
      margin-left: 1em;
      margin-right: 10em;
      min-width: 90%;
      min-height: 0.3571428em;
      ${({ step }) =>
        `background-color: var(${
          step === BasicStepsEnum.MINT ? '--color-blue01' : '--color-gray34'
        }`});
    }

    span {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 18.42857em;

      div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        span {
          display: flex;
          justify-content: center;
          align-items: center;

          border-radius: 50%;
          min-width: 2.14285714em;
          min-height: 2.14285714em;
          max-width: 2.14285714em;
          max-height: 2.14285714em;
        }
        div {
          margin-top: 0.571428em;
          font-size: 1em;
        }
      }

      .span_swap {
        span {
          background-color: var(--color-blue01);
          ${({ step }) =>
            `color: var(${
              step === BasicStepsEnum.SWAP ? '--white-100' : '--color-gray11'
            }`});
        }
        div {
          ${({ step }) =>
            `color: var(${
              step === BasicStepsEnum.SWAP ? '--color-blue01' : '--color-gray34'
            }`});
        }
      }

      .span_mint {
        span {
          ${({ step }) =>
            `background-color: var(${
              step === BasicStepsEnum.MINT ? '--color-blue01' : '--color-gray34'
            }`});
          ${({ step }) =>
            `color: var(${
              step === BasicStepsEnum.MINT ? '--white-100' : '--color-gray24'
            }`});
        }
        div {
          ${({ step }) =>
            `color: var(${
              step === BasicStepsEnum.MINT ? '--color-blue01' : '--color-gray34'
            }`});
        }
      }
    }
  }
`;

export const BasicSteps = fixHMR(StyledBasicSteps);
