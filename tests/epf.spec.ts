import { test, expect } from "@playwright/test";

test("epf duitnow happy path", async ({ page }) => {
  await page.goto("/demo/epf-contribution?pack=my");
  await page.getByLabel("ID pengguna").fill("demo-user");
  await page.getByRole("button", { name: "Log masuk sekarang" }).click();
  await page.getByRole("button", { name: "Tambah Caruman Sukarela" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Confirm" }).click();
  await page.getByRole("button", { name: /^Pay RM/ }).click();
  await page.getByRole("button", { name: "Open QR simulation" }).click();
  await page.getByRole("button", { name: "Simulate success" }).click();
  await expect(page.getByText("Contribution successful")).toBeVisible();
});

test("epf fpx redirect path", async ({ page }) => {
  await page.goto("/demo/epf-contribution?pack=my");
  await page.getByLabel("ID pengguna").fill("demo-user");
  await page.getByRole("button", { name: "Log masuk sekarang" }).click();
  await page.getByRole("button", { name: "Tambah Caruman Sukarela" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Confirm" }).click();
  await page.getByRole("button", { name: /FPX \(Internet Banking\)/ }).click();
  await page.getByRole("button", { name: /^Pay RM/ }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Redirecting to FPX…")).toBeVisible();
});
