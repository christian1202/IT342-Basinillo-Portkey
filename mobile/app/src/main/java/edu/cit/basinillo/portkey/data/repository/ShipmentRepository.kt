package edu.cit.basinillo.portkey.data.repository

import com.google.gson.Gson
import edu.cit.basinillo.portkey.data.model.Shipment
import edu.cit.basinillo.portkey.network.ApiResponse
import edu.cit.basinillo.portkey.network.ApiService

class ShipmentRepository(
    private val apiService: ApiService
) {

    suspend fun getShipments(): Result<List<Shipment>> {
        return try {
            val response = apiService.getShipments()
            if (response.isSuccessful) {
                val body = response.body()
                if (body?.success == true && body.data != null) {
                    Result.success(body.data)
                } else {
                    val errorMsg = body?.error?.message ?: "Failed to load shipments"
                    Result.failure(Exception(errorMsg))
                }
            } else {
                val errorBody = response.errorBody()?.string()
                val errorMsg = parseErrorMessage(errorBody) ?: "Failed to load shipments (${response.code()})"
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(Exception("Network error: ${e.localizedMessage}"))
        }
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
