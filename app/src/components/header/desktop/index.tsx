import { DocsIcon, ModeIcon } from '@nebula-js/icons';
import { EmptyButton } from '@nebula-js/ui';
import logoImage from 'components/assets/nebula-wide.svg';
import React from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { useStyle } from '@libs/style-router';
import styled from 'styled-components';
import { Wallet } from './Wallet';
import { useTwoSteps } from 'contexts/two-steps';

export interface DesktopHeaderProps {
  className?: string;
}

function DesktopHeaderBase({ className }: DesktopHeaderProps) {
  const { updateColor } = useStyle();

  const { validateAndNavigate } = useTwoSteps();

  const history = useHistory();

  const navigate = (event: React.MouseEvent<any, MouseEvent>, path: string) => {
    // ignore Link, NavLink link behaviour
    event.preventDefault();

    validateAndNavigate(() => history.push(path));
  };

  return (
    <header className={className + ' dark-color-set'}>
      <div>
        <Link to="/" onClick={(e) => navigate(e, '/')}>
          <img src={logoImage} alt="Nebula Protocol" />
        </Link>

        <div />

        <EmptyButton size={18}>
          <StyledA
            href="https://docs.neb.money"
            target="_blank"
            rel="noreferrer"
          >
            <DocsIcon />
          </StyledA>
        </EmptyButton>

        <EmptyButton
          size={18}
          onClick={() =>
            updateColor((prevColor) =>
              prevColor === 'dark' ? 'light' : 'dark',
            )
          }
        >
          <ModeIcon />
        </EmptyButton>
      </div>

      <div>
        <nav>
          <NavLink to="/" exact onClick={(e) => navigate(e, '/')}>
            Dashboard
          </NavLink>
          <NavLink to="/clusters" onClick={(e) => navigate(e, '/clusters')}>
            Clusters
          </NavLink>
          <NavLink to="/staking" onClick={(e) => navigate(e, '/staking')}>
            Staking
          </NavLink>
          <NavLink to="/gov" onClick={(e) => navigate(e, '/gov')}>
            Governance
          </NavLink>
          <NavLink to="/my" onClick={(e) => navigate(e, '/my')}>
            My Page
          </NavLink>
        </nav>

        <Wallet />
      </div>
    </header>
  );
}

const StyledA = styled.a`
  color: inherit;
`;

export const DesktopHeader = styled(DesktopHeaderBase)`
  background-color: var(--color-gray08);
  color: var(--color-white44);
  border-bottom: 1px solid var(--color-gray14);

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
        color: var(--color-white52);

        &:hover {
          color: var(--color-paleblue);
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

          color: var(--color-white44);

          &.active {
            color: var(--color-white92);
          }
        }
      }
    }
  }
`;
