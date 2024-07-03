import './App.css';
import Accounts from './Components/Accaunts/Accounts';

export interface Transaction {
  wallet: string;
  amount: number;
  currency: string;
}

const App: React.FC = () => {
  return (
    <>
      <Accounts/>
    </>
  )
}

export default App
