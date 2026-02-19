import { useState, useMemo } from 'react';
import { useApp, useDerivedData } from '@/context/AppContext';
import { timeAgo, formatDate, generateId } from '@/lib/helpers';
import Badge from '@/components/Badge';
import EmptyState from '@/components/EmptyState';
import Modal from '@/components/Modal';

export default function OrdersPage() {
  const { state, dispatch, addToast } = useApp();
  const derived = useDerivedData();
  const [typeFilter, setTypeFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOrder, setViewOrder] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const now = Date.now();
    return state.orders.filter((o) => {
      if (typeFilter !== 'all' && o.type !== typeFilter) return false;
      if (sourceFilter !== 'all' && o.source !== sourceFilter) return false;
      if (search) {
        const product = state.products.find((p) => p.id === o.productId);
        if (!product?.name.toLowerCase().includes(search.toLowerCase())) return false;
      }
      if (dateFilter === 'today') return now - o.timestamp.getTime() < 86400000;
      if (dateFilter === '7d') return now - o.timestamp.getTime() < 604800000;
      if (dateFilter === '30d') return now - o.timestamp.getTime() < 2592000000;
      return true;
    });
  }, [state.orders, state.products, typeFilter, sourceFilter, search, dateFilter]);

  const stats = [
    { label: 'Total Orders', value: state.orders.length },
    { label: 'Sales Today', value: derived.salesToday },
    { label: 'Restocks Today', value: derived.restocksToday },
  ];

  const selectedOrder = viewOrder ? state.orders.find((o) => o.id === viewOrder) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-mono font-bold text-xl text-foreground">Orders</h2>
        <button onClick={() => setCreateOpen(true)} className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm">Create Order</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</span>
            <div className="font-mono font-bold text-2xl text-foreground tabular-nums mt-1">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-3">
        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="px-3 py-2 bg-elevated border border-border rounded-lg text-foreground text-sm focus:border-primary focus:outline-none">
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 bg-elevated border border-border rounded-lg text-foreground text-sm focus:border-primary focus:outline-none">
          <option value="all">All Types</option>
          <option value="sale">Sale</option>
          <option value="restock">Restock</option>
          <option value="transfer">Transfer</option>
        </select>
        <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="px-3 py-2 bg-elevated border border-border rounded-lg text-foreground text-sm focus:border-primary focus:outline-none">
          <option value="all">All Sources</option>
          <option value="manual">Manual</option>
          <option value="ai">AI</option>
        </select>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search product..." className="flex-1 min-w-[160px] px-3 py-2 bg-elevated border border-border rounded-lg text-foreground text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="↗" title="No orders found" subtitle="Try adjusting your filters or create a new order" action={{ label: 'Create Order', onClick: () => setCreateOpen(true) }} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Order ID', 'Product', 'Location', 'Type', 'Qty', 'Source', 'Note', 'Time', 'Actions'].map((h) => (
                  <th key={h} className="text-left py-3 px-3 text-xs text-muted-foreground uppercase tracking-wider font-mono">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const product = state.products.find((p) => p.id === order.productId);
                const location = state.locations.find((l) => l.id === order.locationId);
                return (
                  <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-3 font-mono text-xs text-muted-foreground">{order.id.slice(0, 10)}</td>
                    <td className="py-3 px-3 text-sm text-foreground">{product?.name}</td>
                    <td className="py-3 px-3 text-sm text-muted-foreground">{location?.name}</td>
                    <td className="py-3 px-3"><Badge type={order.type}>{order.type}</Badge></td>
                    <td className="py-3 px-3 font-mono text-sm tabular-nums text-foreground">
                      {order.type === 'sale' ? '↓' : order.type === 'restock' ? '↑' : '↔'} {order.quantity}
                    </td>
                    <td className="py-3 px-3"><Badge type={order.source}>{order.source}</Badge></td>
                    <td className="py-3 px-3 text-xs text-muted-foreground max-w-[150px] truncate" title={order.note}>{order.note}</td>
                    <td className="py-3 px-3 text-xs text-muted-foreground font-mono" title={formatDate(order.timestamp)}>{timeAgo(order.timestamp)}</td>
                    <td className="py-3 px-3">
                      <button onClick={() => setViewOrder(order.id)} className="text-xs px-2.5 py-1.5 border border-border rounded-md text-muted-foreground hover:text-foreground transition-colors">View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* View Order Modal */}
      {selectedOrder && (
        <Modal open={!!selectedOrder} onClose={() => setViewOrder(null)} title="Order Details">
          <div className="space-y-4">
            <Row label="Order ID" value={selectedOrder.id} mono />
            <Row label="Product" value={state.products.find((p) => p.id === selectedOrder.productId)?.name || ''} />
            <Row label="Location" value={state.locations.find((l) => l.id === selectedOrder.locationId)?.name || ''} />
            <Row label="Type"><Badge type={selectedOrder.type}>{selectedOrder.type}</Badge></Row>
            <Row label="Quantity" value={`${selectedOrder.quantity}`} mono />
            <Row label="Source"><Badge type={selectedOrder.source}>{selectedOrder.source}</Badge></Row>
            <Row label="Note" value={selectedOrder.note} />
            <Row label="Time" value={formatDate(selectedOrder.timestamp)} mono />
          </div>
        </Modal>
      )}

      <CreateOrderModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}

