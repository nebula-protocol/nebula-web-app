import {
  DocsIcon,
  FooterDiscordIcon,
  FooterGithubIcon,
  FooterMediumIcon,
  FooterTelegramIcon,
  FooterTwitterIcon,
  ModeIcon,
} from '@nebula-js/icons';
import { EmptyButton } from '@nebula-js/ui';
import React from 'react';
import { useStyle } from '@libs/style-router';
import styled from 'styled-components';
import { useMediaQuery } from 'react-responsive';

const Disclaimer = () => (
  <a
    href="https://cloudflare-ipfs.com/ipfs/QmSp9V2ysm4y7eBz3bVYGdFA44fwdmDgLJ1op6KYAMpDm9"
    target="_blank"
    rel="noreferrer"
    style={{ fontSize: 'var(--font-size12)' }}
  >
    Disclaimers
  </a>
);
export interface FooterProps {
  className?: string;
}

function FooterBase({ className }: FooterProps) {
  const { updateColor } = useStyle();
  const isMobile = useMediaQuery({ maxWidth: 425 });

  return (
    <div className={className}>
      <a
        href="https://medium.com/nebula-protocol"
        target="_blank"
        rel="noreferrer"
      >
        <FooterMediumIcon />
      </a>
      <a href="https://discord.gg/rSdww7c7Vn" target="_blank" rel="noreferrer">
        <FooterDiscordIcon />
      </a>
      <a href="https://t.me/nebula_protocol " target="_blank" rel="noreferrer">
        <FooterTelegramIcon />
      </a>
      <a
        href="https://twitter.com/nebula_protocol"
        target="_blank"
        rel="noreferrer"
      >
        <FooterTwitterIcon />
      </a>
      <a
        href="https://github.com/nebula-protocol"
        target="_blank"
        rel="noreferrer"
      >
        <FooterGithubIcon />
      </a>
      {!isMobile && <Disclaimer />}
      <div />
      <div className="buttons">
        <EmptyButton>
          {/* <DocsIcon /> Docs */}
          <a href="https://docs.neb.money" target="_blank" rel="noreferrer">
            <DocsIcon /> Docs
          </a>
        </EmptyButton>
        <EmptyButton
          onClick={() =>
            updateColor((prevColor) =>
              prevColor === 'dark' ? 'light' : 'dark',
            )
          }
        >
          <ModeIcon />
        </EmptyButton>
      </div>
      {isMobile && <Disclaimer />}
    </div>
  );
}

export const Footer = styled(FooterBase)`
  margin-top: 60px;

  display: flex;
  align-items: center;
  flex-wrap: wrap;

  a {
    font-size: 18px;
    text-decoration: none;
    margin-right: 20px;

    color: var(--color-white6);

    &:hover {
      color: var(--color-paleblue);
    }
  }

  .buttons {
    display: flex;
    flex-wrap: nowrap;

    button {
      min-height: 42px;
      padding: 12px;
      margin-left: 1px;

      background-color: var(--color-gray3);
      color: var(--color-white6);

      font-size: 12px;

      svg {
        font-size: 16px;
      }

      > a {
        display: flex;
        align-items: center;
        font-size: 12px;
        margin-right: 0px;
        &:hover {
          color: var(--color-white6);
        }
      }

      &:first-child {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;

        svg {
          margin-right: 0.3em;
        }
      }

      &:last-child {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }
  }

  div:empty {
    flex: 1;
  }
`;
