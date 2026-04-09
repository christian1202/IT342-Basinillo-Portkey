package edu.cit.basinillo.portkey.network

import edu.cit.basinillo.portkey.data.model.AuthResponse
import edu.cit.basinillo.portkey.data.model.Shipment
import edu.cit.basinillo.portkey.data.model.User
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface ApiService {

    // ── Auth (no Bearer token needed — interceptor sends it anyway but backend ignores) ──

    @POST("auth/login")
    suspend fun login(@Body body: LoginRequest): Response<ApiResponse<AuthResponse>>

    @POST("auth/register")
    suspend fun register(@Body body: RegisterRequest): Response<ApiResponse<AuthResponse>>

    // ── Auth (Bearer token required) ──

    @GET("auth/me")
    suspend fun getMe(): Response<ApiResponse<User>>

    // ── Shipments (Bearer token required) ──

    @GET("shipments")
    suspend fun getShipments(): Response<ApiResponse<List<Shipment>>>
}

data class LoginRequest(
    val email: String,
    val password: String
)

data class RegisterRequest(
    val email: String,
    val password: String,
    val firstname: String,
    val lastname: String
)
