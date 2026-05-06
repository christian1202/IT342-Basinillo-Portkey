/* ================================================================== */
/*  PORTKEY — Shipment Adapter (Mobile Vertical Slice)                */
/*  RecyclerView adapter for the shipment list. Urgency colors set    */
/*  programmatically — never hardcoded in XML.                        */
/*  Co-located with the shipments feature module.                     */
/* ================================================================== */

package edu.cit.basinillo.portkey.features.shipments

import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.card.MaterialCardView
import edu.cit.basinillo.portkey.R

class ShipmentAdapter : ListAdapter<Shipment, ShipmentAdapter.ShipmentViewHolder>(ShipmentDiffCallback()) {

    companion object {
        // Urgency colors — set programmatically per requirement, never hardcoded in XML
        private const val COLOR_GREEN = "#4CAF50"
        private const val COLOR_YELLOW = "#FF9800"
        private const val COLOR_RED = "#F44336"
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ShipmentViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_shipment, parent, false)
        return ShipmentViewHolder(view)
    }

    override fun onBindViewHolder(holder: ShipmentViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class ShipmentViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val card: MaterialCardView = itemView.findViewById(R.id.card_shipment)
        private val tvVesselName: TextView = itemView.findViewById(R.id.tv_vessel_name)
        private val tvClientName: TextView = itemView.findViewById(R.id.tv_client_name)
        private val tvContainerNumber: TextView = itemView.findViewById(R.id.tv_container_number)
        private val tvStatus: TextView = itemView.findViewById(R.id.tv_status)
        private val tvUrgencyBadge: TextView = itemView.findViewById(R.id.tv_urgency_badge)
        private val tvDaysLeft: TextView = itemView.findViewById(R.id.tv_days_left)
        private val urgencyStrip: View = itemView.findViewById(R.id.urgency_strip)

        fun bind(shipment: Shipment) {
            tvVesselName.text = shipment.vesselName
            tvClientName.text = shipment.clientName
            tvContainerNumber.text = shipment.containerNumbers
            tvStatus.text = shipment.statusDisplay

            // Urgency color — set programmatically, never hardcoded in XML
            val urgencyColor = when (shipment.lane.uppercase()) {
                "GREEN" -> Color.parseColor(COLOR_GREEN)
                "YELLOW" -> Color.parseColor(COLOR_YELLOW)
                "RED" -> Color.parseColor(COLOR_RED)
                else -> Color.parseColor(COLOR_GREEN)
            }

            tvUrgencyBadge.text = shipment.lane.uppercase()
            tvUrgencyBadge.setTextColor(Color.WHITE)
            tvUrgencyBadge.background?.setTint(urgencyColor)
            urgencyStrip.setBackgroundColor(urgencyColor)

            // Days left countdown
            val days = shipment.daysLeft
            if (days != null) {
                tvDaysLeft.visibility = View.VISIBLE
                tvDaysLeft.text = when {
                    days <= 0 -> "OVERDUE"
                    days == 1L -> "1 day left"
                    else -> "$days days left"
                }
                tvDaysLeft.setTextColor(urgencyColor)
            } else {
                tvDaysLeft.visibility = View.GONE
            }
        }
    }

    class ShipmentDiffCallback : DiffUtil.ItemCallback<Shipment>() {
        override fun areItemsTheSame(oldItem: Shipment, newItem: Shipment): Boolean =
            oldItem.id == newItem.id

        override fun areContentsTheSame(oldItem: Shipment, newItem: Shipment): Boolean =
            oldItem == newItem
    }
}
