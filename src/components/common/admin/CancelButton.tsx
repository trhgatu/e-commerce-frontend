import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CancelButtonProps {
  to: string;
  label?: string;
  className?: string;
}

const CancelButton: React.FC<CancelButtonProps> = ({ to, label = "Hủy bỏ", className = "" }) => {
  const navigate = useNavigate();

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => navigate(to)}
      className={`px-8 h-10 ${className}`}
    >
      {label}
    </Button>
  );
};

export default CancelButton;
