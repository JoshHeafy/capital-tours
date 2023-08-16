import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip } from "chart.js";
Chart.register(ArcElement);
Chart.register([Tooltip])

const DonutChart = ({ data }) => {
  return (
    <div className="donut">
      <Doughnut style={{ width: "100px" }} data={data} />
    </div>
  );
};

export default DonutChart;
