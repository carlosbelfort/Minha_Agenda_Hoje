
import { render, screen } from "@testing-library/react";
import LoginPage from "../app/login/page";

describe("Páginas principais", () => {
  it("deve renderizar a página de login", () => {
    render(<LoginPage />);
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });
});
