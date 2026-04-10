import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Recibe las transacciones y las agrupa por mes para mostrar ingresos vs gastos
const BarChart = ({ transactions }) => {

  // Procesamos las transacciones para agruparlas por mes
  const dataByMonth = transactions.reduce((acc, t) => {
    const date = new Date(t.date);
    const month = date.toLocaleDateString('es-SV', { month: 'short', year: 'numeric' });

    if (!acc[month]) {
      acc[month] = { month, ingresos: 0, gastos: 0 };
    }

    if (t.type === 'income') {
      acc[month].ingresos += parseFloat(t.amount);
    } else {
      acc[month].gastos += parseFloat(t.amount);
    }

    return acc;
  }, {});

  const data = Object.values(dataByMonth);

  if (data.length === 0) {
    return <p style={styles.empty}>No hay datos para mostrar</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
        <Legend />
        <Bar dataKey="ingresos" fill="#16a34a" radius={[4, 4, 0, 0]} />
        <Bar dataKey="gastos" fill="#dc2626" radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

const styles = {
  empty: {
    color: '#aaa',
    textAlign: 'center',
    padding: '2rem 0',
  },
};

export default BarChart;