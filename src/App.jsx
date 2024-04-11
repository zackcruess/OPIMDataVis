import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [csvArray, setCsvArray] = useState([[]]);

  async function getSheet() {
    const url = 'https://docs.google.com/spreadsheets/d/19bfurNR8JlxD46Fmg0i0Hau3rrh1SsCBe6pjgQ_SOcs/gviz/tq?tqx=out:csv&sheet=STR%20Regulation%20Database';
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.text();
        setCsvArray(parseCSV(data));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function parseCSV(csvString) {
    // Split CSV string into rows
    const rows = csvString.trim().split('\n');
    // Initialize 2D array
    const csvData = [];
    // Iterate over each row
    rows.forEach(row => {
      // Split row into columns
      const columns = row.split(',').map(cell => cell.replace(/"/g, ''));
      // Add columns to 2D array
      csvData.push(columns);
    });
    return csvData;
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>OPIM 3211 Project - Inside AirBnb</h1>
      <div className="card">
        <button onClick={getSheet}>Get Sheet</button>
        <table className="csv-table">
          <thead>
            <tr>
              {csvArray[0].map((columnName, index) => (
                <th key={index}>{columnName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvArray.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'even-row' : 'odd-row'}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
