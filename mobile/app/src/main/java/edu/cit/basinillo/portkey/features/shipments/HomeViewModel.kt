/* ================================================================== */
/*  PORTKEY — Home ViewModel (Mobile Vertical Slice)                  */
/*  Manages shipment list state and logout for the home/dashboard.    */
/*  Co-located with the shipments feature module.                     */
/* ================================================================== */

package edu.cit.basinillo.portkey.features.shipments

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import edu.cit.basinillo.portkey.features.auth.AuthRepository
import kotlinx.coroutines.launch

class HomeViewModel(
    private val shipmentRepository: ShipmentRepository,
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _shipments = MutableLiveData<List<Shipment>>()
    val shipments: LiveData<List<Shipment>> = _shipments

    private val _isLoading = MutableLiveData(false)
    val isLoading: LiveData<Boolean> = _isLoading

    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error

    init {
        loadShipments()
    }

    fun loadShipments() {
        _isLoading.value = true
        _error.value = null
        viewModelScope.launch {
            val result = shipmentRepository.getShipments()
            result.onSuccess { list ->
                _shipments.value = list
                _error.value = null
            }
            result.onFailure { e ->
                _error.value = e.message ?: "Failed to load shipments"
                _shipments.value = emptyList()
            }
            _isLoading.value = false
        }
    }

    fun logout() {
        authRepository.logout()
    }
}
