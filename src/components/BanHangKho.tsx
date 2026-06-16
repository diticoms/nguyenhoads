import { useState } from 'react';
import BanHang from './BanHang';
import KhoHang from './KhoHang';
import { ShoppingCart, Package } from 'lucide-react';

export default function BanHangKho() {
  const [activeSubTab, setActiveSubTab] = useState<'banhang' | 'khohang'>('banhang');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Sub Tabs Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '20px', 
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '10px'
      }}>
        <button 
          onClick={() => setActiveSubTab('banhang')}
          style={{
            padding: '10px 20px',
            border: 'none',
            backgroundColor: activeSubTab === 'banhang' ? 'var(--primary-color)' : 'transparent',
            color: activeSubTab === 'banhang' ? '#fff' : 'var(--text-secondary)',
            borderRadius: '6px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <ShoppingCart size={18} /> Lập Phiếu & Đơn Bán
        </button>
        <button 
          onClick={() => setActiveSubTab('khohang')}
          style={{
            padding: '10px 20px',
            border: 'none',
            backgroundColor: activeSubTab === 'khohang' ? 'var(--primary-color)' : 'transparent',
            color: activeSubTab === 'khohang' ? '#fff' : 'var(--text-secondary)',
            borderRadius: '6px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Package size={18} /> Danh Mục Tồn Kho
        </button>
      </div>

      {/* Render Sub Content */}
      <div style={{ flex: 1 }}>
        {activeSubTab === 'banhang' && <BanHang />}
        {activeSubTab === 'khohang' && <KhoHang />}
      </div>
    </div>
  );
}
