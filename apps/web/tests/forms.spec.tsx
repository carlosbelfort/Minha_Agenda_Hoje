import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "../app/login/page";

describe("Validação de formulário", () => {
  it("deve permitir clicar no botão mesmo com campos vazios", () => {
    render(<LoginPage />);

    const button = screen.getByRole("button", { name: /entrar/i });
    fireEvent.click(button);

    expect(button).toBeInTheDocument();
  });
});
