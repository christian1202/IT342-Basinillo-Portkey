package edu.cit.basinillo.portkey.network

import com.google.gson.annotations.SerializedName

/**
 * Standard API response wrapper matching backend format:
 * { "success": true, "data": {}, "error": { "code": "...", "message": "..." }, "timestamp": "..." }
 */
data class ApiResponse<T>(
    @SerializedName("success") val success: Boolean,
    @SerializedName("data") val data: T?,
    @SerializedName("error") val error: ApiError?,
    @SerializedName("timestamp") val timestamp: String?
)

data class ApiError(
    @SerializedName("code") val code: String?,
    @SerializedName("message") val message: String?,
    @SerializedName("details") val details: Any?
)
