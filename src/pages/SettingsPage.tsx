import { useState } from 'react';
import { useApp } from '@/context/AppContext';

export default function SettingsPage() {
  const { state, dispatch, addToast } = useApp();
  const [tab, setTab] = useState('profile');
  const [name, setName] = useState(state.currentUser.name);
  const [email, setEmail] = useState(state.currentUser.email);

  const tabs = ['Profile', 'Notifications', 'Thresholds', 'Appearance'];

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="font-mono font-bold text-xl text-foreground">Settings</h2>

      <div className="flex border-b border-border gap-1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t.toLowerCase())}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.toLowerCase() ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        {tab === 'profile' && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-primary font-mono font-bold text-xl">AM</div>
              <div>
                <div className="text-foreground font-semibold">{state.currentUser.name}</div>
                <button className="text-xs text-primary hover:underline">Change Avatar</button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 bg-elevated border border-border rounded-lg text-foreground text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 bg-elevated border border-border rounded-lg text-foreground text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Role</label>
              <span className="inline-flex items-center px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-mono">{state.currentUser.role}</span>
            </div>
            <button onClick={() => addToast('success', 'Settings saved')} className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm">Save Changes</button>
          </div>
        )}

        {tab === 'notifications' && (
          <div className="space-y-4">
            {[
              { key: 'lowStock', label: 'Low stock alerts' },
              { key: 'orderConfirmations', label: 'Order confirmations' },
              { key: 'dailySummary', label: 'Daily summary email' },
              { key: 'aiActions', label: 'AI action notifications' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between py-2">
                <span className="text-sm text-foreground">{label}</span>
                <button
                  onClick={() => dispatch({ type: 'UPDATE_SETTINGS', settings: { notifications: { ...state.settings.notifications, [key]: !state.settings.notifications[key as keyof typeof state.settings.notifications] } } })}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    state.settings.notifications[key as keyof typeof state.settings.notifications] ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-foreground transition-transform ${
                    state.settings.notifications[key as keyof typeof state.settings.notifications] ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'thresholds' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Global default threshold</label>
              <input
                type="number"
                value={state.settings.defaultThreshold}
                onChange={(e) => dispatch({ type: 'UPDATE_SETTINGS', settings: { defaultThreshold: parseInt(e.target.value) || 0 } })}
                className="w-32 px-3 py-2 bg-elevated border border-border rounded-lg text-foreground text-sm font-mono focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <h4 className="text-sm text-foreground font-semibold mb-3">Category overrides</h4>
              <div className="space-y-2">
                {[...new Set(state.products.map((p) => p.category))].map((cat) => (
                  <div key={cat} className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">{cat}</span>
                    <input type="number" defaultValue={state.settings.defaultThreshold} className="w-20 px-2 py-1 bg-elevated border border-border rounded text-foreground text-sm font-mono text-center focus:border-primary focus:outline-none" />
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => addToast('success', 'Thresholds applied')} className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm">Apply to All</button>
          </div>
        )}

        {tab === 'appearance' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm text-foreground font-semibold mb-3">Theme</h4>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 px-4 py-2.5 bg-elevated border-2 border-primary rounded-lg cursor-pointer">
                  <input type="radio" checked readOnly className="accent-primary" />
                  <span className="text-sm text-foreground">Dark</span>
                </label>
              </div>
            </div>
            <div>
              <h4 className="text-sm text-foreground font-semibold mb-3">Accent Color</h4>
              <div className="flex gap-3">
                {[
                  { name: 'amber', color: 'bg-amber-500' },
                  { name: 'blue', color: 'bg-blue-500' },
                  { name: 'green', color: 'bg-emerald-500' },
                  { name: 'purple', color: 'bg-purple-500' },
                ].map((c) => (
                  <button key={c.name} onClick={() => dispatch({ type: 'UPDATE_SETTINGS', settings: { accentColor: c.name } })} className={`w-10 h-10 rounded-lg ${c.color} ${state.settings.accentColor === c.name ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background' : 'opacity-60 hover:opacity-100'} transition-all`} />
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm text-foreground font-semibold mb-3">Density</h4>
              <div className="flex border border-border rounded-lg overflow-hidden">
                {(['comfortable', 'compact'] as const).map((d) => (
                  <button key={d} onClick={() => dispatch({ type: 'UPDATE_SETTINGS', settings: { density: d } })} className={`flex-1 py-2 text-sm font-semibold capitalize transition-colors ${state.settings.density === d ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>{d}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
