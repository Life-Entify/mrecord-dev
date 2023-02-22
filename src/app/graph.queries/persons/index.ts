import { gql } from "@apollo/client";
import { IPersonQueryArray, NestedPersonObject, QPerson } from "./types";

function queryStringBuilder(
  query: (keyof QPerson)[] | IPersonQueryArray,
  nestedValues?: NestedPersonObject
) {
  let queryString = "";
  for (let i = 0; i < query.length; i++) {
    const element = query[i];
    if (nestedValues?.[element as keyof NestedPersonObject]) {
      queryString += `${element} { ${queryStringBuilder(
        nestedValues[element as keyof NestedPersonObject] as IPersonQueryArray,
        nestedValues
      )} }`;
    } else queryString += `${element} `;
  }
  return queryString;
}
export const graphGetPersonsByID = (
  person?: (keyof QPerson)[],
  nestedValues?: NestedPersonObject
) => {
  const query = person ? queryStringBuilder(person, nestedValues) : "_id";
  return gql`
    query getPersonsByID($_ids: [String]) {
      persons : getPersonsByID(_ids: $_ids) {
            ${query}
        }
    }`;
};
export const graphGetPersons = (
  person?: (keyof QPerson)[],
  nestedValues?: NestedPersonObject
) => {
  const query = person ? queryStringBuilder(person, nestedValues) : "_id";
  return gql`
    query getPersons($keyword: KeywordPersonInputType, $skip : Int, $limit: Int) {
      persons : getPersons(keyword: $keyword, skip : $skip, limit: $limit) {
            ${query}
        }
    }`;
};
export const graphCreatePerson = (
  person?: (keyof QPerson)[],
  nestedValues?: NestedPersonObject
) => {
  const query = person ? queryStringBuilder(person, nestedValues) : "_id";
  return gql`
    mutation createPerson($profile: ProfileInputType) {
      person: createPerson(profile: $profile){
        ${query}
      }
    }
  `;
};
