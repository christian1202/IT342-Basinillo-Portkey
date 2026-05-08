/* ================================================================== */
/*  PORTKEY — Auth Repository (Mobile Vertical Slice)                 */
/*  Handles login, register, and session validation API calls.        */
/*  Co-located with the auth feature — repository, ViewModel, UI.     */
/* ================================================================== */

package edu.cit.basinillo.portkey.features.auth

import com.google.gson.Gson
import edu.cit.basinillo.portkey.shared.ApiResponse
import edu.cit.basinillo.portkey.shared.TokenManager

class AuthRepository(
    private val apiService: AuthApiService,
    private val tokenManager: TokenManager
) {

    /** Authenticate user and persist tokens on success. */
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

    /** Register a new broker account and persist tokens on success. */
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

    /** Fetch the current user's profile from the server. */
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

    /** Parse the backend error message from the response body JSON. */
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
