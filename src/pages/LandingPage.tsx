import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-12 py-5 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-0.5">
          <span className="font-mono font-bold text-xl text-primary">STORE</span>
          <span className="font-mono font-bold text-xl text-foreground">SYNC</span>
        </div>
        <button onClick={() => navigate('/login')} className="px-4 py-2 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-muted transition-colors text-sm">
          Sign In
        </button>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 grid-pattern">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8">
            <span className="text-primary text-sm font-mono">◈ RETAIL INTELLIGENCE PLATFORM</span>
          </div>
          <h1 className="font-mono font-bold text-4xl md:text-6xl lg:text-7xl leading-tight mb-6">
            Every SKU.<br />Every Store.<br />
            <span className="text-primary">One View.</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            StoreSync gives retail operations teams real-time visibility across every warehouse, store, and online channel — in one unified dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/login')} className="px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity text-base">
              Get Started →
            </button>
            <button onClick={() => navigate('/dashboard')} className="px-8 py-3.5 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-muted transition-colors text-base">
              View Demo
            </button>
          </div>
        </div>

        {/* Mock Dashboard Preview */}
        <div className="mt-16 w-full max-w-4xl mx-auto animate-fade-up">
          <div className="bg-card border border-border rounded-xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-primary/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
              <span className="ml-3 text-xs text-muted-foreground font-mono">storesync.app/dashboard</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Total SKUs', value: '8', color: 'text-primary' },
                { label: 'Total Stock', value: '1,247', color: 'text-foreground' },
                { label: 'Low Stock', value: '7', color: 'text-destructive' },
                { label: 'Orders Today', value: '15', color: 'text-success' },
              ].map((s) => (
                <div key={s.label} className="bg-secondary rounded-lg p-3">
                  <div className={`font-mono font-bold text-xl ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              {[75, 45, 90, 30, 60, 85].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-secondary rounded-sm overflow-hidden h-16">
                    <div className="w-full bg-primary/60 rounded-sm" style={{ height: `${h}%`, marginTop: `${100 - h}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">P{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { value: '15,000+', label: 'SKUs managed across all stores' },
            { value: '3 min', label: 'Average restock response time' },
            { value: '99.9%', label: 'Inventory accuracy rate' },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-mono font-bold text-4xl md:text-5xl text-primary mb-2">{s.value}</div>
              <div className="text-muted-foreground text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-mono font-bold text-2xl md:text-3xl text-center mb-12">Built for modern retail</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '⚡', title: 'Real-time Sync', body: 'Inventory updates across all locations the moment a sale or restock happens.' },
              { icon: '🤖', title: 'AI-Powered', body: 'Natural language commands to query stock, trigger orders, and get forecasts.' },
              { icon: '📍', title: 'Multi-location', body: 'Manage warehouses, physical stores, and online channels from one place.' },
            ].map((f) => (
              <div key={f.title} className="group bg-card border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 card-hover">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl mb-4">{f.icon}</div>
                <h3 className="font-mono font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-primary/5 border-t border-primary/20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-mono font-bold text-2xl md:text-3xl text-foreground mb-3">Ready to unify your inventory?</h2>
          <p className="text-muted-foreground mb-8">Start free. No credit card required.</p>
          <button onClick={() => navigate('/login')} className="px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity">
            Launch Dashboard →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-0.5">
            <span className="font-mono font-bold text-sm text-primary">STORE</span>
            <span className="font-mono font-bold text-sm text-foreground">SYNC</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">Features</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Pricing</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Docs</span>
          </div>
          <div className="text-xs text-muted-foreground">© 2026 StoreSync. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
