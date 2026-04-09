# Default ProGuard rules for PortKey

# Retrofit
-keepattributes Signature
-keepattributes *Annotation*
-keep class retrofit2.** { *; }
-keepclasseswithmembers class * {
    @retrofit2.http.* <methods>;
}

# Gson
-keep class com.google.gson.** { *; }
-keep class edu.cit.basinillo.portkey.network.** { *; }
-keep class edu.cit.basinillo.portkey.data.model.** { *; }

# OkHttp
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }

# Navigation Component
-keep class androidx.navigation.** { *; }

# Coroutines
-keepclassmembers class kotlinx.coroutines.** { *; }
