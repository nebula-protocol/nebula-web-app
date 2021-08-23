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

export interface FooterProps {
  className?: string;
}

function FooterBase({ className }: FooterProps) {
  const { updateColor } = useStyle();

  return (
    <div className={className}>
      <a href="https://discord.gg/9aUYgpKZ9c" target="_blank" rel="noreferrer">
        <FooterMediumIcon />
      </a>
      <a href="https://discord.gg/9aUYgpKZ9c" target="_blank" rel="noreferrer">
        <FooterDiscordIcon />
      </a>
      <a
        href="https://twitter.com/anchor_protocol"
        target="_blank"
        rel="noreferrer"
      >
        <FooterTelegramIcon />
      </a>
      <a href="https://t.me/anchor_official" target="_blank" rel="noreferrer">
        <FooterTwitterIcon />
      </a>
      <a
        href="https://github.com/Anchor-Protocol"
        target="_blank"
        rel="noreferrer"
      >
        <FooterGithubIcon />
      </a>
      <div />
      <div className="buttons">
        <EmptyButton>
          <DocsIcon /> Docs
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
    </div>
  );
}

export const Footer = styled(FooterBase)`
  margin-top: 60px;

  display: flex;
  align-items: center;

  a {
    font-size: 18px;

    margin-right: 20px;

    color: var(--color-white44);

    &:hover {
      color: var(--color-paleblue);
    }
  }

  .buttons {
    button {
      min-height: 42px;
      padding: 12px;
      margin-left: 1px;

      background-color: var(--color-gray14);
      color: var(--color-white44);

      font-size: 12px;

      svg {
        font-size: 16px;
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
