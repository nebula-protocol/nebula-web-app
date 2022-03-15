import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { fixHMR } from 'fix-hmr';
import styled from 'styled-components';
import { useTwoSteps } from 'contexts/two-steps';

export interface AdvancedSwitchProps {
  className?: string;
  checked: boolean;
  updateChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

function AdvancedSwitchBase({
  className,
  checked,
  updateChecked,
}: AdvancedSwitchProps) {
  const { validateAndNavigate } = useTwoSteps();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = event.target.checked;
    const update = () => updateChecked(newVal);
    validateAndNavigate(update);
  };

  return (
    <div className={className}>
      <FormControlLabel
        control={
          <Switch
            checked={checked}
            onChange={handleChange}
            name="Advanced Mode"
            color="primary"
          />
        }
        label="Advanced Mode"
      />
    </div>
  );
}

const StyledAdvancedSwitch = styled(AdvancedSwitchBase)`
  display: flex;
  justify-content: flex-end;
  padding-bottom: 0.5em;

  .MuiSwitch-colorPrimary.Mui-checked {
    color: var(--color-blue01);
  }

  .MuiSwitch-colorPrimary.Mui-checked + .MuiSwitch-track {
    background-color: var(--color-blue01);
  }
`;

export const AdvancedSwitch = fixHMR(StyledAdvancedSwitch);
