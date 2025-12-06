import React from 'react';
import * as XLSX from 'xlsx';
import { WaterEntry } from '../types';
import { Download, Trash2, FileSpreadsheet, AlertTriangle, CloudSun } from 'lucide-react';

interface DataListProps {
  entries: WaterEntry[];
  onDelete: (id: string) => void;
}

export const DataList: React.FC<DataListProps> = ({ entries, onDelete }) => {
  const exportToExcel = () => {
    if (entries.length === 0) return;

    // Format data for Excel
    const excelData = entries.map(e => ({
      "Дата": new Date(e.date).toLocaleDateString(),
      "Время": new Date(e.date).toLocaleTimeString(),
      "Название объекта": e.locationName,
      "Температура воды (°C)": e.temperature,
      "pH": e.ph,
      "TDS (ppm)": e.tds,
      "Радон-222 (Bq/L)": e.radon,
      "Т воздуха (°C)": e.airTemperature || '-',
      "Влажность (%)": e.humidity || '-',
      "Давление (мм рт.ст.)": e.pressure || '-',
      "Примечания": e.notes
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Полевой дневник");
    
    // Generate filename with date
    const dateStr = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `HydroLog_Export_${dateStr}.xlsx`);
  };

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-white rounded-xl shadow-sm border border-slate-100">
        <FileSpreadsheet className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-lg font-medium">Журнал пуст</p>
        <p className="text-sm">Добавьте первую запись, чтобы начать работу.</p>
      </div>
    );
  }

  // Helper to determine if Radon is high
  const getRadonStyle = (val: number) => {
    if (val > 60) return "text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded";
    if (val > 20) return "text-orange-600 font-medium";
    return "text-slate-700";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2">
           <span className="font-bold text-slate-700 text-lg">{entries.length}</span>
           <span className="text-slate-500">записей всего</span>
        </div>
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow-sm transition font-medium text-sm"
        >
          <Download className="w-4 h-4" />
          Экспорт в Excel
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 font-semibold">Дата</th>
                <th className="px-4 py-3 font-semibold">Объект</th>
                <th className="px-4 py-3 font-semibold text-center text-blue-600">Т.Воды</th>
                <th className="px-4 py-3 font-semibold text-center text-blue-600">pH</th>
                <th className="px-4 py-3 font-semibold text-center text-blue-600">Rn-222</th>
                <th className="px-4 py-3 font-semibold text-center text-slate-600 border-l border-slate-200">Т.Воздуха</th>
                <th className="px-4 py-3 font-semibold text-center text-slate-600">Влажн.</th>
                <th className="px-4 py-3 font-semibold text-center text-slate-600">Давл.</th>
                <th className="px-4 py-3 font-semibold text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.slice().reverse().map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                    {new Date(entry.date).toLocaleDateString()}
                    <div className="text-xs text-slate-400">{new Date(entry.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-800">
                    {entry.locationName}
                    {entry.notes && (
                        <div className="text-xs text-slate-400 truncate max-w-[100px]" title={entry.notes}>{entry.notes}</div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center text-slate-600">{entry.temperature}°C</td>
                  <td className="px-4 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded ${entry.ph < 6.5 || entry.ph > 8.5 ? 'bg-yellow-100 text-yellow-700' : 'text-slate-600'}`}>
                        {entry.ph}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={getRadonStyle(entry.radon)}>{entry.radon}</span>
                    {entry.radon > 60 && <AlertTriangle className="w-3 h-3 text-red-500 inline ml-1" />}
                  </td>
                  
                  {/* Meteo Data */}
                  <td className="px-4 py-4 text-center text-slate-500 border-l border-slate-100">
                    {entry.airTemperature !== undefined ? `${entry.airTemperature}°C` : '-'}
                  </td>
                  <td className="px-4 py-4 text-center text-slate-500">
                     {entry.humidity !== undefined ? `${entry.humidity}%` : '-'}
                  </td>
                   <td className="px-4 py-4 text-center text-slate-500">
                     {entry.pressure !== undefined ? entry.pressure : '-'}
                  </td>

                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => onDelete(entry.id)}
                      className="text-slate-400 hover:text-red-500 transition p-1 rounded-md hover:bg-red-50"
                      title="Удалить запись"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};