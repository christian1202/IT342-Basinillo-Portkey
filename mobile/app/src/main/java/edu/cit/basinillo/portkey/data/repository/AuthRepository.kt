package edu.cit.basinillo.portkey.data.repository

import com.google.gson.Gson
import edu.cit.basinillo.portkey.data.local.TokenManager
import edu.cit.basinillo.portkey.data.model.AuthResponse
import edu.cit.basinillo.portkey.data.model.User
import edu.cit.basinillo.portkey.network.ApiResponse
import edu.cit.basinillo.portkey.network.ApiService
import edu.cit.basinillo.portkey.network.LoginRequest
import edu.cit.basinillo.portkey.network.RegisterRequest

class AuthRepository(
    private val apiService: ApiService,
    private val tokenManager: TokenManager
) {

    suspend fun login(email: String, password: String): Result<AuthResponse> {
        return try {
            val response = apiService.login(LoginRequest(email, password))
            if (response.isSuccessful) {
                val body = response.body()
                if (body?.success == true && body.data != null) {
                    tokenManager.saveTokens(body.data.accessToken, body.data.refreshToken)
                    tokenManager.saveUserInfo(
                        body.data.user.email,
                        body.data.user.firstName,
                        body.data.user.lastName,
                        body.data.user.role
                    )
                    Result.success(body.data)
                } else {
                    val errorMsg = body?.error?.message ?: "Login failed"
                    Result.failure(Exception(errorMsg))
                }
            } else {
                val errorBody = response.errorBody()?.string()
                val errorMsg = parseErrorMessage(errorBody) ?: "Login failed (${response.code()})"
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(Exception("Network error: ${e.localizedMessage}"))
        }
    }

    suspend fun register(
        email: String,
        password: String,
        firstName: String,
        lastName: String
    ): Result<AuthResponse> {
        return try {
            val response = apiService.register(
                RegisterRequest(email, password, firstName, lastName)
            )
            if (response.isSuccessful) {
                val body = response.body()
                if (body?.success == true && body.data != null) {
                    tokenManager.saveTokens(body.data.accessToken, body.data.refreshToken)
                    tokenManager.saveUserInfo(
                        body.data.user.email,
                        body.data.user.firstName,
                        body.data.user.lastName,
                        body.data.user.role
                    )
                    Result.success(body.data)
                } else {
                    val errorMsg = body?.error?.message ?: "Registration failed"
                    Result.failure(Exception(errorMsg))
                }
            } else {
                val errorBody = response.errorBody()?.string()
                val errorMsg = parseErrorMessage(errorBody) ?: "Registration failed (${response.code()})"
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(Exception("Network error: ${e.localizedMessage}"))
        }
    }

    suspend fun getMe(): Result<User> {
        return try {
            val response = apiService.getMe()
            if (response.isSuccessful) {
                val body = response.body()
                if (body?.success == true && body.data != null) {
                    Result.success(body.data)
                } else {
                    Result.failure(Exception(body?.error?.message ?: "Failed to fetch profile"))
                }
            } else {
                Result.failure(Exception("Failed to fetch profile (${response.code()})"))
            }
        } catch (e: Exception) {
            Result.failure(Exception("Network error: ${e.localizedMessage}"))
        }
    }

    fun isLoggedIn(): Boolean = tokenManager.isLoggedIn()

    fun logout() {
        tokenManager.clearAll()
    }

    private fun parseErrorMessage(errorBody: String?): String? {
        if (errorBody.isNullOrBlank()) return null
        return try {
            val apiResponse = Gson().fromJson(errorBody, ApiResponse::class.java)
            apiResponse.error?.message
        } catch (_: Exception) {
            null
        }
    }
}
