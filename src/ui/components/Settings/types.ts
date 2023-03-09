export interface IOrganization {
  name: string;
  address: string;
  phones: string[];
}
export interface ISetting {
  org: IOrganization;
}
