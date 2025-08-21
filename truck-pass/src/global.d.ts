import type { EnvConfig } from '../public/env.config';

export {};

declare global {
  interface Window {
    _env_: EnvConfig;
  }
}