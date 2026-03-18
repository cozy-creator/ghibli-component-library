import { expect, test } from "@playwright/test";

test("renders the home page and a component docs page", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Ghibli UI" })).toBeVisible();
  await expect(
    page.getByText("Copy-paste components, not a package dependency")
  ).toBeVisible();

  await page.goto("/docs/components/button");

  await expect(page.getByRole("heading", { name: "Button" })).toBeVisible();
  await expect(
    page.getByText("pnpm dlx shadcn@latest add @ghibli/button", { exact: true })
  ).toBeVisible();
});
