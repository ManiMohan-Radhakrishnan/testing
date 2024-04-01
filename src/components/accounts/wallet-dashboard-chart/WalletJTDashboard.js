import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { roundDown, userBalanceDetailFormat } from "../../../utils/common";

const WalletJTDashboardChart = ({ ChartData }) => {
  const { total_amount = 0 } = ChartData;
  const [redraw, setRedraw] = useState(false);
  const options = {
    rotation: 1 * Math.PI,
    circumference: 1 * Math.PI,
    cutoutPercentage: 70,
    legend: {
      display: false,
      position: "right",
    },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
    title: {
      text: "right",
    },
    tooltips: {
      callbacks: {
        title: function (tooltipItem, data) {
          return data["labels"][tooltipItem[0]["index"]];
        },
        label: function (tooltipItem, data) {
          return data["datasets"][0]["data"][tooltipItem["index"]];
        },
        afterLabel: function (tooltipItem, data) {
          var percent = 0;
          var dataset = data["datasets"][0];
          percent = roundDown(
            (dataset["data"][tooltipItem["index"]] / total_amount) * 100,
            2
          );
          return "(" + percent + "%)";
        },
      },
      displayColors: false,
    },
  };

  const data = {
    maintainAspectRatio: false,
    responsive: false,
    labels: ChartData?.labels,

    datasets: [
      {
        data: ChartData?.data,
        backgroundColor: ChartData?.chartColors,
        hoverBackgroundColor: ChartData?.chartColors,
      },
    ],
  };

  const plugins = [
    {
      beforeDraw: function (chart) {
        var width = chart.width,
          height = chart.height,
          ctx = chart.ctx;
        ctx.restore();
        ctx.font = "bold 1.5em proxima-nova";
        ctx.textBaseline = "top";
        var text = userBalanceDetailFormat(total_amount),
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 1.55;
        ctx.fillText(text, textX, textY);
        ctx.textBaseline = "bottom";
        ctx.font = "0.9em proxima-nova";
        var text1 = "Total JT Points",
          textX = Math.round((width - ctx.measureText(text1).width) / 2),
          textY = height / 1.65;
        ctx.fillText(text1, textX, textY);
        ctx.save();
      },
    },
  ];

  useEffect(() => {
    setRedraw(true);
    setTimeout(() => setRedraw(false), 100);
  }, [total_amount]);

  return (
    <>
      <Doughnut
        data={data}
        options={options}
        plugins={plugins}
        width={"100%"}
        height={"100%"}
        redraw={redraw}
      />
    </>
  );
};

export default WalletJTDashboardChart;
