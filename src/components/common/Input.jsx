import './Input.css';

export function Input({
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  label = '',
  error = '',
  className = '',
  required = false,
  ...props
}) {
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`input ${error ? 'input-error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        {...props}
      />
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
}

export function Textarea({
  placeholder = '',
  value = '',
  onChange,
  label = '',
  error = '',
  className = '',
  rows = 4,
  required = false,
  ...props
}) {
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <textarea
        className={`textarea ${error ? 'input-error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        required={required}
        {...props}
      />
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
}


