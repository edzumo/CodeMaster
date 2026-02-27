import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function MetricsChart({ data }) {
  const chartData = {
    labels: data.weekly_activity.map(d => d.created_at__date),
    datasets: [
      {
        label: "Submissions",
        data: data.weekly_activity.map(d => d.count),
        borderColor: "#facc15",
        tension: 0.3
      }
    ]
  };

  return <Line data={chartData} />;
}