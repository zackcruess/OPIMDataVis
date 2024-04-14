import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import insideLogo from './assets/InsideAirbnb.jfif';
import './App.css';
import Chart from 'chart.js/auto';

function App() {
  const [csvArray, setCsvArray] = useState([[]]);

  useEffect(() => {
    createPieChart();
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

    const columnData = csvArray.slice(1).map(row => row[9]);
    const labels = [...new Set(columnData)]; // Get unique values from the column
    const dataCounts = labels.map(label => columnData.filter(value => value === label).length);

    new Chart(ctx, {
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
    });
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
        <a href="https://www.google.com/url?sa=i&url=https%3A%2F%2Ftwitter.com%2FInsideAirbnb&psig=AOvVaw0nFH0VR8JbS_2vGWam3jlg&ust=1712953921495000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNilx-GAu4UDFQAAAAAdAAAAABAE" target="_blank">
          <img src="https://pbs.twimg.com/profile_images/575532099827986432/uiwyE4c1_400x400.png" className="logo insideairbnb" alt="InsideAirBnb logo" />
        </a>
        <a target="_blank">
          <img src="https://upload.wikimedia.org/wikipedia/en/thumb/b/b0/Connecticut_Huskies_logo.svg/640px-Connecticut_Huskies_logo.svg.png" className="logo uconn" alt="uconn logo" />
        </a>
      </div>
      <h1>OPIM DATA VISUALIZATION</h1>
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
        <canvas id="pieChart" width="400" height="400"></canvas>
      </div>
    </>
  );
}

export default App;
