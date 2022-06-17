//@ts-ignore
import { MultiGrid } from 'react-virtualized'


const STYLE = {
  border: '1px solid #ddd',
};
const STYLE_BOTTOM_LEFT_GRID = {
  borderRight: '2px solid #aaa',
  backgroundColor: '#f7f7f7',
};
const STYLE_TOP_LEFT_GRID = {
  borderBottom: '2px solid #aaa',
  borderRight: '2px solid #aaa',
  fontWeight: 'bold',
};
const STYLE_TOP_RIGHT_GRID = {
  borderBottom: '2px solid #aaa',
  fontWeight: 'bold',
};

const VirtualizedFretboard = (): React.ReactNode => {


  const cellRenderer = ({ columnIndex, key, rowIndex, style }: { columnIndex: number, key: any, rowIndex: number, style: any }) => {
    return (
      <div className={'cell'} key={key} style={style}>
        {columnIndex}, {rowIndex}
      </div>
    );
  }

  return <MultiGrid
    fixedColumnCount={2}
    fixedRowCount={1}
    scrollToColumn={0}
    scrollToRow={0}
    cellRenderer={cellRenderer}
    height={400}
    width={600}
    columnWidth={75}
    columnCount={50}
    enableFixedColumnScroll
    enableFixedRowScroll
    rowHeight={40}
    rowCount={100}
    style={STYLE}
    styleBottomLeftGrid={STYLE_BOTTOM_LEFT_GRID}
    styleTopLeftGrid={STYLE_TOP_LEFT_GRID}
    styleTopRightGrid={STYLE_TOP_RIGHT_GRID}
    hideTopRightGridScrollbar
    hideBottomLeftGridScrollbar
  />
}


export default VirtualizedFretboard