function Row({ label, value, mono, children }: { label: string; value?: string; mono?: boolean; children?: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border/50">
      <span className="text-sm text-muted-foreground">{label}</span>
      {children || <span className={`text-sm text-foreground ${mono ? 'font-mono' : ''}`}>{value}</span>}
    </div>
  );
}

function CreateOrderModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, dispatch, addToast } = useApp();
  const [productId, setProductId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [type, setType] = useState<'sale' | 'restock' | 'transfer'>('sale');
  const [qty, setQty] = useState('');
  const [note, setNote] = useState('');
  const [source, setSource] = useState<'manual' | 'ai'>('manual');
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = () => {
    const errs: string[] = [];
    if (!productId) errs.push('productId');
    if (!locationId) errs.push('locationId');
    if (!qty || parseInt(qty) <= 0) errs.push('qty');
    setErrors(errs);
    if (errs.length) return;

    const amount = parseInt(qty);
    dispatch({
      type: 'CREATE_ORDER',
      order: { id: generateId('ord'), productId, locationId, type, quantity: amount, source, note, timestamp: new Date() },
    });

    const item = state.inventory.find((i) => i.productId === productId && i.locationId === locationId);
    if (item) {
      const newQty = type === 'sale' ? Math.max(0, item.quantity - amount) : type === 'restock' ? item.quantity + amount : item.quantity;
      dispatch({ type: 'UPDATE_INVENTORY', productId, locationId, quantity: newQty });
    }

    addToast('success', 'Order created');
    onClose();
    setProductId(''); setLocationId(''); setQty(''); setNote(''); setErrors([]);
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Order">
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Product</label>
          <select value={productId} onChange={(e) => setProductId(e.target.value)} className={`w-full px-3 py-2 bg-elevated border rounded-lg text-foreground text-sm focus:border-primary focus:outline-none ${errors.includes('productId') ? 'border-destructive' : 'border-border'}`}>
            <option value="">Select product</option>
            {state.products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Location</label>
          <select value={locationId} onChange={(e) => setLocationId(e.target.value)} className={`w-full px-3 py-2 bg-elevated border rounded-lg text-foreground text-sm focus:border-primary focus:outline-none ${errors.includes('locationId') ? 'border-destructive' : 'border-border'}`}>
            <option value="">Select location</option>
            {state.locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Type</label>
          <div className="flex border border-border rounded-lg overflow-hidden">
            {(['sale', 'restock', 'transfer'] as const).map((t) => (
              <button key={t} onClick={() => setType(t)} className={`flex-1 py-2 text-sm font-semibold capitalize transition-colors ${type === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>{t}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Quantity</label>
          <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} className={`w-full px-3 py-2 bg-elevated border rounded-lg text-foreground text-sm font-mono focus:border-primary focus:outline-none ${errors.includes('qty') ? 'border-destructive' : 'border-border'}`} placeholder="0" />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Note</label>
          <input value={note} onChange={(e) => setNote(e.target.value)} className="w-full px-3 py-2 bg-elevated border border-border rounded-lg text-foreground text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none" placeholder="Optional note" />
        </div>
        <div className="flex border border-border rounded-lg overflow-hidden">
          <button onClick={() => setSource('manual')} className={`flex-1 py-2 text-sm font-semibold transition-colors ${source === 'manual' ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}>Manual</button>
          <button onClick={() => setSource('ai')} className={`flex-1 py-2 text-sm font-semibold transition-colors ${source === 'ai' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}>AI</button>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity">Create</button>
        </div>
      </div>
    </Modal>
  );
}
