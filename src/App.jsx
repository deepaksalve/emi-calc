import React from 'react';

import LoanForm from './components/LoanForm';

const App = () => (
  <div className="main-container">
    <header className="site--title">Loan EMI Calculator</header>
    <section className="site--body">
      <LoanForm />
    </section>
  </div>
);

export default App;
