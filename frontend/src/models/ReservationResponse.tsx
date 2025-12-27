export interface ReservationResponse {
    id: number;
    spot_id: number;
    start: string;
    end: string;
}

export interface CreateReservationSuccessResponse {
    message: string;
    reservation: ReservationResponse;
}
