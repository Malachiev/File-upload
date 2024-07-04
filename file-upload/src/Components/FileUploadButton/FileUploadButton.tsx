import React, { useState} from 'react';
import { read, utils } from 'xlsx';
import FileUploadButtonProps from './FileUploadButton.props';
import { Transaction } from '../../App';
import styles from './FileUploadButton.module.css'

interface ExcelRow {
  "Mass sending list": string;
  "__EMPTY": string;
  "__EMPTY_1": string;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({ setFormData }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [buttonText, setButtonText] = useState("Withdraw");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentFile = event.target.files?.[0] || null;
    setUploadedFile(currentFile);
    setButtonText(currentFile ? currentFile.name : "Withdraw");
  };

  const handleConvertToJson = () => {
    if (uploadedFile) {
      const fileReader = new FileReader();
      fileReader.readAsBinaryString(uploadedFile);

      fileReader.onload = (event: ProgressEvent<FileReader>) => {
        const fileData = event.target?.result as string;
        const workbook = read(fileData, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const rowData: ExcelRow[] = utils.sheet_to_json(workbook.Sheets[sheetName]);

        const transactions: Transaction[] = rowData
          .slice(1)
          .map((item: ExcelRow) => ({
            wallet: item["Mass sending list"],
            amount: parseFloat(item["__EMPTY"]),
            currency: item["__EMPTY_1"] === "USD" ? "USD" : 'USD',
          }));

        setFormData(transactions);
        setButtonText("Withdraw");
        setUploadedFile(null);
      };
    }
  };

  return (
    <div className={styles.button_container}>
      <input
        type="file"
        id="uploadFile"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className={styles.input} 
      />
      <label 
        htmlFor="uploadFile"
        className={styles.button}
        onClick={handleConvertToJson}
      >
          {buttonText}
      </label> 
    </div>
  );
};

export default FileUploadButton;
