import {
  Button,
  IconAndLabels,
  Section,
  Sub,
  TitledLabel,
} from '@nebula-js/ui';
import React from 'react';
import styled from 'styled-components';

export interface NEBSectionProps {
  className?: string;
}

function NEBSectionBase({ className }: NEBSectionProps) {
  return (
    <Section className={className}>
      <IconAndLabels
        className="token"
        text="NEB"
        subtext="Nebula"
        subtextSize="0.6em"
        iconSize="1.8em"
        iconMarginRight="0.3em"
        textGap="-0.15em"
      />
      <Button className="button" size="medium">
        Stake
      </Button>
      <section className="labels">
        <TitledLabel
          title="STAKABLE NEB"
          text={
            <>
              123.123456 <Sub>NEB</Sub>
            </>
          }
        />
        <TitledLabel
          title="STAKED NEB"
          text={
            <>
              123.123456 <Sub>NEB</Sub>
            </>
          }
        />
      </section>
      <section className="apr">
        <div>APR</div>
        <div>
          <span>80</span>
          <Sub>.8%</Sub>
        </div>
      </section>
    </Section>
  );
}

export const NEBSection = styled(NEBSectionBase)`
  min-height: 230px;

  background-color: var(--color-gray14);

  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto;

  .token {
    font-size: 24px;

    align-self: start;
  }

  .button {
    min-width: 120px;
    max-width: 120px;

    justify-self: end;
  }

  .labels {
    font-size: 20px;

    align-self: end;

    display: flex;
    gap: 28px;
  }

  .apr {
    justify-self: end;
    align-self: end;

    display: flex;
    gap: 12px;
    align-items: flex-end;

    > :first-child {
      font-size: 12px;
      color: var(--color-paleblue);

      border: 1px solid var(--color-paleblue);
      border-radius: 16px;
      padding: 4px 10px;

      transform: translateY(-4px);
    }

    > :last-child {
      font-size: 40px;
      line-height: 1em;
      max-height: 1em;
    }
  }

  @media (max-width: 1050px) {
    grid-template-columns: auto auto;
    grid-template-rows: auto auto auto;

    .token {
      font-size: 20px;

      grid-column: 1/3;
      grid-row: 1;

      margin-bottom: 40px;
    }

    .labels {
      flex-direction: column;

      font-size: 18px;
      gap: 20px;
    }

    .apr {
      flex-direction: column;
      align-items: flex-start;

      gap: 5px;

      > :first-child {
        font-size: 11px;
      }

      > :last-child {
        font-size: 30px;
      }
    }

    .button {
      grid-column: 1/3;
      grid-row: 3;

      max-width: unset;
      width: 100%;

      margin-top: 32px;
    }
  }
`;