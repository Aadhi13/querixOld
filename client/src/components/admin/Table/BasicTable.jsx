import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  StyledTable,
  TableContainer,
} from "../../../assets/styles/admin/tableStyles";
import { useState } from "react";

export default function BasicTable(props) {

  const { data, columns, title, tableFor } = props;

  const customShadow = {
    //right  left up bottom
    textShadow:
      "0.5px 0.5px 0 black, -0.5px -0.5px 0 red, 0.5px -0.5px 0 black, -0.5px 0.5px 0 red",
  };

  const [sorting, setSorting] = useState([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting: sorting
    },
    onSortingChange: setSorting
  });

  return (
    <>
      <h1
        style={customShadow}
        className="text-[#ffc107] text-4xl font-medium"
      >
        {title}
      </h1>
      <TableContainer>
        <StyledTable >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup._id} >
                {headerGroup.headers.map((header) => (
                  <th key={header._id} onClick={header.column.getToggleSortingHandler()}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    <span className="ml-3">
                      {
                        { asc: '▲', desc: '▼' }[header.column.getIsSorted() ?? null]
                      }
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={`${tableFor}`}>
            {table.getRowModel().rows.map((row) => (
              <tr key={row._id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell._id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableContainer>
      <div className="text-black text-sm flex items-center justify-between mx-4 mt-1">
        <div className="flex justify-center items-center">
          <div className="text-gray-400 text-lg"> {(((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize) - table.getState().pagination.pageSize) + 1} - {(table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize} of {table.getPageCount() * table.getState().pagination.pageSize} rows</div>
        </div>
        <div className="flex justify-center items-center mr-4">
          <button disabled={table.getState().pagination.pageIndex === 0} onClick={() => table.setPageIndex(0)} className="font-bold mr-2 rounded-lg border py-2 px-5 leading-tight border-gray-700 bg-gray-800 text-gray-400 enabled:hover:bg-gray-700 enabled:hover:text-white">{'<<'}</button>
          <button disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()} className="font-bold mx-2 rounded-lg border py-2 px-5 leading-tight border-gray-700 bg-gray-800 text-gray-400 enabled:hover:bg-gray-700 enabled:hover:text-white">{'<'}</button>
          <button disabled={!table.getCanNextPage()} onClick={() => table.nextPage()} className="font-bold mx-2 rounded-lg border py-2 px-5 leading-tight border-gray-700 bg-gray-800 text-gray-400 enabled:hover:bg-gray-700 enabled:hover:text-white">{'>'}</button>
          <button disabled={table.getState().pagination.pageIndex === table.getPageCount() - 1} onClick={() => table.setPageIndex(table.getPageCount() - 1)} className="font-bold ml-2 rounded-lg border py-2 px-5 leading-tight border-gray-700 bg-gray-800 text-gray-400 enabled:hover:bg-gray-700 enabled:hover:text-white">{'>>'}</button>
        </div>
        <div className="flex items-center  text-gray-400 text-lg">
          Rows per page:
          <select value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(e.target.value)
            }}
            className="rounded-lg ml-4 border py-0.5 px-0.5 leading-tight border-gray-700 bg-gray-800 text-gray-400 enabled:hover:bg-gray-700 enabled:hover:text-white"
          >
            {[10, 20, 30, 40, 50, 100].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
