import { useSelector } from "react-redux";
import { getTheme } from "../utils/theme";

export default function InfoCard({ title, children }) {
  const theme = useSelector((s) => s.repo.theme);
  const t = getTheme(theme);

  return (
    <div className={`p-4 rounded-2xl border ${t.card} ${t.border}`}>
      <h4 className={`text-xs mb-2 ${t.subtext}`}>{title}</h4>
      {children}
    </div>
  );
}