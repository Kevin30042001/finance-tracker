import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Colores para cada categoría de gasto
const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#d97706', '#7c3aed', '#db2777', '#0891b2', '#65a30d'];

// Recibe las transacciones y muestra la distribución de gastos por categoría
const DonutChart = ({ transactions }) => {

  // Filtramos solo gastos y los agrupamos por categoría
 const expensesByCategory = transactions
  .filter(t => t.type === 'expense')
  .reduce((acc, t) => {
    // Normalizamos la categoría a minúsculas para evitar duplicados
    const category = t.category.toLowerCase();

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