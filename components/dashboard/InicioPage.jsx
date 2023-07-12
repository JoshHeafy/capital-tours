export default function InicioPage() {
  return (
    <div className="main">
      <h1>Dashboard</h1>
      <div className="date">
        <input type="date" />
      </div>
      <div className="insights">
        <div className="sales">
          <i className="bx bx-bar-chart-square" />
          <div className="middle">
            <div className="left">
              <h3>Total Sales</h3>
              <h1>S/.25.024</h1>
            </div>
            <div className="progress">
              <svg>
                <circle cx="38" cy="38" r="36"></circle>
              </svg>
              <div className="number">
                <p>81%</p>
              </div>
            </div>
          </div>
          <small className="text-muted">Last 24 Hours</small>
        </div>
        {/* ------------ END OF SALES ------------ */}
        <div className="expenses">
          <i className="bx bx-bar-chart-square" />
          <div className="middle">
            <div className="left">
              <h3>Total Expenses</h3>
              <h1>S/.14.160</h1>
            </div>
            <div className="progress">
              <svg>
                <circle cx="38" cy="38" r="36"></circle>
              </svg>
              <div className="number">
                <p>62%</p>
              </div>
            </div>
          </div>
          <small className="text-muted">Last 24 Hours</small>
        </div>
        {/* ------------ END OF EXPENSES ------------ */}
        <div className="income">
          <i className="bx bx-bar-chart-square" />
          <div className="middle">
            <div className="left">
              <h3>Total Income</h3>
              <h1>S/.10.864</h1>
            </div>
            <div className="progress">
              <svg>
                <circle cx="38" cy="38" r="36"></circle>
              </svg>
              <div className="number">
                <p>44%</p>
              </div>
            </div>
          </div>
          <small className="text-muted">Last 24 Hours</small>
        </div>
        {/* ------------ END OF INCOME ------------ */}
      </div>
      {/* ------------ END OF INSIGHTS ------------ */}
      <div className="recent-orders">
        <h2>Recent Orders</h2>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Product Number</th>
              <th>Payment</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Foldable Mini Drone</td>
              <td>86531</td>
              <td>Due</td>
              <td className="warning">Pending</td>
              <td className="primary">Details</td>
            </tr>
            <tr>
              <td>Foldable Mini Drone</td>
              <td>86531</td>
              <td>Due</td>
              <td className="warning">Pending</td>
              <td className="primary">Details</td>
            </tr>
            <tr>
              <td>Foldable Mini Drone</td>
              <td>86531</td>
              <td>Due</td>
              <td className="warning">Pending</td>
              <td className="primary">Details</td>
            </tr>
            <tr>
              <td>Foldable Mini Drone</td>
              <td>86531</td>
              <td>Due</td>
              <td className="warning">Pending</td>
              <td className="primary">Details</td>
            </tr>
            <tr>
              <td>Foldable Mini Drone</td>
              <td>86531</td>
              <td>Due</td>
              <td className="warning">Pending</td>
              <td className="primary">Details</td>
            </tr>
          </tbody>
        </table>
        <a href="#">Show All</a>
      </div>
    </div>
  );
}
