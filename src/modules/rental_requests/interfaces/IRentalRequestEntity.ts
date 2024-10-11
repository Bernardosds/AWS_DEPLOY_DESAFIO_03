export default interface IRentalRequestEntity {
    id?: string;
    dateRequest?: Date;
    statusRequest?: string;
    cep?: string;
    cidade?: string;
    uf?: string;
    cpf_pedido: string
    rentalTax: number;
    totalValue: number;
    startDate: Date;
    endDate: Date;
    cancelDate: Date
    finishData: Date
    fine: number;
}