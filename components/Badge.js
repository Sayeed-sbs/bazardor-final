import { bn } from "@/lib/helpers";

export default function Badge({ change }) {
  if (change > 0) {
    return <span className="text-brand font-semibold">▲ {bn(change)}%</span>;
  }
  if (change < 0) {
    return <span className="text-down font-semibold">▼ {bn(Math.abs(change))}%</span>;
  }
  return <span className="text-gray-500 font-semibold">— ০.০%</span>;
}