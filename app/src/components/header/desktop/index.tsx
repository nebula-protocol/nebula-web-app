import { DocsIcon, ModeIcon } from '@nebula-js/icons';
import { EmptyButton } from '@nebula-js/ui';
import logoImage from 'components/assets/nebula-wide.svg';
import { useTheme } from 'contexts/theme';
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Wallet } from './Wallet';

export interface DesktopHeaderProps {
  className?: string;
}

function DesktopHeaderBase({ className }: DesktopHeaderProps) {
  const { themeColor, updateTheme } = useTheme();

  return (
    <header className={className}>
      <div>
        <Link to="/">
          <img src={logoImage} alt="Nebula Protocol" />
        </Link>

        <div />

        <EmptyButton size={18}>
          <DocsIcon />
        </EmptyButton>

        <EmptyButton
          size={18}
          onClick={() => updateTheme(themeColor === 'dark' ? 'light' : 'dark')}
        >
          <ModeIcon />
        </EmptyButton>
      </div>

      <div>
        <nav>
          <NavLink to="/clusters">Clusters</NavLink>
          <NavLink to="/staking">Staking</NavLink>
          <NavLink to="/gov">Governance</NavLink>
          <NavLink to="/my">My Page</NavLink>
        </nav>

        <Wallet />
      </div>
    </header>
  );
}

export const DesktopHeader = styled(DesktopHeaderBase)`
  background-color: ${({ theme }) => theme.colors.gray08};
  color: ${({ theme }) => theme.colors.white44};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray14};

  height: 110px;

  padding: 24px 50px 12px 50px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  --first-line-height: 18px;
  --second-line-height: 32px;

  > div {
    max-width: 1080px;
    width: 100%;
    margin: 0 auto;

    &:first-child {
      display: flex;
      align-items: flex-start;
      gap: 20px;

      font-size: var(--first-line-height);
      height: var(--first-line-height);

      > div:empty {
        flex: 1;
      }

      .Nebula-EmptyButton {
        color: ${({ theme }) => theme.colors.white52};

        &:hover {
          color: ${({ theme }) => theme.colors.paleblue.main};
        }
      }
    }

    &:last-child {
      display: flex;
      justify-content: space-between;
      align-items: center;

      height: var(--second-line-height);

      nav {
        display: flex;
        gap: 40px;

        a {
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;

          transition: color 0.4s ease-out;

          color: ${({ theme }) => theme.colors.white44};

          &.active {
            color: ${({ theme }) => theme.colors.white92};
          }
        }
      }
    }
  }
`;
