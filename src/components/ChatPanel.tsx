import { useState, useRef, useEffect, useCallback } from 'react';
import { useApp, useDerivedData } from '@/context/AppContext';
import { generateId } from '@/lib/helpers';
import Badge from '@/components/Badge';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  action?: string;
  chartData?: { type: 'bar' | 'pie'; data: any[]; label?: string };
}

const SUGGESTIONS = [
  'Show low stock items',
  'Add product "Gold Watch" in Accessories',
  'Restock 50 Grey Joggers at Mumbai Warehouse',
  'Create sale order for 5 White Air Force 1 at Delhi Store',
  'Add location "Bangalore Hub" as warehouse in Bangalore',
  'Show inventory summary chart',
];

const PIE_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--success))',
  'hsl(var(--info))',
  'hsl(var(--destructive))',
  'hsl(var(--warning))',
  'hsl(38 70% 40%)',
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    role: 'assistant',
    content: "Hey Arjun 👋 I'm your StoreSync AI assistant. I can help you manage inventory, create orders, add products & locations — all through natural language. Try one of the suggestions below or type your own command!",
    timestamp: new Date(),
  },
];

export default function ChatPanel() {
  const { state, dispatch, addToast } = useApp();
  const derived = useDerivedData();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const processCommand = useCallback(
    (text: string) => {
      const lower = text.toLowerCase().trim();

      // --- Low stock query ---
      if (lower.includes('low stock') || lower.includes('stock alert')) {
        const lowItems = state.inventory.filter((i) => i.quantity <= i.threshold);
        const lines = lowItems.map((i) => {
          const p = state.products.find((pr) => pr.id === i.productId);
          const l = state.locations.find((lo) => lo.id === i.locationId);
          return `• **${p?.name}** at ${l?.name} — **${i.quantity}** units (threshold: ${i.threshold})`;
        });
        return {
          content: lowItems.length
            ? `⚠ Found **${lowItems.length}** low stock items:\n\n${lines.join('\n')}`
            : '✅ All inventory levels are healthy — no low stock alerts right now.',
          action: `Queried ${lowItems.length} low stock items`,
        };
      }

      // --- Inventory summary chart ---
      if (lower.includes('summary') || lower.includes('chart') || lower.includes('overview')) {
        const catMap: Record<string, number> = {};
        state.inventory.forEach((i) => {
          const p = state.products.find((pr) => pr.id === i.productId);
          if (p) catMap[p.category] = (catMap[p.category] || 0) + i.quantity;
        });
        const chartData = Object.entries(catMap).map(([name, value]) => ({ name, value }));

        const locData = state.locations.map((l) => {
          const total = state.inventory.filter((i) => i.locationId === l.id).reduce((s, i) => s + i.quantity, 0);
          return { name: l.name.split(' ')[0], stock: total };
        });

        return {
          content: `📊 Here's your current inventory breakdown:\n\n• **${derived.totalSKUs}** SKUs across **${state.locations.length}** locations\n• **${derived.totalStock.toLocaleString()}** total units in stock\n• **${derived.lowStockCount}** low stock alerts`,
          chartData: { type: 'pie' as const, data: chartData, label: 'Stock by Category' },
          action: 'Generated inventory summary',
        };
      }

      // --- Add product ---
      const addProdMatch = lower.match(/add\s+product\s+["""]?(.+?)["""]?\s+(?:in|under|category)\s+(.+)/i);
      if (addProdMatch) {
        const name = addProdMatch[1].trim().replace(/^[""]|[""]$/g, '');
        const category = addProdMatch[2].trim();
        const sku = name.split(' ').map((w: string) => w[0]?.toUpperCase()).join('').slice(0, 2) + '-' + Math.random().toString(36).slice(2, 5).toUpperCase();
        const newProduct = { id: generateId('p'), name, sku, category: category.charAt(0).toUpperCase() + category.slice(1) };
        dispatch({ type: 'ADD_PRODUCT', product: newProduct });
        addToast('success', `Product "${name}" added`);
        return {
          content: `✅ Product added successfully!\n\n• **Name:** ${name}\n• **SKU:** \`${sku}\`\n• **Category:** ${category}\n\nYou can now add inventory for this product at any location.`,
          action: `Added product: ${name}`,
        };
      }

      // --- Add location ---
      const addLocMatch = lower.match(/add\s+location\s+["""]?(.+?)["""]?\s+(?:as|type)\s+(warehouse|store|online)\s+(?:in|at|city)\s+(.+)/i);
      if (addLocMatch) {
        const name = addLocMatch[1].trim().replace(/^[""]|[""]$/g, '');
        const type = addLocMatch[2].trim() as 'warehouse' | 'store' | 'online';
        const city = addLocMatch[3].trim();
        const newLoc = { id: generateId('loc'), name, type, city: city.charAt(0).toUpperCase() + city.slice(1) };
        dispatch({ type: 'ADD_LOCATION', location: newLoc });
        addToast('success', `Location "${name}" added`);
        return {
          content: `📍 Location added!\n\n• **Name:** ${name}\n• **Type:** ${type}\n• **City:** ${city}\n\nYou can now assign inventory to this location.`,
          action: `Added location: ${name}`,
        };
      }

      // --- Restock ---
      const restockMatch = lower.match(/restock\s+(\d+)\s+(.+?)\s+(?:at|in|to)\s+(.+)/i);
      if (restockMatch) {
        const qty = parseInt(restockMatch[1]);
        const prodName = restockMatch[2].trim();
        const locName = restockMatch[3].trim();
        const product = state.products.find((p) => p.name.toLowerCase().includes(prodName.toLowerCase()));
        const location = state.locations.find((l) => l.name.toLowerCase().includes(locName.toLowerCase()));
        if (!product) return { content: `❌ Could not find a product matching "${prodName}". Check your product catalog and try again.` };
        if (!location) return { content: `❌ Could not find a location matching "${locName}". Check your locations and try again.` };

        const inv = state.inventory.find((i) => i.productId === product.id && i.locationId === location.id);
        const newQty = (inv?.quantity || 0) + qty;
        dispatch({ type: 'UPDATE_INVENTORY', productId: product.id, locationId: location.id, quantity: newQty });
        const order = { id: generateId('ord'), productId: product.id, locationId: location.id, type: 'restock' as const, quantity: qty, source: 'ai' as const, note: 'Restocked via AI chat', timestamp: new Date() };
        dispatch({ type: 'CREATE_ORDER', order });
        addToast('success', `Restocked ${qty} units of ${product.name}`);
        return {
          content: `📦 Restock complete!\n\n• **Product:** ${product.name}\n• **Location:** ${location.name}\n• **Added:** +${qty} units\n• **New Total:** ${newQty} units\n\nOrder \`${order.id}\` created.`,
          action: `Restocked ${qty}× ${product.name}`,
        };
      }

      // --- Create sale order ---
      const saleMatch = lower.match(/(?:create|make|record)\s+(?:a\s+)?sale\s+(?:order\s+)?(?:for\s+)?(\d+)\s+(.+?)\s+(?:at|in|from)\s+(.+)/i);
      if (saleMatch) {
        const qty = parseInt(saleMatch[1]);
        const prodName = saleMatch[2].trim();
        const locName = saleMatch[3].trim();
        const product = state.products.find((p) => p.name.toLowerCase().includes(prodName.toLowerCase()));
        const location = state.locations.find((l) => l.name.toLowerCase().includes(locName.toLowerCase()));
        if (!product) return { content: `❌ Product "${prodName}" not found.` };
        if (!location) return { content: `❌ Location "${locName}" not found.` };

        const inv = state.inventory.find((i) => i.productId === product.id && i.locationId === location.id);
        const currentQty = inv?.quantity || 0;
        if (currentQty < qty) return { content: `⚠ Insufficient stock! **${product.name}** at ${location.name} only has **${currentQty}** units. Cannot sell ${qty}.` };

        dispatch({ type: 'UPDATE_INVENTORY', productId: product.id, locationId: location.id, quantity: currentQty - qty });
        const order = { id: generateId('ord'), productId: product.id, locationId: location.id, type: 'sale' as const, quantity: qty, source: 'ai' as const, note: 'Sale via AI chat', timestamp: new Date() };
        dispatch({ type: 'CREATE_ORDER', order });
        addToast('success', `Sale recorded: ${qty}× ${product.name}`);
        return {
          content: `💰 Sale recorded!\n\n• **Product:** ${product.name}\n• **Location:** ${location.name}\n• **Sold:** ${qty} units\n• **Remaining:** ${currentQty - qty} units\n\nOrder \`${order.id}\` created.`,
          action: `Sold ${qty}× ${product.name}`,
        };
      }

      // --- Stock check for specific product ---
      const checkMatch = lower.match(/(?:check|show|get|what'?s?|how much)\s+(?:stock|inventory)\s+(?:for|of)\s+(.+)/i);
      if (checkMatch) {
        const prodName = checkMatch[1].trim();
        const product = state.products.find((p) => p.name.toLowerCase().includes(prodName.toLowerCase()));
        if (!product) return { content: `❌ Product "${prodName}" not found.` };

        const items = state.inventory.filter((i) => i.productId === product.id);
        const barData = items.map((i) => {
          const loc = state.locations.find((l) => l.id === i.locationId);
          return { name: loc?.name.split(' ')[0] || '', qty: i.quantity, threshold: i.threshold };
        });
        const lines = items.map((i) => {
          const loc = state.locations.find((l) => l.id === i.locationId);
          const status = i.quantity <= i.threshold ? '🔴' : '🟢';
          return `${status} **${loc?.name}** — ${i.quantity} units`;
        });

        return {
          content: `📋 Stock for **${product.name}** (\`${product.sku}\`):\n\n${lines.join('\n')}`,
          chartData: { type: 'bar' as const, data: barData, label: `${product.name} Stock` },
          action: `Checked stock: ${product.name}`,
        };
      }

      // --- Help / fallback ---
      return {
        content: `I can help you with:\n\n• **"Show low stock items"** — view all items below threshold\n• **"Add product \\"Name\\" in Category"** — add a new product\n• **"Restock 50 [product] at [location]"** — restock inventory\n• **"Create sale order for 5 [product] at [location]"** — record a sale\n• **"Add location \\"Name\\" as warehouse in City"** — add location\n• **"Check stock for [product]"** — view product stock\n• **"Show inventory summary"** — see charts & stats\n\nTry being specific with product and location names!`,
      };
    },
    [state, derived, dispatch, addToast]
  );

  const handleSend = useCallback(
    (text?: string) => {
      const msg = (text || input).trim();
      if (!msg) return;
      setInput('');

      addMessage({ id: generateId('msg'), role: 'user', content: msg, timestamp: new Date() });
      setIsTyping(true);

      setTimeout(() => {
        const result = processCommand(msg);
        addMessage({
          id: generateId('msg'),
          role: 'assistant',
          content: result.content,
          timestamp: new Date(),
          action: result.action,
          chartData: result.chartData,
        });
        setIsTyping(false);
      }, 600 + Math.random() * 400);
    },
    [input, addMessage, processCommand]
  );

  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      let html = line
        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>')
        .replace(/`(.+?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-primary">$1</code>');
      if (line.startsWith('• ')) {
        html = html.replace('• ', '');
        return <div key={i} className="flex gap-2 ml-1"><span className="text-primary mt-0.5 text-xs">▸</span><span dangerouslySetInnerHTML={{ __html: html }} /></div>;
      }
      return <div key={i} dangerouslySetInnerHTML={{ __html: html }} />;
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => { setIsOpen(true); setTimeout(() => inputRef.current?.focus(), 100); }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
      >
        <span className="text-xl">🤖</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-6rem)] flex flex-col bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-modal-enter">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="text-lg">🤖</span>
          </div>
          <div>
            <div className="font-mono font-bold text-sm text-foreground">StoreSync AI</div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] text-muted-foreground font-mono">ONLINE</span>
            </div>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors text-lg leading-none p-1">✕</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${msg.role === 'user'
              ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5'
              : 'bg-elevated border border-border rounded-2xl rounded-bl-md px-4 py-3'
            }`}>
              <div className={`text-sm leading-relaxed space-y-1 ${msg.role === 'assistant' ? 'text-muted-foreground' : ''}`}>
                {msg.role === 'assistant' ? renderMarkdown(msg.content) : msg.content}
              </div>
              {msg.action && (
                <div className="mt-2 pt-2 border-t border-border">
                  <Badge type="ai">{msg.action}</Badge>
                </div>
              )}
              {msg.chartData && (
                <div className="mt-3 bg-background/50 rounded-lg p-3 border border-border">
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">{msg.chartData.label}</div>
                  {msg.chartData.type === 'bar' ? (
                    <ResponsiveContainer width="100%" height={140}>
                      <BarChart data={msg.chartData.data}>
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <ReTooltip
                          contentStyle={{ background: 'hsl(var(--elevated))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                          labelStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Bar dataKey="qty" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="threshold" fill="hsl(var(--destructive) / 0.3)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie data={msg.chartData.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} strokeWidth={2} stroke="hsl(var(--background))">
                          {msg.chartData.data.map((_, idx) => (
                            <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <ReTooltip
                          contentStyle={{ background: 'hsl(var(--elevated))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              )}
              <div className={`text-[10px] mt-1.5 font-mono tabular-nums ${msg.role === 'user' ? 'text-primary-foreground/50' : 'text-muted-foreground/50'}`}>
                {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-elevated border border-border rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1.5 items-center h-5">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Try these commands</div>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="text-[11px] px-2.5 py-1.5 bg-elevated border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors truncate max-w-full"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-border bg-background">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Type a command…"
            className="flex-1 bg-elevated border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none font-mono"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
