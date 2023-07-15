import { useRef } from "react";

interface ButtonProps {
  type: "primary" | "secondary" | "success" | "danger";
  disabled?: boolean;
  [key: string]: any;
}

const Button = ({ type, disabled, ...props }: ButtonProps) => {
  const { current: className } = useRef(
    `z-button ${
      type === "primary" ? "z-button-primary" :
      type === "secondary" ? "z-button-secondary" :
      type === "success" ? "z-button-success" :
      "z-button-danger"
    }`
  );

  return (
    <button className={className} {...props} />
  );
}
export default Button;