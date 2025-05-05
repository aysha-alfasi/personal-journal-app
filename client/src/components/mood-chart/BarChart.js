import { Bar } from "react-chartjs-2";
import "./BarChart.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ data, isDemo }) => {
  const moodColors = {
    Happy: "#FBF0B2",
    Excited: "#FFA1CF",
    Neutral: "#C9E9D2",
    Sad: "#CAEDFF",
    Angry: "#FFCCCC",
  };

  const chartData = {
    labels: data.map((item) => item.mood),
    datasets: [
      {
        label: isDemo ? "Times" : "Demo",
        data: data.map((item) => item.count),
        backgroundColor: data.map(
          (item) =>
            moodColors[
              item.mood.charAt(0).toUpperCase() + item.mood.slice(1)
            ] || "#CDF0EA"
        ),
        borderColor: "none",
        borderRadius: 8,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: {
      duration: 1200,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.raw;
            return value === 1 ? "One time" : `${value} times`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: "#DBC4F0",
          font: {
            size: 14,
          },
        },
        grid: {
          color: "white",
          drawBorder: true,
        },
      },
      x: {
        ticks: {
          color: "#2e2c2c",
          font: {
            family: "Klee One",
            size: 14,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
