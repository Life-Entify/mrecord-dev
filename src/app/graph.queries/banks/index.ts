import { gql } from "@apollo/client";
import { IOrgBank } from "ui";

export const graphDeleteBank = () => {
  return gql`
    mutation deleteBank($_id: String) {
      _id: deleteBank(_id: $_id) {
        _id
      }
    }
  `;
};
export const graphUpdateBank = (bank?: (keyof IOrgBank)[]) => {
  const query = bank ? bank.join(" ") : "_id";
  return gql`
    mutation updateBank($_id: String, $bank: BankInputType) {
        bank : updateBank(_id: $_id, bank: $bank) {
            ${query}
        }
    }`;
};
export const graphCreateBank = (bank?: (keyof IOrgBank)[]) => {
  const query = bank ? bank.join(" ") : "_id";
  return gql`
    mutation createBank($bank : BankInputType) {
      bank : createBank(bank : $bank) {
            ${query}
        }
    }`;
};
export const graphGetBanks = (bank?: (keyof IOrgBank)[]) => {
  const query = bank ? bank.join(" ") : "_id";
  return gql`
    query getBanks($keyword: BankInputType, $limit: Int, $skip: Int) {
      banks: getBanks(keyword: $keyword, limit: $limit, skip: $skip) {
        ${query}
      }
    }
  `;
};
