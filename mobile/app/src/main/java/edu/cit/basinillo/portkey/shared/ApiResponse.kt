/* ================================================================== */
/*  PORTKEY — Shared API Response Wrapper (Mobile Vertical Slice)     */
/*  Standard envelope matching backend format. Used by all features.  */
/* ================================================================== */

package edu.cit.basinillo.portkey.shared

import com.google.gson.annotations.SerializedName

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
