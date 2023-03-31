import { gql } from "@apollo/client";
import { ICheque } from "ui";

export const graphDeleteCheque = () => {
  return gql`
    mutation deleteCheque($_id: String) {
      _id: deleteCheque(_id: $_id) {
        _id
      }
    }
  `;
};
export const graphUpdateCheque = (cheque?: (keyof ICheque)[]) => {
  const query = cheque ? cheque.join(" ") : "_id";
  return gql`
    mutation updateCheque($_id: String, $cheque: ChequeInputType) {
        cheque : updateCheque(_id: $_id, cheque: $cheque) {
            ${query}
        }
    }`;
};
export const graphCreateCheque = (cheque?: (keyof ICheque)[]) => {
  const query = cheque ? cheque.join(" ") : "_id";
  return gql`
    mutation createCheque($cheque : ChequeInputType) {
      cheque : createCheque(cheque : $cheque) {
            ${query}
        }
    }`;
};
export const graphGetCheques = (cheque?: (keyof ICheque)[]) => {
  const query = cheque ? cheque.join(" ") : "_id";
  return gql`
    query getCheques($keyword: ChequeInputType, $limit: Int, $skip: Int) {
      cheques: getCheques(keyword: $keyword, limit: $limit, skip: $skip) {
        ${query}
      }
    }
  `;
};
