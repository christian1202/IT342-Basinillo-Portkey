package edu.cit.basinillo.portkey.ui.register

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import edu.cit.basinillo.portkey.data.model.AuthResponse
import edu.cit.basinillo.portkey.data.repository.AuthRepository
import kotlinx.coroutines.launch

class RegisterViewModel(private val authRepository: AuthRepository) : ViewModel() {

    private val _registerResult = MutableLiveData<Result<AuthResponse>>()
    val registerResult: LiveData<Result<AuthResponse>> = _registerResult

    private val _isLoading = MutableLiveData(false)
    val isLoading: LiveData<Boolean> = _isLoading

    fun register(firstname: String, lastname: String, email: String, password: String) {
        if (firstname.isBlank() || lastname.isBlank() || email.isBlank() || password.isBlank()) {
            _registerResult.value = Result.failure(Exception("All fields are required"))
            return
        }

        if (password.length < 8) {
            _registerResult.value = Result.failure(Exception("Password must be at least 8 characters"))
            return
        }

        _isLoading.value = true
        viewModelScope.launch {
            val result = authRepository.register(email, password, firstname, lastname)
            _registerResult.value = result
            _isLoading.value = false
        }
    }
}
