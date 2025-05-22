class ApiError extends Error{
    constructor(statuscode, message="something went wrong"){
        super(message)
        this.statuscode = statuscode
        this.message = message
        this.success = false
    }
}

export {ApiError}