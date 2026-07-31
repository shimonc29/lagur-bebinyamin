import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PublishForm } from "@/components/publish-form";

describe("PublishForm", () => {
  it("collects the minimum information needed to review a rental listing", () => {
    render(<PublishForm />);

    expect(screen.getByLabelText("כותרת המודעה")).toBeRequired();
    expect(screen.getByLabelText("יישוב")).toBeRequired();
    expect(screen.getByLabelText("שכר דירה חודשי")).toBeRequired();
    expect(screen.getByLabelText("טלפון")).toBeRequired();
    expect(screen.getByRole("button", { name: "שליחת המודעה לבדיקה" })).toBeInTheDocument();
  });
});
