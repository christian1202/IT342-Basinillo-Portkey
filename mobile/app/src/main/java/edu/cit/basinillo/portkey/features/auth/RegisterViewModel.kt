/* ================================================================== */
/*  PORTKEY — Register ViewModel (Mobile Vertical Slice)              */
/*  Auth feature — handles registration form state and API calls.     */
/*  Co-located with the auth feature module.                          */
/* ================================================================== */

package edu.cit.basinillo.portkey.features.auth

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch

class RegisterViewModel(private val authRepository: AuthRepository) : ViewModel() {

    private val _registerResult = MutableLiveData<Result<AuthResponse>>()
    val registerResult: LiveData<Result<AuthResponse>> = _registerResult

    private val _isLoading = MutableLiveData(false)
    val isLoading: LiveData<Boolean> = _isLoading

    fun register(email: String, password: String, firstName: String, lastName: String) {
        if (email.isBlank() || password.isBlank() || firstName.isBlank() || lastName.isBlank()) {
            _registerResult.value = Result.failure(Exception("All fields are required"))
            return
        }

        _isLoading.value = true
        viewModelScope.launch {
            val result = authRepository.register(email, password, firstName, lastName)
            _registerResult.value = result
            _isLoading.value = false
        }
    }
}
