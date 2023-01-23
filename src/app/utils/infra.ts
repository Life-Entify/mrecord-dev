export interface IInfrastructureProps {}
export async function validateInfra(infra: Promise<IInfrastructureProps>) {
  let appInfra: IInfrastructureProps = await infra;
  if (!appInfra) {
  }
  return appInfra;
}
export async function setupInfra() {
  return {};
}
