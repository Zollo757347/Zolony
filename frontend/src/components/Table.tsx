import Latex from "react-latex-next";
import "../styles/table.css"

interface TableProps {
  content: {
    head: [GridData];
    body: GridData[];
  }
}

interface TheadProps {
  data: [GridData];
}

interface TbodyProps {
  data: GridData[];
}

type GridData = (string | {
  content: string;
  [key: string]: any;
})[]

const Table = ({ content }: TableProps) => {
  return (
    <table className="z-table">
      <Thead data={content.head} />
      <Tbody data={content.body} />
    </table>
  );
}
export default Table;

function Thead({ data }: TheadProps) {
  return <thead>
    <tr>{
      data[0].map((ele, j) => {
        if (typeof ele === 'string') {
          return <th className="z-th" key={j}><Latex>{ele}</Latex></th>;
        }
        else {
          return <th className="z-th" key={j} {...ele}><Latex>{ele.content}</Latex></th>;
        }
      })
    }</tr>
  </thead>;
}

function Tbody({ data }: TbodyProps) {
  return <tbody>{
    data.map((row, i) => <tr key={i}>{
      row.map((ele, j) => {
        if (typeof ele === 'string') {
          return <td className="z-td" key={j}><Latex>{ele}</Latex></td>;
        }
        else {
          return <td className="z-td" key={j} {...ele}><Latex>{ele.content}</Latex></td>;
        }
      })
    }</tr>)
  }</tbody>;
}