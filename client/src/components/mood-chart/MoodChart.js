import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import BarChart from "./BarChart";

const demoData = [
  { mood: "Happy", count: 3 },
  { mood: "Excited", count: 2 },
  { mood: "Netural", count: 1 },
  { mood: "Sad", count: 1 },
  { mood: "Angry", count: 4 },
];

const MoodChart = ({ isDemo = false }) => {
  const realMoodData = useSelector((state) => state.moodStats);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (isDemo) {
      setChartData(demoData);
    } else {
      setChartData(realMoodData);
    }
  }, [isDemo, realMoodData]);

  return <BarChart data={chartData} isDemo={isDemo}/>;
};

export default MoodChart;
