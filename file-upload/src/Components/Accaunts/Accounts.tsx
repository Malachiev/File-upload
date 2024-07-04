import React, { useState } from 'react';
import { Transaction } from './Accounts.props';
import FileUploadButton from '../FileUploadButton/FileUploadButton';
import styles from './Accounts.module.css'
import cn from "classnames";

const Accounts: React.FC = () => {
    const [formData, setFormData] = useState<Transaction[]>([
        { wallet: '', amount: 0, currency: 'USDT' },
      ]);
    
      const handleWalletChange = (index: number, value: string) => {
        setFormData((prevFormData) => {
          return prevFormData.map((row, i) =>
            i === index ? { ...row, wallet: value } : row
          );
        });
      };

    // Не самое оптимальное решение, нужно доработать
    // Неккоректная работа при вводе "." после "0" 
    // Пример ввода: "0." ===> Вывод: "0"
    const handleAmountChange = (index: number, value: string) => {
        if (+value === 0) {
          return         setFormData((prevFormData) => {
            return prevFormData.map((row, i) =>
              i === index ? { ...row, amount: 0} : row
            );
          });
        }

        const lastSymbol = value[value.length - 1];

        if (
            isNaN(+lastSymbol) &&
            ![",", "."].includes(lastSymbol) || 
            (value.indexOf('.') !== value.length -1 && 
            value.indexOf(',') !== value.length -1 && 
            [",", "."].includes(lastSymbol))
         ) {
                return null
        }

        // Проверяем, есть ли в строке точка и последний символ запятая
        if (value.includes('.') && value.endsWith(',')) {
          return null;
        }
        // Проверяем, есть ли в строке запятая и последний символ точка
        if (value.includes(',') && value.endsWith('.')) {
          return null;
        }
        
        if (value.length === 2 && +value < 10 && +value > 0) {
            return         setFormData((prevFormData) => {
                return prevFormData.map((row, i) =>
                  i === index ? { ...row, amount: value } : row
                );
              });
        }

        const validValue = value.replace(",", ".");
        
        setFormData((prevFormData) => {
            return prevFormData.map((row, i) =>
              i === index ? { ...row, amount: validValue} : row
            );
          });
    };
      
      const addRow = () => {
        setFormData((prevFormData) => [...prevFormData, { wallet: '', amount: 0, currency: '' }]);
      };
    
      const removeRow = (index: number) => {
        setFormData((prevFormData) => prevFormData.filter((_, i) => i !== index));
      };

      const clearRow = (index: number) => {
        setFormData((prevFormData) => {
          const updatedFormData = [...prevFormData]; 
          updatedFormData[index] = { wallet: '', amount: 0, currency: 'USDT' };
          return updatedFormData;
        });
      };
      
      const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const csvData = e.target?.result as string;
            const rows = csvData
              .split('\n')
              .map((row) => row.split(','))
              .filter((row) => row.length > 1)
              .map((row) => ({
                wallet: row[0].trim(),
                amount: parseFloat(row[1].trim()),
                currency: row[1].trim().includes('USD') ? 'USD' : '', // Extract currency from amount
              }));
            setFormData(rows);
          };
          reader.readAsText(file);
        }
      };
    
      const totalAmount = formData.reduce((acc, row) => acc + +row.amount, 0);
    
      return (
        <>
          <div className={styles.container}>
            <div className="form">
              <div
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                className="drop-zone"
              >
              </div>
              <div>
                <div className={styles.header}>
                    <h3 className={styles.h3}>From</h3>
                    <div className={styles.header_balance}>
                        <span className={styles.header_balance_text}>○ BALANCE USDT (ERC - 20)</span>
                        <span className={styles.header_balance_container}>
                            <span className={styles.header_balance_amount}>
                                1232.344 USDT
                            </span>
                            <p className={styles.header_balance_erc}>(ERC-20)</p>
                        </span>
                    </div>
                    <span className={styles.header_wallet}>0x5E22eA4a9efefefef6501Fb15E2e509AC7581f2e4c991c78</span>
                </div>
                <div className={styles.transactions_container}>
                  {formData.map((row, index) => (
                    <div key={index} className={styles.transaction_container}>
                            <input
                                placeholder='wallet address'
                                className={cn(styles.input, styles.input_border)}
                                value={row.wallet}
                                onChange={(e) =>
                                handleWalletChange(index, e.target.value)
                                }
                            />
                        <div className={styles.amount_and_currency_container}>
                            <input
                                placeholder='amount'
                                className={styles.input}
                                value={row.amount.toString()} 
                                onChange={(e) =>
                                    handleAmountChange(index, e.target.value)
                                }
                            />
                            <span className={styles.header_balance_container}>
                                <span className={styles.header_balance_amount}>
                                    USDT
                                </span>
                                <p className={styles.header_balance_erc}>(ERC-20)</p>
                            </span>
                        </div>
                        <div className={styles.button_container}>
                                <button
                                    className={cn(styles.button, styles.button_clear)}
                                    onClick={() => clearRow(index)}
                                >
                                    CLEAR
                                </button>
                                {formData.length > 1 && (
                                    <button 
                                        className={cn(styles.button, styles.button_remove)}
                                        onClick={() => removeRow(index)}
                                    >
                                        REMOVE
                                    </button>
                                )}
                        </div>
                    </div>
                  ))}
                </div>
                </div>
                <span className={styles.wrapper_button_add}>
                    <button 
                        onClick={addRow}
                        className={cn(styles.button, styles.button_add)}
                    >
                        + Add new wallet
                    </button>
                </span>
              <div className={styles.total_container}>
                <span>
                    Receive amount:
                </span> 
                <span className={styles.total_amount}>
                    <span className={styles.header_balance_container}>
                        <span className={styles.header_balance_amount}>
                        {totalAmount.toFixed(2)} USDT
                        </span>
                        <p className={styles.header_balance_erc}>(ERC-20)</p>
                    </span>
                </span>
              </div>
              <FileUploadButton setFormData={setFormData}/>
          </div>
        </div>
        </>
      )
};

export default Accounts;