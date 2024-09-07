import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { date: 'Jan', weight: 180, strength: 100 },
  { date: 'Feb', weight: 178, strength: 105 },
  { date: 'Mar', weight: 176, strength: 110 },
  { date: 'Apr', weight: 174, strength: 115 },
  { date: 'May', weight: 172, strength: 120 },
]

export default function ProgressChart({ dataKey }: { dataKey: 'weight' | 'strength' }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={dataKey} stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}