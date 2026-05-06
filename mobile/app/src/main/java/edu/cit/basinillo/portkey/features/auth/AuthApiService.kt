/* ================================================================== */
/*  PORTKEY — Auth API Service (Mobile Vertical Slice)                */
/*  Retrofit interface for auth endpoints.                            */
/*  Co-located with the auth feature module.                          */
/* ================================================================== */

package edu.cit.basinillo.portkey.features.auth

import edu.cit.basinillo.portkey.shared.ApiResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface AuthApiService {

    @POST("auth/login")
    suspend fun login(@Body body: LoginRequest): Response<ApiResponse<AuthResponse>>

    @POST("auth/register")
    suspend fun register(@Body body: RegisterRequest): Response<ApiResponse<AuthResponse>>

    @GET("auth/me")
    suspend fun getMe(): Response<ApiResponse<User>>
}

// ── Request DTOs (co-located with the auth feature) ─────────────

data class LoginRequest(
    val email: String,
    val password: String
)

data class RegisterRequest(
    val email: String,
    val password: String,
    val firstName: String,
    val lastName: String
)
