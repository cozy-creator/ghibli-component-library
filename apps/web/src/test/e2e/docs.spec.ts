import { expect, test } from "@playwright/test";

test("renders the library home, component docs, pattern docs, and examples gallery", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Scenic React components built for sharing, not hiding inside one product"
    })
  ).toBeVisible();

  await page.goto("/components");

  await page.getByLabel("Search").fill("Tooltip");
  await expect(page.getByRole("heading", { name: "Tooltip" })).toBeVisible();

  await page.goto("/components/button");

  await expect(page.getByRole("heading", { name: "Button" })).toBeVisible();
  await expect(
    page.getByText("pnpm dlx shadcn@latest add @ghibli/button", { exact: true })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Examples" })).toBeVisible();

  await page.goto("/patterns/auth-forms");

  await expect(
    page.getByRole("heading", { name: "Auth Forms" })
  ).toBeVisible();
  await expect(page.getByText("LoginForm")).toBeVisible();
  await expect(page.getByText("Reference screen")).toHaveCount(0);
});

test("renders the examples gallery on mobile and desktop", async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/examples");

  await expect(page.getByRole("heading", { name: "Generic examples built from the same installable source" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Auth starter" })).toBeVisible();

  await page.setViewportSize({ height: 900, width: 1440 });
  await page.reload();

  await expect(page.getByRole("heading", { name: "Marketing composition" })).toBeVisible();
});
