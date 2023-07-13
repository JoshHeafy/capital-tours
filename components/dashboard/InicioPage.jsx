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
              <h3>Total Suscripciones</h3>
              <h1>35</h1>
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
              <h3>Total Pagos</h3>
              <h1>124</h1>
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
              <h3>Total Ingresos</h3>
              <h1>S/.4545.00</h1>
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
        <h2>Suscripciones Recientes</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Numero de placa</th>
              <th>Pago</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Manolo Egg Head</td>
              <td>AFR-584</td>
              <td>En orden</td>
              <td className="success">Activo</td>
              <td className="primary">Detalles</td>
            </tr>
            <tr>
              <td>Manolo Egg Head</td>
              <td>AFR-584</td>
              <td>En orden</td>
              <td className="success">Activo</td>
              <td className="primary">Detalles</td>
            </tr>
            <tr>
              <td>Manolo Egg Head</td>
              <td>AFR-584</td>
              <td>En orden</td>
              <td className="success">Activo</td>
              <td className="primary">Detalles</td>
            </tr>
            <tr>
              <td>Manolo Egg Head</td>
              <td>AFR-584</td>
              <td>En orden</td>
              <td className="success">Activo</td>
              <td className="primary">Detalles</td>
            </tr>
            <tr>
              <td>Manolo Egg Head</td>
              <td>AFR-584</td>
              <td>En orden</td>
              <td className="success">Activo</td>
              <td className="primary">Detalles</td>
            </tr>
          </tbody>
        </table>
        <a href="#">Show All</a>
      </div>
    </div>
  );
}
