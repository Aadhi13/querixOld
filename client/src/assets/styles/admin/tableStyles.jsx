import styled from "styled-components";

export const TableContainer = styled.div`
  position: relative;
  // display: flex;
  // justify-content: center;
  align-items: center;
  font-size: 15px;
  border: 1px solid #3a3939;
  border-radius: 8px;
  overflow: auto;
  height: 83vh;
  `;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: max-content;

  th {
    background-color: black;
    color: #ffc107;
    padding: 15px;
    padding-top: 20px;
    padding-bottom: 20px;
    font-size: 20px;
    font-weight: bold;
    text-align: left;
  }
  thead, th {
    position: sticky;
    top: 0;
    z-index: 1;
  }

  td {
    padding: 15px;
    padding-top: 25px;
    padding-bottom: 25px;
    text-align: left;
    font-size: 16px;
  }

  td:nth-child(2) {
    font-size: 18px;
    font-weight: 500;
  }

  .questionManage td:nth-child(2) {
    padding: 8px;
    white-space: nowrap; /* Prevent line breaks */
    overflow: hidden; /* Hide overflowed text */
    text-overflow: ellipsis; /* Add ellipsis (...) when text is truncated */
    max-width: 300px; /* Adjust this width according to table column width */
  }

  tr:nth-child(even) td {
    background-color: #212121;
    color: white;
  }

  tr:nth-child(odd) td {
    background-color: #3a3939;
    color: white;
  }

  tr:hover td {
    background-color: #6a6a6a;
    color: black;
    curosr: pointer;
  }
`;