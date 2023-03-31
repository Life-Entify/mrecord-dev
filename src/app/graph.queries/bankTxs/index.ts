import { gql } from "@apollo/client";
import { IBankTx } from "ui";

export const graphDeleteBankTx = () => {
  return gql`
    mutation deleteBankTx($_id: String) {
      _id: deleteBankTx(_id: $_id) {
        _id
      }
    }
  `;
};
export const graphUpdateBankTx = (bank_tx?: (keyof IBankTx)[]) => {
  const query = bank_tx ? bank_tx.join(" ") : "_id";
  return gql`
    mutation updateBankTx($_id: String, $bank_tx: BankTxInputType) {
        bank_tx : updateBankTx(_id: $_id, bank_tx: $bank_tx) {
            ${query}
        }
    }`;
};
export const graphCreateBankTx = (bank_tx?: (keyof IBankTx)[]) => {
  const query = bank_tx ? bank_tx.join(" ") : "_id";
  return gql`
    mutation createBankTx($bank_tx : BankTxInputType) {
      bank_tx : createBankTx(bank_tx : $bank_tx) {
            ${query}
        }
    }`;
};
export const graphGetBankTxs = (bank_tx?: (keyof IBankTx)[]) => {
  const query = bank_tx ? bank_tx.join(" ") : "_id";
  return gql`
    query getBankTxs($keyword: BankTxInputType, $limit: Int, $skip: Int) {
      bank_txs: getBankTxs(keyword: $keyword, limit: $limit, skip: $skip) {
        ${query}
      }
    }
  `;
};
