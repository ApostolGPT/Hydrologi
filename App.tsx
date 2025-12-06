import React, { useState, useEffect } from 'react';
import { ViewState, WaterEntry } from './types';
import { EntryForm } from './components/EntryForm';
import { DataList } from './components/DataList';
import { StatsChart } from './components/StatsChart';
import { analyzeWaterData } from './services/geminiService';
import { 
  Droplet, 
  List, 
  BarChart3, 
  BrainCircuit, 
  Waves,
  Plus
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const STORAGE_KEY = 'hydrolog_data';

const App: React.FC = () => {
  const [entries, setEntries] = useState<WaterEntry[]>([]);
  const [view, setView] = useState<ViewState>('list');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse local storage data", e);
      }
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const handleSaveEntry = (newEntry: WaterEntry) => {
    setEntries(prev => [...prev, newEntry]);
    setView('list');
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту запись?')) {
      setEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleAnalyze = async () => {
    if (entries.length === 0) return;
    setIsAnalyzing(true);
    setAiAnalysis('');
    const result = await analyzeWaterData(entries);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  // Trigger analysis when switching to analysis tab if empty
  useEffect(() => {
    if (view === 'analysis' && !aiAnalysis && entries.length > 0) {
      handleAnalyze();
    }
  }, [view]);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg text-white">
              <Waves className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-none">HydroLog</h1>
              <p className="text-xs text-slate-500 font-medium">Полевой дневник</p>
            </div>
          </div>
          
          <button 
            onClick={() => setView('form')}
            className="md:hidden bg-primary text-white p-2 rounded-full shadow-lg"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {view === 'form' && (
          <EntryForm onSave={handleSaveEntry} onCancel={() => setView('list')} />
        )}

        {view === 'list' && (
          <DataList entries={entries} onDelete={handleDeleteEntry} />
        )}

        {view === 'stats' && (
          <StatsChart data={entries} />
        )}

        {view === 'analysis' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-start gap-4">
                <BrainCircuit className="w-10 h-10 mt-1 opacity-80" />
                <div>
                  <h2 className="text-xl font-bold mb-2">AI Аналитика Gemini</h2>
                  <p className="opacity-90 text-sm leading-relaxed">
                    Искусственный интеллект анализирует ваши данные по радону, pH и другим показателям, чтобы выявить потенциальные опасности и тренды.
                  </p>
                </div>
              </div>
              <button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing}
                className="mt-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/40 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                    Анализируем данные...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-4 h-4" />
                    Обновить анализ
                  </>
                )}
              </button>
            </div>

            {aiAnalysis && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 prose prose-slate max-w-none">
                <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
              </div>
            )}
             
            {!aiAnalysis && !isAnalyzing && entries.length === 0 && (
                <div className="text-center py-10 text-slate-400">
                    <p>Нет данных для анализа. Добавьте записи в журнал.</p>
                </div>
            )}
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 md:hidden z-20">
        <div className="grid grid-cols-4 h-16">
          <button 
            onClick={() => setView('list')} 
            className={`flex flex-col items-center justify-center gap-1 ${view === 'list' ? 'text-primary' : 'text-slate-400'}`}
          >
            <List className="w-5 h-5" />
            <span className="text-[10px] font-medium">Журнал</span>
          </button>
          <button 
             onClick={() => setView('form')} 
             className={`flex flex-col items-center justify-center gap-1 ${view === 'form' ? 'text-primary' : 'text-slate-400'}`}
          >
            <Plus className="w-5 h-5" />
            <span className="text-[10px] font-medium">Запись</span>
          </button>
          <button 
             onClick={() => setView('stats')} 
             className={`flex flex-col items-center justify-center gap-1 ${view === 'stats' ? 'text-primary' : 'text-slate-400'}`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px] font-medium">Графики</span>
          </button>
          <button 
             onClick={() => setView('analysis')} 
             className={`flex flex-col items-center justify-center gap-1 ${view === 'analysis' ? 'text-purple-600' : 'text-slate-400'}`}
          >
            <BrainCircuit className="w-5 h-5" />
            <span className="text-[10px] font-medium">AI Анализ</span>
          </button>
        </div>
      </nav>

      {/* Desktop Navigation (Tabs) */}
      <div className="hidden md:block fixed top-24 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur shadow-sm border border-slate-200 rounded-full p-1 px-2 z-10">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setView('list')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${view === 'list' || view === 'form' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Журнал
          </button>
          <button 
            onClick={() => setView('stats')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${view === 'stats' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Статистика
          </button>
          <button 
            onClick={() => setView('analysis')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition flex items-center gap-2 ${view === 'analysis' ? 'bg-purple-50 text-purple-700' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <BrainCircuit className="w-3 h-3" /> AI Анализ
          </button>
          <div className="w-px h-4 bg-slate-300 mx-2"></div>
          <button 
            onClick={() => setView('form')}
            className="px-3 py-1.5 bg-primary hover:bg-sky-600 text-white rounded-full text-sm font-medium transition flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-3 h-3" /> Добавить
          </button>
        </div>
      </div>

    </div>
  );
};

export default App;
