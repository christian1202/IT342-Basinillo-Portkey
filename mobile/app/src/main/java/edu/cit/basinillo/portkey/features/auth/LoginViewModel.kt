/* ================================================================== */
/*  PORTKEY — Login ViewModel (Mobile Vertical Slice)                 */
/*  Auth feature — handles login form state and API calls.            */
/*  Co-located with the auth feature module.                          */
/* ================================================================== */

package edu.cit.basinillo.portkey.features.auth

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch

class LoginViewModel(private val authRepository: AuthRepository) : ViewModel() {

    private val _loginResult = MutableLiveData<Result<AuthResponse>>()
    val loginResult: LiveData<Result<AuthResponse>> = _loginResult

    private val _isLoading = MutableLiveData(false)
    val isLoading: LiveData<Boolean> = _isLoading

    fun login(email: String, password: String) {
        if (email.isBlank() || password.isBlank()) {
            _loginResult.value = Result.failure(Exception("Email and password are required"))
            return
        }

        _isLoading.value = true
        viewModelScope.launch {
            val result = authRepository.login(email, password)
            _loginResult.value = result
            _isLoading.value = false
        }
    }

    fun isLoggedIn(): Boolean = authRepository.isLoggedIn()
}
