import "../styles/select.css";

interface SelectProps {
  placeholder: string;
  options: {
    label: string;
    value: string;
  }[];
  onChange: (v: string) => void;
}

const Select = ({ placeholder, options, onChange }: SelectProps) => {
  return (
    <select className="z-select" defaultValue="" onChange={e => onChange(e.target.value)}>
      <option key={-1} value="" disabled hidden>{placeholder}</option>
      {
        options.map(({ label, value }, i) => 
          <option key={i} value={value}>{label}</option>
        )
      }
    </select>
  );
}
export default Select;