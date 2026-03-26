import type { ValidationResult } from '@/utils/validateLoadout';

interface ValidationPanelProps {
  results: ValidationResult[];
}

const ValidationPanel = ({ results }: ValidationPanelProps) => {
  if (results.length === 0) return null;

  return (
    <div
      style={{
        backgroundColor: '#1A1008',
        border: '1px solid #C87941',
        padding: '12px',
        marginBottom: '8px',
        borderRadius: '2px',
      }}
    >
      <div className="flex flex-col gap-1">
        {results.map((r, i) => {
          const isError = r.severity === 'ERROR';
          const color = isError ? '#E05050' : '#C87941';
          const prefix = isError ? '✕' : '⚠';
          return (
            <div
              key={i}
              className="font-mono"
              style={{ color, fontSize: 'var(--fs-badge)' }}
            >
              {prefix} {r.message}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ValidationPanel;
