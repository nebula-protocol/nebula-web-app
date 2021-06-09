import { ComponentType } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

let ErrorBoundaryComponent: ComponentType = ErrorBoundary;

export function configErrorBoundary(ConfigureErrorBoundary: ComponentType) {
  ErrorBoundaryComponent = ConfigureErrorBoundary;
}

export function getErrorBoundary(): ComponentType {
  return ErrorBoundaryComponent;
}
