type IRentalRequestParams = {
    
}

export default interface ICreateRentalRequest {
    execute(data: IRentalRequestParams): Promise<string>
}