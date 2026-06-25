import { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Package, DollarSign } from 'lucide-react';
import { formatMoney } from '../utils';
import {
  Chart as ChartJS,
  registerables
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(...registerables);

interface LowStockItem {
  id: string;
  code: string;
  name: string;
  stock: number;
}

interface TopProductItem {
  id: string;
  code: string;
  name: string;
  sold: number;
}

// MOCK DATA cho đến khi backend cập nhật
const MOCK_DATA = {
  monthlyStats: [
    { name: 'T1', revenue: 4000000, profit: 2400000 },
    { name: 'T2', revenue: 3000000, profit: 1398000 },
    { name: 'T3', revenue: 2000000, profit: 9800000 },
    { name: 'T4', revenue: 2780000, profit: 3908000 },
    { name: 'T5', revenue: 1890000, profit: 4800000 },
    { name: 'T6', revenue: 2390000, profit: 3800000 },
    { name: 'T7', revenue: 3490000, profit: 4300000 },
  ],
  totalRevenue: 15400000,
  totalProfit: 5400000,
  totalDebt: 3200000,
  lowStock: [] as LowStockItem[],
  topProducts: [] as TopProductItem[]
};

export default function Dashboard() {
  const [data] = useState(MOCK_DATA);
  const [loading] = useState(false);

  useEffect(() => {
    // Tạm thời dùng mock data. Sau này fetch từ Google Script module=dashboard
    // setLoading(true);
    // fetchData('dashboard').then(res => {
    //   if (res.data) setData(res.data);
    //   setLoading(false);
    // });
  }, []);

  const chartData = {
    labels: data.monthlyStats.map(d => d.name),
    datasets: [
      {
        type: 'line' as const,
        label: 'Tiền Lãi',
        borderColor: '#10b981',
        borderWidth: 3,
        fill: false,
        data: data.monthlyStats.map(d => d.profit),
      },
      {
        type: 'bar' as const,
        label: 'Doanh Thu',
        backgroundColor: '#38bdf8',
        data: data.monthlyStats.map(d => d.revenue),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          callback: function(value: any) {
            return (value / 1000000) + 'M';
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatMoney(context.parsed.y) + ' đ';
            }
            return label;
          }
        }
      }
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Đang tải dữ liệu...</div>;

  return (
    <div className="module-container">
      <div className="header">
        <h1 className="title">Báo Cáo Tổng Quan</h1>
      </div>

      <div className="summary-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div className="summary-card income">
          <div className="summary-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="var(--income-color)" /> Doanh Thu (Tháng này)
          </div>
          <div className="summary-amount income-text">{formatMoney(data.totalRevenue)} đ</div>
        </div>
        <div className="summary-card balance">
          <div className="summary-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign size={18} color="var(--primary-color)" /> Tiền Lãi / Lợi Nhuận Gộp
          </div>
          <div className="summary-amount" style={{ color: 'var(--primary-color)' }}>{formatMoney(data.totalProfit)} đ</div>
        </div>
        <div className="summary-card expense">
          <div className="summary-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="var(--expense-color)" /> Tổng Công Nợ Khách
          </div>
          <div className="summary-amount expense-text">{formatMoney(data.totalDebt)} đ</div>
        </div>
      </div>

      <div className="grid-50-50">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Biểu đồ Doanh Thu & Lợi Nhuận</h2>
          </div>
          <div style={{ width: '100%', height: 350, padding: '20px' }}>
            <Chart type='bar' data={chartData as any} options={chartOptions} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card expense">
            <div className="card-header" style={{ borderBottomColor: 'var(--expense-color)' }}>
              <h2 className="card-title" style={{ color: 'var(--expense-color)' }}>
                <AlertTriangle size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
                Cảnh báo Tồn Kho Thấp
              </h2>
            </div>
            <div className="table-responsive">
              <table style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th className="text-right">Tồn kho</th>
                  </tr>
                </thead>
                <tbody>
                  {data.lowStock.length === 0 ? (
                    <tr><td colSpan={2} className="text-center" style={{padding: '1rem', color: '#64748b'}}>Chưa có dữ liệu</td></tr>
                  ) : data.lowStock.map(p => (
                    <tr key={p.id}>
                      <td><strong>{p.code}</strong> - {p.name}</td>
                      <td className="text-right" style={{ color: 'red', fontWeight: 'bold' }}>{p.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <Package size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
                Top Bán Chạy Nhất
              </h2>
            </div>
            <div className="table-responsive">
              <table style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th className="text-right">Đã bán</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topProducts.length === 0 ? (
                    <tr><td colSpan={2} className="text-center" style={{padding: '1rem', color: '#64748b'}}>Chưa có dữ liệu</td></tr>
                  ) : data.topProducts.map(p => (
                    <tr key={p.id}>
                      <td><strong>{p.code}</strong> - {p.name}</td>
                      <td className="text-right" style={{ color: 'var(--income-color)', fontWeight: 'bold' }}>{p.sold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
