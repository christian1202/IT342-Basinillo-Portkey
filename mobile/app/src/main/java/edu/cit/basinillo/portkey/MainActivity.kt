package edu.cit.basinillo.portkey

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.fragment.NavHostFragment
import edu.cit.basinillo.portkey.data.local.TokenManager
import edu.cit.basinillo.portkey.network.RetrofitClient

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Initialize RetrofitClient with TokenManager so AuthInterceptor can read tokens
        val tokenManager = TokenManager(applicationContext)
        RetrofitClient.init(tokenManager)

        // NavHostFragment handles all navigation via nav_graph.xml
        val navHostFragment = supportFragmentManager
            .findFragmentById(R.id.nav_host_fragment) as NavHostFragment
        val navController = navHostFragment.navController

        // If user is already logged in, skip login and go straight to home
        if (tokenManager.isLoggedIn()) {
            val navGraph = navController.navInflater.inflate(R.navigation.nav_graph)
            navGraph.setStartDestination(R.id.homeFragment)
            navController.graph = navGraph
        }
    }
}
