import Latex from "react-latex-next";
import styled from "styled-components";

const Table = ({ content }) => {
  return (
    <StyledTable>
      <Thead data={content.head} />
      <Tbody data={content.body} />
    </StyledTable>
  );
}

function Thead({ data }) {
  return <thead>{
    data.map((row, i) => <tr key={i}>{
      row.map((ele, j) => {
        if (typeof ele === 'string') {
          return <Th key={j}>{ele}</Th>;
        }
        else {
          return <Th key={j} {...ele}>{
            ele.latex ? <Latex>{ele.content}</Latex> : ele.content
          }</Th>;
        }
      })
    }</tr>)
  }</thead>;
}

function Tbody({ data }) {
  return <tbody>{
    data.map((row, i) => <tr key={i}>{
      row.map((ele, j) => {
        if (typeof ele === 'string') {
          return <Td key={j}>{ele}</Td>;
        }
        else {
          return <Td key={j} {...ele}>{
            ele.latex ? <Latex>{ele.content}</Latex> : ele.content
          }</Td>;
        }
      })
    }</tr>)
  }</tbody>;
}

const StyledTable = styled.table`
  margin: 2em 0.5em;
  text-align: center;
  border: 2px solid black;
  border-collapse: collapse;
  padding: 1px 5px;
`;

const Th = styled.th`
  background-color: rgb(242, 233, 119);
  padding: 0.5em;
  border: 2px solid black;
  border-collapse: collapse;
`;

const Td = styled.td`
  background-color: rgb(250, 248, 217);
  padding: 1px 5px;
  border: 2px solid black;
  border-collapse: collapse;
`;

export default Table;