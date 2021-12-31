<style>
  /* @import url("https://fonts.googleapis.com/css2?family=Oxygen&display=swap"); */
  /* @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@500&display=swap"); */
  @import url("https://fonts.googleapis.com/css2?family=Readex+Pro&display=swap");

  :root {
    /* ========= COLOUR PALETTE ========= */
    /* from: https://coolors.co/227c9d-17c3b2-ffcb77-fef9ef-fe6d73 */
    --cg-blue: #227c9dff;
    --light-sea-green: #17c3b2ff;
    --maximum-yellow-red: #ffcb77ff;
    --light-coral: #fe6d73ff;
    --pal-light: #ffffff;

    --royal-blue: #4169e1;
    --royal-blue-200: #98a7ed;
    --royal-blue-700: #003bc3;
    --polished-pine: #5aaa95;
    --asparagus: #86a873;
    --lemon-curry: #bb9f06;

    --pal-primary: var(--royal-blue);
    --pal-primary-light: var(--royal-blue-200);
    --pal-primary-dark: var(--royal-blue-700);
    --pal-secondary: var(--polished-pine);
    --pal-info: var(--cg-blue);
    --pal-success: var(--light-sea-green);
    --pal-warning: var(--maximum-yellow-red);
    --pal-error: var(--light-coral);

    --pal-text-light: #fef9ef;
    --pal-text-soft: #aaa;
    --pal-text: #333;
    --pal-text-dark: #1e1e1e;

    --pal-border-light: #fef9ef;
    --pal-border-soft: #ccc;
    --pal-border: #aaa;
    --pal-border-hard: #1e1e1e;
    --pal-shadow: #cccc;

    /* ========= SPACING ========= */
    /* --spacing: 8px;
    --spacing-small: 4px; */
    --spacing: 0.5rem;
    --spacing-small: 0.25rem;
  }

  /* ========= CSS RESETS ========= */
  :global(button, input[type="submit"], input[type="reset"]) {
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
    margin: 0;
  }
  :global(body, html) {
    font-family: inherit;
    box-sizing: border-box;
    margin: 0;
    padding: 0px;
    height: 100%;
    width: 100%;
    color: var(--pal-text);
    font-family: "Readex Pro", sans-serif;
    font-size: 16px;
    position: relative;
  }
</style>
