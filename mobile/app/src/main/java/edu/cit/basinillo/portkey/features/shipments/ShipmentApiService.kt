/* ================================================================== */
/*  PORTKEY — Shipment API Service (Mobile Vertical Slice)            */
/*  Retrofit interface for shipment endpoints.                        */
/*  Co-located with the shipments feature module.                     */
/* ================================================================== */

package edu.cit.basinillo.portkey.features.shipments

import edu.cit.basinillo.portkey.shared.ApiResponse
import retrofit2.Response
import retrofit2.http.GET

interface ShipmentApiService {

    @GET("shipments")
    suspend fun getShipments(): Response<ApiResponse<List<Shipment>>>
}
