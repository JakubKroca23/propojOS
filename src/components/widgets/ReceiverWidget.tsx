import { useAppInput } from '../../hooks/useAppEvent';

export function ReceiverWidget({ id }: { id: string }) {
  const data = useAppInput(id, 'in');

  return (
    <div style={{ padding: '1rem', textAlign: 'center' }}>
      <p style={{ fontSize: '1.2rem', color: data !== undefined ? 'var(--primary)' : 'var(--text-secondary)', margin: 0 }}>
        Received: {data !== undefined ? JSON.stringify(data) : 'Waiting...'}
      </p>
    </div>
  );
}
