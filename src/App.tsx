import { useEffect, useState } from 'react';
import { MobileNav } from './components/layout/MobileNav';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import type { PageId } from './components/layout/navItems';
import { Calendar } from './pages/Calendar';
import { Dashboard } from './pages/Dashboard';
import { Goals } from './pages/Goals';
import { Reports } from './pages/Reports';
import { Routine } from './pages/Routine';
import { Settings } from './pages/Settings';
import { Skills } from './pages/Skills';
import { Vocabulary } from './pages/Vocabulary';
import { useStudyData } from './hooks/useStudyData';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const {
    data,
    metrics,
    recommendations,
    saveSession,
    deleteSession,
    saveVocabulary,
    deleteVocabulary,
    saveGoal,
    deleteGoal,
    updateSettings,
    updateSupabaseConnection,
    syncState,
    signUpWithSupabase,
    signInWithSupabase,
    signOutFromSupabase,
    syncToCloud,
    loadFromCloud,
    importData,
    resetData,
  } = useStudyData();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', data.settings.darkMode);
  }, [data.settings.darkMode]);

  function renderPage() {
    switch (activePage) {
      case 'routine':
        return <Routine sessions={data.sessions} onSave={saveSession} onDelete={deleteSession} />;
      case 'skills':
        return <Skills metrics={metrics} />;
      case 'vocabulary':
        return <Vocabulary words={data.vocabulary} onSave={saveVocabulary} onDelete={deleteVocabulary} />;
      case 'goals':
        return <Goals goals={data.goals} onSave={saveGoal} onDelete={deleteGoal} />;
      case 'reports':
        return <Reports metrics={metrics} vocabularyCount={data.vocabulary.length} recommendations={recommendations} />;
      case 'calendar':
        return <Calendar sessions={data.sessions} dailyGoal={data.settings.dailyMinuteGoal} />;
      case 'settings':
        return (
          <Settings
            data={data}
            syncState={syncState}
            onUpdateSettings={updateSettings}
            onUpdateSupabaseConnection={updateSupabaseConnection}
            onSignUp={signUpWithSupabase}
            onSignIn={signInWithSupabase}
            onSignOut={signOutFromSupabase}
            onSyncToCloud={syncToCloud}
            onLoadFromCloud={loadFromCloud}
            onImport={importData}
            onReset={resetData}
          />
        );
      default:
        return <Dashboard data={data} metrics={metrics} recommendations={recommendations} />;
    }
  }

  return (
    <div className="min-h-screen bg-mist text-slate-700 transition dark:bg-slate-950 dark:text-slate-200">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="lg:pl-72">
        <Topbar
          userName={data.settings.userName}
          streak={metrics.currentStreak}
          darkMode={data.settings.darkMode}
          onToggleDarkMode={() => updateSettings({ ...data.settings, darkMode: !data.settings.darkMode })}
        />
        <main className="mx-auto max-w-7xl px-4 py-6 pb-28 lg:px-8 lg:pb-10">{renderPage()}</main>
      </div>
      <MobileNav activePage={activePage} onNavigate={setActivePage} />
    </div>
  );
}
