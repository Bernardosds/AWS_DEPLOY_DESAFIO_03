import IRentalRequestEntity from "./IRentalRequestEntity";

export default interface IResquestRepository extends IRentalRequestEntity {
  create(request: IRentalRequestEntity): Promise<string>;
  
}
