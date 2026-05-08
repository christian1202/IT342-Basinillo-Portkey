/* ================================================================== */
/*  PORTKEY — Auth Models (Mobile Vertical Slice)                     */
/*  User and AuthResponse data classes co-located with auth feature.  */
/* ================================================================== */

package edu.cit.basinillo.portkey.features.auth

import com.google.gson.annotations.SerializedName

data class User(
    @SerializedName("id") val id: Long? = null,
    @SerializedName("email") val email: String,
    @SerializedName("firstName") val firstName: String,
    @SerializedName("lastName") val lastName: String,
    @SerializedName("role") val role: String? = null,
    @SerializedName("plan") val plan: String? = null
) {
    val displayName: String get() = "$firstName $lastName"
    val initials: String get() = "${firstName.firstOrNull() ?: ""}${lastName.firstOrNull() ?: ""}".uppercase()
}

data class AuthResponse(
    @SerializedName("user") val user: User,
    @SerializedName("accessToken") val accessToken: String,
    @SerializedName("refreshToken") val refreshToken: String
)
