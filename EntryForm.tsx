import React, { useState } from 'react';
import { WaterEntry } from './types';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Save, MapPin, Thermometer, Droplet, Activity, Zap, CloudSun, Wind, Gauge } from 'lucide-react';

interface EntryFormProps {
  onSave: (entry: WaterEntry) => void;
  onCancel: () => void;
}

export const EntryForm: React.FC<EntryFormProps> = ({ onSave, onCancel }) => {
  const [activeTab, setActiveTab] = useState<'water' | 'meteo'>('water');
  const [formData, setFormData] = useState<Partial<WaterEntry>>({
    date: new Date().toISOString().slice(0, 16),
    locationName: '',
    temperature: 0,
    ph: 7.0,
    tds: 0,
    radon: 0,
    airTemperature: 0,
    humidity: 0,
    pressure: 760,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.locationName) {
      alert('Пожалуйста, укажите название водного объекта');
      return;
    }

    const newEntry: WaterEntry = {
      id: uuidv4(),
      date: formData.date || new Date().toISOString(),
      locationName: formData.locationName || 'Unknown',
      temperature: Number(formData.temperature),
      ph: Number(formData.ph),
      tds: Number(formData.tds),
      radon: Number(formData.radon),
      airTemperature: formData.airTemperature !== undefined ? Number(formData.airTemperature) : undefined,
      humidity: formData.humidity !== undefined ? Number(formData.humidity) : undefined,
      pressure: formData.pressure !== undefined ? Number(formData.pressure) : undefined,
      notes: formData.notes,
      timestamp: new Date(formData.date || Date.now()).getTime(),
    };

    onSave(newEntry);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden flex flex-col h-full">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Новая запись
        </h2>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Common Fields: Location & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
              <MapPin className="w-4 h-4" /> Название объекта
            </label>
            <input
              type="text"
              name="locationName"
              value={formData.locationName}
              onChange={handleChange}
              placeholder="Р. Волга, точка №5"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Дата и время</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
              required
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('water')}
            className={`flex-1 pb-3 text-sm font-medium transition relative ${
              activeTab === 'water' 
                ? 'text-primary' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Droplet className="w-4 h-4" />
              Показатели воды
            </span>
            {activeTab === 'water' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('meteo')}
            className={`flex-1 pb-3 text-sm font-medium transition relative ${
              activeTab === 'meteo' 
                ? 'text-sky-600' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <CloudSun className="w-4 h-4" />
              Метеоусловия
            </span>
            {activeTab === 'meteo' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-600 rounded-t-full" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[280px]">
          {activeTab === 'water' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                    <Thermometer className="w-4 h-4 text-orange-500" /> Tемпература воды (°C)
                  </label>
                  <input
                    type="number"
                    name="temperature"
                    step="0.1"
                    value={formData.temperature}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                    <Droplet className="w-4 h-4 text-blue-500" /> pH Уровень
                  </label>
                  <input
                    type="number"
                    name="ph"
                    step="0.01"
                    min="0"
                    max="14"
                    value={formData.ph}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                    <Zap className="w-4 h-4 text-yellow-600" /> EC TDS (ppm)
                  </label>
                  <input
                    type="number"
                    name="tds"
                    step="1"
                    value={formData.tds}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                    <Activity className="w-4 h-4 text-red-500" /> Радон-222 (Bq/L)
                  </label>
                  <input
                    type="number"
                    name="radon"
                    step="0.1"
                    value={formData.radon}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                  />
                  <p className="text-xs text-slate-500 mt-1">Норма для питьевой воды: &lt;60 Bq/L</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'meteo' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                    <Thermometer className="w-4 h-4 text-slate-500" /> Tемпература воздуха (°C)
                  </label>
                  <input
                    type="number"
                    name="airTemperature"
                    step="0.1"
                    value={formData.airTemperature}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                    <Wind className="w-4 h-4 text-slate-500" /> Влажность воздуха (%)
                  </label>
                  <input
                    type="number"
                    name="humidity"
                    step="1"
                    min="0"
                    max="100"
                    value={formData.humidity}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                    <Gauge className="w-4 h-4 text-slate-500" /> Атм. давление (мм рт.ст.)
                  </label>
                  <input
                    type="number"
                    name="pressure"
                    step="1"
                    value={formData.pressure}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100">
           <label className="block text-sm font-medium text-slate-700 mb-1">Примечания</label>
            <textarea
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Дополнительные наблюдения..."
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            />
        </div>
      </div>

      <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-3 mt-auto">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-200 transition font-medium"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-primary hover:bg-sky-600 text-white rounded-lg shadow-md transition flex items-center gap-2 font-medium"
        >
          <Save className="w-4 h-4" />
          Сохранить
        </button>
      </div>
    </form>
  );
};