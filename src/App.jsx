import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import insideLogo from './assets/InsideAirbnb.jfif';
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
      <div style={{ backgroundColor: 'lightgray', padding: '10px', position: 'fixed', top: 0, left: 0, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: 'darkblue', fontSize: '24px', margin: 0 }}>Inside AirBnb: Short-Term Rental Regulation Dashboard</h1>
        <a href="https://forms.gle/EEQM9ZSU6oqjAaFk9" style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'none', marginLeft: '10px' }}>Submit a STR Regulation <span style={{ whiteSpace: 'nowrap' }}>Here</span></a>
      </div>
      <div style={{ paddingLeft: '20px', paddingTop: '60px', fontSize: '12pt', fontFamily: 'Calibri', maxWidth: '50vw' }}>
        Hello, this is a dashboard prototype made for Inside AirBnb in collaboration with the University of Connecticut's OPIM 3211 class. This dashboard takes survey submissions from users and creates visualizations based on the results.
      </div>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://forms.gle/EEQM9ZSU6oqjAaFk9" target="_blank">
          <img src="https://pbs.twimg.com/profile_images/575532099827986432/uiwyE4c1_400x400.png" className="logo insideairbnb" alt="InsideAirBnb logo" />
        </a>

      </div>
      <h1></h1>
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
