import "./Button.scss";

export default function Button({
  className,
  onClick,
  disabled,
  label,
  style,
  icon
}: {
  className: string;
  onClick: () => void;
  disabled?: boolean;
  label: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
}) {
  return (
    <button className={`button ${className}`} disabled={disabled} onClick={onClick} style={style}>
      <span className="front">
        {icon && <span style={{ marginRight: "0.5rem" }}>{icon}</span>}
        {label}
      </span>
    </button>
  );
}
