import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled from 'styled-components';

export enum TwoStepsEnum {
  STEP1 = 'STEP1',
  STEP2 = 'STEP2',
}

export interface StepInfo {
  title: string;
  description: string;
}

export interface TwoStepsProps {
  className?: string;
  step: TwoStepsEnum;
  step1Info: StepInfo;
  step2Info: StepInfo;
}

function TwoStepsBase({
  className,
  step,
  step1Info,
  step2Info,
}: TwoStepsProps) {
  return (
    <div className={className}>
      <span>
        <div className="in-between" />
        <span>
          <div className="span-step1">
            <span>{step === TwoStepsEnum.STEP1 ? '1' : '✓'}</span>
            <div>{step1Info.title}</div>
          </div>
          <div className="span-step2">
            <span>2</span>
            <div>{step2Info.title}</div>
          </div>
        </span>
      </span>
      <div className="description">
        {step === TwoStepsEnum.STEP1
          ? step1Info.description
          : step2Info.description}
      </div>
    </div>
  );
}

export const StyledTwoSteps = styled(TwoStepsBase)`
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

  border-bottom: 1px solid var(--color-gray2);

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
          step === TwoStepsEnum.STEP2 ? '--color-blue' : '--color-gray7'
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

      .span-step1 {
        span {
          background-color: var(--color-blue);
          ${({ step }) =>
            `color: var(${
              step === TwoStepsEnum.STEP1 ? '--white-100' : '--color-gray2'
            }`});
        }
        div {
          ${({ step }) =>
            `color: var(${
              step === TwoStepsEnum.STEP1 ? '--color-blue' : '--color-gray7'
            }`});
        }
      }

      .span-step2 {
        span {
          ${({ step }) =>
            `background-color: var(${
              step === TwoStepsEnum.STEP2 ? '--color-blue' : '--color-gray7'
            }`});
          ${({ step }) =>
            `color: var(${
              step === TwoStepsEnum.STEP2 ? '--white-100' : '--color-gray6'
            }`});
        }
        div {
          ${({ step }) =>
            `color: var(${
              step === TwoStepsEnum.STEP2 ? '--color-blue' : '--color-gray7'
            }`});
        }
      }
    }
  }
`;

export const TwoSteps = fixHMR(StyledTwoSteps);
