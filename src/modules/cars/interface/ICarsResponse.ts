import Cars from '../entities/Cars';

export default interface ICarsResponse {
  data: Cars[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}
