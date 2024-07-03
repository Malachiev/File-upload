interface Transaction {
    wallet: string;
    amount: number;
    currency: string;
}

export default interface FileUploadButtonProps {
    setFormData: (arg0: Transaction[]) => void;
}