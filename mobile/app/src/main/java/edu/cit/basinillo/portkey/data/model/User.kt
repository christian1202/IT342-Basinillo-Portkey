package edu.cit.basinillo.portkey.data.model

import com.google.gson.annotations.SerializedName

data class User(
    @SerializedName("email") val email: String,
    @SerializedName("firstname") val firstname: String,
    @SerializedName("lastname") val lastname: String,
    @SerializedName("role") val role: String? = null,
    @SerializedName("plan") val plan: String? = null
) {
    val displayName: String get() = "$firstname $lastname"
    val initials: String get() = "${firstname.firstOrNull() ?: ""}${lastname.firstOrNull() ?: ""}".uppercase()
}

data class AuthResponse(
    @SerializedName("user") val user: User,
    @SerializedName("accessToken") val accessToken: String,
    @SerializedName("refreshToken") val refreshToken: String
)
