import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#d97706', '#7c3aed', '#db2777', '#0891b2', '#65a30d'];

const DonutChart = ({ transactions }) => {

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      // Normalizamos para agrupar correctamente sin importar mayúsculas
      const category = t.category.charAt(0).toUpperCase() + t.category.slice(1).toLowerCase();

      if (!acc[category]) {
        acc[category] = { name: category, value: 0 };
      }
      acc[category].value += parseFloat(t.amount);
      return acc;
    }, {});

  const data = Object.values(expensesByCategory);

  if (data.length === 0) {
    return <p style={styles.empty}>No hay gastos para mostrar</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
        <Legend />
      </PieChart>
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

export default DonutChart;