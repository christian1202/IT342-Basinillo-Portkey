/* ================================================================== */
/*  PORTKEY — Token Manager (Mobile Vertical Slice)                   */
/*  Manages JWT tokens using EncryptedSharedPreferences.              */
/*  Part of the shared kernel — used by all feature modules.          */
/* ================================================================== */

package edu.cit.basinillo.portkey.shared

import android.content.Context
import android.content.SharedPreferences
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey

class TokenManager(context: Context) {

    companion object {
        private const val PREFS_NAME = "portkey_secure_prefs"
        private const val KEY_ACCESS_TOKEN = "access_token"
        private const val KEY_REFRESH_TOKEN = "refresh_token"
        private const val KEY_USER_EMAIL = "user_email"
        private const val KEY_USER_FIRSTNAME = "user_firstname"
        private const val KEY_USER_LASTNAME = "user_lastname"
        private const val KEY_USER_ROLE = "user_role"
    }

    private val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()

    private val prefs: SharedPreferences = EncryptedSharedPreferences.create(
        context,
        PREFS_NAME,
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )

    fun saveTokens(accessToken: String, refreshToken: String) {
        prefs.edit()
            .putString(KEY_ACCESS_TOKEN, accessToken)
            .putString(KEY_REFRESH_TOKEN, refreshToken)
            .apply()
    }

    fun saveUserInfo(email: String, firstname: String, lastname: String, role: String?) {
        prefs.edit()
            .putString(KEY_USER_EMAIL, email)
            .putString(KEY_USER_FIRSTNAME, firstname)
            .putString(KEY_USER_LASTNAME, lastname)
            .putString(KEY_USER_ROLE, role ?: "")
            .apply()
    }

    fun getAccessToken(): String? = prefs.getString(KEY_ACCESS_TOKEN, null)
    fun getRefreshToken(): String? = prefs.getString(KEY_REFRESH_TOKEN, null)
    fun getUserEmail(): String? = prefs.getString(KEY_USER_EMAIL, null)
    fun getUserFirstname(): String? = prefs.getString(KEY_USER_FIRSTNAME, null)
    fun getUserLastname(): String? = prefs.getString(KEY_USER_LASTNAME, null)
    fun getUserRole(): String? = prefs.getString(KEY_USER_ROLE, null)

    fun getUserInitials(): String {
        val first = getUserFirstname()?.firstOrNull() ?: ""
        val last = getUserLastname()?.firstOrNull() ?: ""
        return "$first$last".uppercase()
    }

    fun isLoggedIn(): Boolean = !getAccessToken().isNullOrBlank()

    fun clearAll() {
        prefs.edit().clear().apply()
    }
}
