import { SEVERITY, SEVERITY_ORDER } from "../config";

export default function Legend() {
  return (
    <div className="legend">
      <span className="legend-title">Severity</span>
      {SEVERITY_ORDER.map((key) => (
        <span key={key} className="legend-item">
          <span className="severity-dot" style={{ backgroundColor: SEVERITY[key].color }} />
          {SEVERITY[key].label}
        </span>
      ))}
    </div>
  );
}
