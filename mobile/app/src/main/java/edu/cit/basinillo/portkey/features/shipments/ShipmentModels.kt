/* ================================================================== */
/*  PORTKEY — Shipment Models (Mobile Vertical Slice)                 */
/*  Shipment data class co-located with the shipments feature.        */
/* ================================================================== */

package edu.cit.basinillo.portkey.features.shipments

import com.google.gson.annotations.SerializedName
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

data class Shipment(
    @SerializedName("id") val id: Long,
    @SerializedName("vessel_name") val vesselName: String,
    @SerializedName("client_name") val clientName: String,
    @SerializedName("container_numbers") val containerNumbers: String,
    @SerializedName("status") val status: String,
    @SerializedName("lane") val lane: String,
    @SerializedName("doomsday_date") val doomsdayDate: String?,
    @SerializedName("voyage_number") val voyageNumber: String? = null,
    @SerializedName("entry_number") val entryNumber: String? = null
) {
    /**
     * Calculates days remaining until doomsday_date.
     * Returns null if doomsday_date is null or unparseable.
     */
    val daysLeft: Long?
        get() {
            if (doomsdayDate.isNullOrBlank()) return null
            return try {
                val target = LocalDate.parse(doomsdayDate, DateTimeFormatter.ISO_LOCAL_DATE)
                ChronoUnit.DAYS.between(LocalDate.now(), target)
            } catch (_: Exception) {
                null
            }
        }

    val statusDisplay: String
        get() = status.replace("_", " ")
            .lowercase()
            .replaceFirstChar { it.uppercase() }
}
