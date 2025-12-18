import "./Button.scss";

export default function Button({
  className,
  onClick,
  disabled,
  label,
  style
}: {
  className: string;
  onClick: () => void;
  disabled?: boolean;
  label: string;
  style?: React.CSSProperties;
}) {
  return (
    <button className={`button ${className}`} disabled={disabled} onClick={onClick} style={style}>
      <span className="front">{label} </span>
    </button>
  );
}
