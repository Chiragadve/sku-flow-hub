import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

export default function LoginPage() {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [email] = useState('arjun@storesync.in');
  const [password] = useState('••••••••');

  const handleLogin = () => {
    dispatch({ type: 'LOGIN' });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-background flex-col justify-between p-12 relative overflow-hidden">
        {/* Grid decoration */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-0.5 mb-20">
            <span className="font-mono font-bold text-2xl text-primary">STORE</span>
            <span className="font-mono font-bold text-2xl text-foreground">SYNC</span>
          </div>
        </div>

        <div className="relative z-10">
          <blockquote className="font-mono text-2xl md:text-3xl text-foreground leading-relaxed mb-6">
            "Inventory clarity<br />at the speed<br />of retail."
          </blockquote>
          <div className="w-16 h-0.5 bg-primary mb-4" />
          <p className="text-muted-foreground text-sm">Built for operations teams that move fast.</p>
        </div>

        {/* Abstract lines */}
        <div className="relative z-10 flex gap-1">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="w-1 bg-primary/10 rounded-full" style={{ height: `${20 + Math.sin(i * 0.5) * 30}px` }} />
          ))}
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 bg-card flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-0.5 mb-10">
            <span className="font-mono font-bold text-2xl text-primary">STORE</span>
            <span className="font-mono font-bold text-2xl text-foreground">SYNC</span>
          </div>

          <h2 className="font-mono font-bold text-2xl text-foreground mb-2">Welcome back</h2>
          <p className="text-muted-foreground text-sm mb-8">Sign in to your StoreSync workspace</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full px-4 py-3 bg-elevated border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                readOnly
                className="w-full px-4 py-3 bg-elevated border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors text-sm"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity mt-2"
            >
              Sign In
            </button>
          </div>

          <p className="text-center text-muted-foreground text-xs mt-6">
            Don't have an account? Contact your admin.
          </p>
        </div>
      </div>
    </div>
  );
}
