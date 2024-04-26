import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import insideLogo from './assets/InsideAirbnb.jfif';
import './App.css';
import Chart from 'chart.js/auto';

function App() {
  const [csvArray, setCsvArray] = useState([[]]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSVDFl-ulIxy-jxupNlaknA4IDAf40SvkieKY9LKg2Zo2pv1n7AD-OlSNKe5tWNQ8OsLIvkSjVzx5Z1/pub?gid=256206415&single=true&output=csv');
      const csvData = await response.text();
      const parsedData = parseCSV(csvData);
      setData(parsedData);
      createPieChart(parsedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };



  const parseCSVPie = (csvString) => {
    const rows = csvString.trim().split('\n');
    const headers = rows[0].split(',');
    return rows.slice(1).map(row => {
      const rowData = row.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = rowData[index].trim();
        return obj;
      }, {});
    });
  };

  const createPieChart = (data) => {
    console.log(data);
    const ctx = document.getElementById('pieChart');
    if (!ctx) return;

    const requiredInspectionsIndex = data[0].indexOf('Required Inspections'); // Find index of 'Required Inspections' column
    const requiredInspectionsData = [];
    for (let i = 0; i < data.length; i++) {
      requiredInspectionsData.push(data[i][requiredInspectionsIndex]);
    }
    const labels = [...new Set(requiredInspectionsData)];
    const dataCounts = labels.map(label => requiredInspectionsData.filter(value => value === label).length);

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

  async function getSheet() {
    const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSVDFl-ulIxy-jxupNlaknA4IDAf40SvkieKY9LKg2Zo2pv1n7AD-OlSNKe5tWNQ8OsLIvkSjVzx5Z1/pub?gid=256206415&single=true&output=csv';
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
      <div style={{ backgroundColor: 'lightgray', minHeight: '200vh', padding: 0, marginLeft: 0, marginRight: 0, width: '100%' }}>
        <div style={{ backgroundColor: 'white', padding: '10px', position: 'fixed', top: 0, left: 0, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 999 }}>
          <div>
            <h1 style={{ color: 'darkblue', fontSize: '24px', margin: 0 }}>Inside AirBnb: Short-Term Rental Regulation Dashboard</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: 'white', backgroundColor: '#007bff', fontWeight: 'bold', padding: '5px 10px', borderRadius: '5px', marginRight: '30px' }}>Donate!</span>
            <a href="https://forms.gle/WpxsbaiAgdeqX2JJ8" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Times New Roman', fontSize: '16pt', color: '#007bff', marginRight: '150px', textDecoration: 'none' }}>Submit an STR Regulation Here</a>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <select
            style={{
              backgroundColor: 'white',
              padding: '10px',
              position: 'absolute',
              top: '50px',
              right: '20px',
              width: '200px',
              borderRadius: '10px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
              fontFamily: 'Times New Roman',
              fontSize: '16pt',
              color: '#666', // gray color
            }}
          >
            <option value="">Select State</option>
            <option value="1">Alabama</option>
            <option value="2">Alaska</option>
            <option value="3">Arkansas</option>
          </select>
        </div>
        <div style={{ paddingLeft: '20px', paddingTop: '40px', fontSize: '12pt', fontFamily: 'Calibri', maxWidth: '50vw', textAlign: 'Left' }}>
          This is a website prototype done for our OPIM 3211 systems design and analysis project in assistance with InsideAirbnb. The goal was to effectively demonstrate the effects of Short-Term Rental regulations using data visualizations. 4/25/24.
        </div>
        <div>
          <a href="https://insideairbnb.com/" target="_blank">
            <img src="https://pbs.twimg.com/profile_images/575532099827986432/uiwyE4c1_400x400.png" className="logo insideairbnb" alt="InsideAirBnb logo" />
          </a>
          <a href="https://undergrad.business.uconn.edu/academics/majors/aim/" target="_blank">
            <img src="https://upload.wikimedia.org/wikipedia/en/thumb/b/b0/Connecticut_Huskies_logo.svg/640px-Connecticut_Huskies_logo.svg.png" className="logo uconn" alt="uconn logo" style={{ animation: 'none' }} />
          </a>
        </div>
        <h1>OPIM DATA VISUALIZATION</h1>
        <img src="https://i.imgur.com/GNXuZzp.png" alt="Bar Chart example" />
        <div>
          <h1>Pie Chart</h1>
          <div style={{ width: '500px', height: '500px' }}>
            <canvas id="pieChart" width="400" height="400"></canvas>
          </div>
          {loading && <p>Loading...</p>}
        </div>
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
      </div >
    </>
  );
}

export default App;
