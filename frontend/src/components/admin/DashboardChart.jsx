import React from 'react';

const DashboardChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6">{title}</h3>
      <div className="h-64 flex items-end justify-between gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full bg-gray-200 rounded-t-lg relative" style={{ height: '100%' }}>
              <div
                className="absolute bottom-0 w-full bg-blue-600 rounded-t-lg transition-all duration-500"
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              >
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-medium">
                  {item.value}
                </span>
              </div>
            </div>
            <span className="mt-2 text-xs text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardChart;