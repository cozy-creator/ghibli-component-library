import { expect, test } from "@playwright/test";

test("renders the Cozy-derived single-page showcase and redirects legacy routes into anchors", async ({ page }) => {
  await page.goto("/");

  const desktopMenuTrigger = page.locator('header [data-slot="sheet-trigger"]').first();

  await expect(desktopMenuTrigger).toBeHidden();
  await expect(page.getByText("Ghibli UI Library")).toBeVisible();
  await expect(page.getByText("pnpm dlx shadcn@latest add @ghibli/all")).toBeVisible();
  await expect(page.getByText("Shell & Navigation")).toBeVisible();
  await expect(page.getByText("Core Primitives")).toBeVisible();
  await expect(page.getByRole("heading", { exact: true, name: "Button" })).toBeVisible();
  await expect(page.getByRole("heading", { exact: true, name: "Generate Prompt Composer" })).toBeVisible();
  await expect(page.getByRole("heading", { exact: true, name: "Footer" })).toBeVisible();

  await page.getByRole("button", { name: "Open auth modal" }).click();
  await expect(page.getByRole("heading", { exact: true, name: "Welcome back" })).toBeVisible();
  await page.getByRole("tab", { name: "Register" }).click();
  await expect(page.getByRole("heading", { exact: true, name: "Create account" })).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("heading", { exact: true, name: "Welcome back" })).toHaveCount(0);

  await page.getByRole("button", { name: "Open image modal" }).click();
  await expect(page.getByText("Community image")).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByText("Community image")).toHaveCount(0);

  await page.getByRole("button", { name: "Open video modal" }).click();
  await expect(page.getByRole("heading", { exact: true, name: "Lantern ferry glide" })).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();

  await page.getByRole("button", { name: "Open password dialog" }).click();
  await expect(page.getByRole("heading", { exact: true, name: "Change password" })).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();

  await page.goto("/components/button");

  await expect(page).toHaveURL(/#component-button$/);
  await expect(page.getByRole("heading", { exact: true, name: "Button" })).toBeVisible();
  await expect(page.getByText("pnpm dlx shadcn@latest add @ghibli/button")).toHaveCount(0);

  await page.goto("/patterns/auth-forms");

  await expect(page).toHaveURL(/#pattern-auth-forms$/);
  await expect(page.getByRole("heading", { name: "Auth Forms" })).toBeVisible();
  await expect(page.getByText("Sign in").first()).toBeVisible();
  await expect(page.getByText("Reference screen")).toHaveCount(0);
});

test("renders the showcase on mobile and desktop without horizontal page overflow", async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/");

  const mobileMenuTrigger = page.locator('header [data-slot="sheet-trigger"]').first();

  await expect(mobileMenuTrigger).toBeVisible();
  await mobileMenuTrigger.click();
  await expect(page.getByRole("heading", { exact: true, name: "Ghibli UI" })).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("heading", { exact: true, name: "Storybook" })).toBeVisible();
  await expect(page.getByText("Footer & Endmatter")).toBeVisible();
  await expect(page.getByRole("heading", { exact: true, name: "User Display Box" })).toBeVisible();
  await expect.poll(async () =>
    page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)
  ).toBe(true);

  await page.setViewportSize({ height: 900, width: 1440 });
  await page.reload();

  await expect(mobileMenuTrigger).toBeHidden();
  await expect(page.getByRole("heading", { exact: true, name: "Community Cards" })).toBeVisible();
  await expect(page.getByRole("heading", { exact: true, name: "Footer" })).toBeVisible();
  await expect.poll(async () =>
    page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)
  ).toBe(true);
});
