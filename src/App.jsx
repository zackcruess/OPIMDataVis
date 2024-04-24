import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import insideLogo from './assets/InsideAirbnb.jfif';
import './App.css';
import Chart from 'chart.js/auto';

function App() {
  const [csvArray, setCsvArray] = useState([[]]);
  const [loading, setLoading] = useState(false);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    if (csvArray.length === 1 && csvArray[0].length === 0) {
      setLoading(true);
    } else {
      setLoading(false);
      document.addEventListener('DOMContentLoaded', createPieChart);
    }
    return () => {
      document.removeEventListener('DOMContentLoaded', createPieChart);
    };
  }, [csvArray]);

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

  function createPieChart() {
    const ctx = document.getElementById('pieChart');
    if (!ctx || !csvArray[0]) return;

    if (chartInstance) {
      chartInstance.destroy(); // Destroy previous chart instance
    }

    const columnData = csvArray.slice(1).map(row => row[9]);
    const labels = [...new Set(columnData)]; // Get unique values from the column
    const dataCounts = labels.map(label => columnData.filter(value => value === label).length);

    // Use setChartInstance to update the chartInstance state
    setChartInstance(new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: dataCounts,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    }));
  }

  return (
    <>
      <div style={{ backgroundColor: 'white', minHeight: '200px' }}>
        <div style={{ backgroundColor: 'white', padding: '10px', position: 'fixed', top: 0, left: 0, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 999 }}>
          <div>
            <h1 style={{ color: 'darkblue', fontSize: '24px', margin: 0 }}>Inside AirBnb: Short-Term Rental Regulation Dashboard</h1>
            <a href="https://forms.gle/UdAMsk1bL49Gegiv9" style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'none', marginLeft: '10px', fontFamily: 'Times New Roman', fontSize: '14pt' }}>Donate!</a>
          </div>
          <div>
            <div style={{ backgroundColor: 'white', padding: '10px', fontFamily: 'Times New Roman', fontSize: '14pt' }}>
              <span>Select State</span>
              <select>
                {states.map((state, index) => (
                  <option key={index} value={state.value}>{state.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div style={{ paddingLeft: '20px', paddingTop: '60px', fontSize: '12pt', fontFamily: 'Calibri', maxWidth: '50vw' }}>
          This is a website prototype done for our OPIM 3211 systems design and analysis project in assistance with InsideAirbnb. The goal of this project was to visualize data about short-term rental regulations. The data is constantly being updated, and if you would like to submit an STR Regulation, click the link in the righthand corner.
        </div>
        <h1>OPIM DATA VISUALIZATION</h1>
        <img src="https://i.imgur.com/GNXuZzp.png" alt="Bar Chart example" />
        <canvas id="pieChart" width="200" height="200"></canvas>
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
      </div>
    </>
  );
}



export default App;
