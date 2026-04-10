import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Formulario
  const [type, setType] = useState('income');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  // Cargar transacciones al montar el componente
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data);
    } catch (err) {
      setError('Error al cargar las transacciones');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/transactions', {
        type, category, amount: parseFloat(amount), description, date
      });
      setTransactions([response.data, ...transactions]);
      // Limpiar formulario
      setCategory('');
      setAmount('');
      setDescription('');
      setDate('');
    } catch (err) {
      setError('Error al crear la transacción');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (err) {
      setError('Error al eliminar la transacción');
    }
  };

  // Calcular totales
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Finance Tracker</h1>
        <div style={styles.headerRight}>
          <span style={styles.userName}>Hola, {user?.name}</span>
          <button onClick={logout} style={styles.logoutBtn}>Cerrar sesión</button>
        </div>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {/* Tarjetas de resumen */}
      <div style={styles.summaryGrid}>
        <div style={{ ...styles.summaryCard, borderTop: '4px solid #2563eb' }}>
          <p style={styles.summaryLabel}>Balance</p>
          <p style={{ ...styles.summaryAmount, color: balance >= 0 ? '#16a34a' : '#dc2626' }}>
            ${balance.toFixed(2)}
          </p>
        </div>
        <div style={{ ...styles.summaryCard, borderTop: '4px solid #16a34a' }}>
          <p style={styles.summaryLabel}>Ingresos</p>
          <p style={{ ...styles.summaryAmount, color: '#16a34a' }}>${totalIncome.toFixed(2)}</p>
        </div>
        <div style={{ ...styles.summaryCard, borderTop: '4px solid #dc2626' }}>
          <p style={styles.summaryLabel}>Gastos</p>
          <p style={{ ...styles.summaryAmount, color: '#dc2626' }}>${totalExpenses.toFixed(2)}</p>
        </div>
      </div>

      <div style={styles.mainGrid}>
        {/* Formulario */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Nueva transacción</h2>
          <form onSubmit={handleCreate} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Tipo</label>
              <select value={type} onChange={(e) => setType(e.target.value)} style={styles.input}>
                <option value="income">Ingreso</option>
                <option value="expense">Gasto</option>
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Categoría</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={styles.input}
                placeholder="Ej: Salario, Comida..."
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Monto</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={styles.input}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Descripción</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={styles.input}
                placeholder="Descripción opcional"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Fecha</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <button type="submit" style={styles.button}>Agregar transacción</button>
          </form>
        </div>

        {/* Lista de transacciones */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Transacciones</h2>
          {loading ? (
            <p style={styles.empty}>Cargando...</p>
          ) : transactions.length === 0 ? (
            <p style={styles.empty}>No hay transacciones aún</p>
          ) : (
            <div style={styles.list}>
              {transactions.map(t => (
                <div key={t.id} style={styles.transactionItem}>
                  <div style={styles.transactionInfo}>
                    <span style={styles.transactionCategory}>{t.category}</span>
                    <span style={styles.transactionDescription}>{t.description}</span>
                    <span style={styles.transactionDate}>
                      {new Date(t.date).toLocaleDateString('es-SV')}
                    </span>
                  </div>
                  <div style={styles.transactionRight}>
                    <span style={{
                      ...styles.transactionAmount,
                      color: t.type === 'income' ? '#16a34a' : '#dc2626'
                    }}>
                      {t.type === 'income' ? '+' : '-'}${parseFloat(t.amount).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleDelete(t.id)}
                      style={styles.deleteBtn}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '1.5rem',
    fontFamily: 'sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  title: {
    color: '#2563eb',
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userName: {
    color: '#555',
    fontSize: '0.95rem',
  },
  logoutBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#555',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: '1.25rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  summaryLabel: {
    color: '#888',
    fontSize: '0.85rem',
    margin: '0 0 0.5rem',
  },
  summaryAmount: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0,
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  cardTitle: {
    margin: '0 0 1.25rem',
    color: '#333',
    fontSize: '1.1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  label: {
    fontSize: '0.85rem',
    color: '#555',
  },
  input: {
    padding: '0.6rem',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '0.95rem',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.95rem',
    cursor: 'pointer',
    marginTop: '0.25rem',
  },
  error: {
    color: '#dc2626',
    backgroundColor: '#fef2f2',
    padding: '0.75rem',
    borderRadius: '6px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  transactionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    borderRadius: '6px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #eee',
  },
  transactionInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.15rem',
  },
  transactionCategory: {
    fontWeight: '600',
    fontSize: '0.95rem',
    color: '#333',
  },
  transactionDescription: {
    fontSize: '0.8rem',
    color: '#888',
  },
  transactionDate: {
    fontSize: '0.75rem',
    color: '#aaa',
  },
  transactionRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.35rem',
  },
  transactionAmount: {
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  deleteBtn: {
    padding: '0.25rem 0.6rem',
    backgroundColor: 'transparent',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.75rem',
    color: '#dc2626',
  },
  empty: {
    color: '#aaa',
    textAlign: 'center',
    padding: '2rem 0',
  },
};

export default Dashboard;