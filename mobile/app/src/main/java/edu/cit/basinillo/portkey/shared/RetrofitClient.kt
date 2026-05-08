/* ================================================================== */
/*  PORTKEY — Retrofit Client (Mobile Vertical Slice)                 */
/*  Singleton HTTP client with JWT interceptor. Shared infrastructure. */
/*  Used by all feature modules via lazy-initialized API services.     */
/* ================================================================== */

package edu.cit.basinillo.portkey.shared

import edu.cit.basinillo.portkey.BuildConfig
import edu.cit.basinillo.portkey.features.auth.AuthApiService
import edu.cit.basinillo.portkey.features.shipments.ShipmentApiService
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object RetrofitClient {

    private var tokenManager: TokenManager? = null

    /** Must be called once during app startup (MainActivity.onCreate). */
    fun init(tokenManager: TokenManager) {
        this.tokenManager = tokenManager
    }

    /**
     * OkHttp interceptor that attaches the Bearer token to every request.
     * Reads token from EncryptedSharedPreferences via TokenManager.
     */
    private val authInterceptor = Interceptor { chain ->
        val original = chain.request()
        val token = tokenManager?.getAccessToken()
        val request = if (!token.isNullOrBlank()) {
            original.newBuilder()
                .header("Authorization", "Bearer $token")
                .header("Content-Type", "application/json")
                .build()
        } else {
            original.newBuilder()
                .header("Content-Type", "application/json")
                .build()
        }
        chain.proceed(request)
    }

    /** Logging interceptor for debug builds only. */
    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = if (BuildConfig.DEBUG) {
            HttpLoggingInterceptor.Level.BODY
        } else {
            HttpLoggingInterceptor.Level.NONE
        }
    }

    private val okHttpClient: OkHttpClient by lazy {
        OkHttpClient.Builder()
            .addInterceptor(authInterceptor)
            .addInterceptor(loggingInterceptor)
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .build()
    }

    val instance: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BuildConfig.API_BASE_URL.trimEnd('/') + "/")
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    /** Feature-specific API service instances (lazy-initialized). */

    val authApiService: AuthApiService by lazy {
        instance.create(AuthApiService::class.java)
    }

    val shipmentApiService: ShipmentApiService by lazy {
        instance.create(ShipmentApiService::class.java)
    }
}
