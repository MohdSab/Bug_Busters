type ResponseDTO<T> = {
    error? : null,
    data: T
}

export default ResponseDTO;