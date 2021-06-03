import type { NebulaTheme } from '@nebula-js/ui';
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme extends NebulaTheme {}
}
