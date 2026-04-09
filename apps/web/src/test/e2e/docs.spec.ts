import { expect, test } from "@playwright/test";

test("renders the single-page showcase and redirects legacy routes into anchors", async ({ page }) => {
  await page.goto("/");

  const desktopHeader = page.getByRole("banner");
  const desktopMenuTrigger = desktopHeader.locator('[data-slot="sheet-trigger"]').first();

  await expect(desktopMenuTrigger).toBeHidden();
  await expect(page.getByText("Ghibli UI Library")).toBeVisible();
  await expect(desktopHeader.getByRole("link", { name: "GitHub" })).toBeVisible();
  await expect(desktopHeader.getByRole("link", { name: "Docs" })).toBeVisible();
  await expect(desktopHeader.getByRole("button", { name: /User/i })).toBeVisible();
  await expect(page.getByText("pnpm dlx shadcn@latest add @ghibli/components")).toBeVisible();
  await expect(page.locator("#shell-navigation")).toBeVisible();
  await expect(page.locator("#core-primitives")).toBeVisible();
  await expect(page.getByRole("heading", { exact: true, name: "Button" })).toBeVisible();
  await expect(page.getByRole("heading", { exact: true, name: "Generate Prompt Composer" })).toBeVisible();
  await expect(page.getByRole("heading", { exact: true, name: "Footer" })).toBeVisible();

  await desktopHeader.getByRole("button", { name: /User/i }).click();
  await expect(page.getByRole("button", { exact: true, name: "Account" })).toBeVisible();
  await expect(page.getByRole("button", { exact: true, name: "Sign out" })).toBeVisible();
  await page.keyboard.press("Escape");

  await page.locator("#pattern-auth-forms").getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { exact: true, name: "Welcome back" })).toBeVisible();
  await page.getByRole("tab", { name: "Register" }).click();
  await expect(page.getByRole("tab", { name: "Register" })).toHaveAttribute("data-state", "active");
  await expect(page.getByRole("button", { name: "Create account" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("heading", { exact: true, name: "Welcome back" })).toHaveCount(0);

  await page.getByRole("button", { name: "Open image modal" }).click();
  await expect(page.getByText("Community image")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByText("Community image")).toHaveCount(0);

  await page.getByRole("button", { name: "Open video modal" }).click();
  await expect(page.getByRole("heading", { exact: true, name: "Lantern ferry glide" })).toBeVisible();
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "Open password dialog" }).click();
  await expect(page.getByRole("heading", { exact: true, name: "Change password" })).toBeVisible();
  await page.keyboard.press("Escape");

  await page.goto("/components/button");

  await expect(page).toHaveURL(/#component-button$/);
  await expect(page.getByRole("heading", { exact: true, name: "Button" })).toBeVisible();
  await expect(page.getByText("pnpm dlx shadcn@latest add @ghibli/button")).toHaveCount(0);

  await page.goto("/patterns/auth-forms");

  await expect(page).toHaveURL(/#pattern-auth-forms$/);
  await expect(page.getByRole("heading", { name: "Auth Forms" })).toBeVisible();
  await expect(page.locator("#pattern-auth-forms").getByRole("button", { name: "Create account" })).toBeVisible();
  await expect(page.getByText("Reference screen")).toHaveCount(0);
});

test("renders the showcase on mobile and desktop without horizontal page overflow", async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/");

  const mobileMenuTrigger = page.locator('header [data-slot="sheet-trigger"]').first();
  const mobileSheet = page.locator('[data-slot="sheet-content"]');

  await expect(mobileMenuTrigger).toBeVisible();
  await mobileMenuTrigger.click();
  await expect(page.getByRole("heading", { exact: true, name: "Ghibli UI" })).toBeVisible();
  await expect(mobileSheet.getByText("User", { exact: true })).toBeVisible();
  await mobileSheet.getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("heading", { exact: true, name: "Storybook" })).toBeVisible();
  await expect(page.locator("#footer-endmatter")).toBeVisible();
  await expect(page.getByRole("heading", { exact: true, name: "User Display Box" })).toBeVisible();
  await expect.poll(async () =>
    page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)
  ).toBe(true);

  await page.setViewportSize({ height: 900, width: 1440 });
  await page.reload();

  await expect(mobileMenuTrigger).toBeHidden();
  await expect(page.getByRole("heading", { exact: true, name: "Cards" })).toBeVisible();
  await expect(page.getByRole("heading", { exact: true, name: "Footer" })).toBeVisible();
  await expect.poll(async () =>
    page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)
  ).toBe(true);
});
