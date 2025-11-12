// proto/src/styles/tokens.css.ts
import { css } from "lit";

const styles = css`
  :host {
    --color-surface: #ffffff;
    --color-accent: #e63946;
    --color-error: #d62828;

    --size-spacing-small: 0.5rem;
    --size-spacing-medium: 1rem;
    --size-spacing-large: 2rem;

    --radius-medium: 6px;
    --radius-large: 12px;

    --shadow-soft: 0 2px 6px rgba(0, 0, 0, 0.15);
  }
`;

export default { styles };
