import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";

export default function ButtonBack() {
  const navigate = useNavigate();

  return (
    <Button
      customClass="back"
      onClick={(e) => {
        e.preventDefault();
        navigate("..", { relative: "path" });
      }}
    >
      &larr; Back
    </Button>
  );
}
