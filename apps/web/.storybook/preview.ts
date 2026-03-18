import type { Preview } from "@storybook/react-vite";

import "../src/styles/globals.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      disable: true
    },
    layout: "padded",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
};

export default preview;

