import styled from "styled-components";

const Select = ({ placeholder, options, onChange }) => {

  return (
    <StyledSelect defaultValue="" onChange={e => onChange(e.target.value)}>
      <option key={-1} value="" disabled hidden>{placeholder}</option>
      {
        options.map(({ label, value }, i) => 
          <option key={i} value={value}>{label}</option>
        )
      }
    </StyledSelect>
  );
}

const StyledSelect = styled.select`
  padding: 8px;
  margin: 5px;
  border: 2px #666 solid;
  border-radius: 0.5em; 
  transition-duration: 300ms;

  &:hover {
    cursor: pointer;
  }
`;

export default Select;