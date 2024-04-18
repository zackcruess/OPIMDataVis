useEffect(() => {
    if (csvArray.length === 1 && csvArray[0].length === 0) {
      setLoading(true);
    } else {
      setLoading(false);
      createPieChart();
      if (chartInstance) {
        chartInstance.destroy(); // Destroy previous chart instance
      }
      createPieChart();
    }
  }, [csvArray]);

  function createPieChart() {
    const ctx = document.getElementById('pieChart');
    if (!ctx || !csvArray[0]) return;

    if (chartInstance) {
      chartInstance.destroy(); // Destroy previous chart instance
    }

    const columnData = csvArray.slice(1).map(row => row[9]);
    const labels = [...new Set(columnData)]; // Get unique values from the column
    const dataCounts = labels.map(label => columnData.filter(value => value === label).length);

    chartInstance = new Chart(ctx, {
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

  <canvas id="pieChart" width="400" height="400"></canvas>