import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { WaterEntry } from '../types';

interface StatsChartProps {
  data: WaterEntry[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm z-50">
        <p className="font-semibold text-slate-700 mb-2">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }} className="text-xs mb-1">
            <span className="font-medium">{p.name}:</span> {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const StatsChart: React.FC<StatsChartProps> = ({ data }) => {
  // Sort data by date just in case
  const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);
  
  const chartData = sortedData.map(entry => ({
    date: new Date(entry.date).toLocaleDateString(),
    pH: entry.ph,
    Radon: entry.radon,
    TDS: entry.tds,
    WaterTemp: entry.temperature,
    AirTemp: entry.airTemperature || 0,
    Humidity: entry.humidity || 0,
    Pressure: entry.pressure || 0
  }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
        <p className="text-slate-400">Нет данных для отображения графика</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Температура (Вода vs Воздух)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickMargin={10} />
              <YAxis stroke="#64748b" fontSize={12} label={{ value: '°C', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="WaterTemp" name="Т. Воды" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="AirTemp" name="Т. Воздуха" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Метеоусловия (Влажность и Давление)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickMargin={10} />
              <YAxis yAxisId="left" stroke="#8b5cf6" fontSize={12} label={{ value: '%', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} domain={['auto', 'auto']} label={{ value: 'mmHg', angle: 90, position: 'insideRight' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="Humidity" name="Влажность %" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
              <Line yAxisId="right" type="monotone" dataKey="Pressure" name="Давление" stroke="#94a3b8" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Радон-222 (Bq/L) и pH</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickMargin={10} />
              <YAxis yAxisId="radon" stroke="#ef4444" fontSize={12} />
              <YAxis yAxisId="ph" orientation="right" stroke="#10b981" fontSize={12} domain={[0, 14]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line yAxisId="radon" type="monotone" dataKey="Radon" name="Радон-222" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
              <Line yAxisId="ph" type="monotone" dataKey="pH" name="pH" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};