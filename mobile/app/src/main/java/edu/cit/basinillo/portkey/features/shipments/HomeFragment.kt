/* ================================================================== */
/*  PORTKEY — Home Fragment (Mobile Vertical Slice)                   */
/*  Shipments feature — dashboard/home screen with shipment list.     */
/*  Co-located with the shipments feature module.                     */
/* ================================================================== */

package edu.cit.basinillo.portkey.features.shipments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.snackbar.Snackbar
import edu.cit.basinillo.portkey.R
import edu.cit.basinillo.portkey.databinding.FragmentHomeBinding
import edu.cit.basinillo.portkey.features.auth.AuthRepository
import edu.cit.basinillo.portkey.shared.TokenManager
import edu.cit.basinillo.portkey.shared.RetrofitClient

class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: HomeViewModel
    private lateinit var shipmentAdapter: ShipmentAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Wire dependencies using shared infrastructure
        val tokenManager = TokenManager(requireContext())
        val authRepository = AuthRepository(RetrofitClient.authApiService, tokenManager)
        val shipmentRepository = ShipmentRepository(RetrofitClient.shipmentApiService)
        viewModel = ViewModelProvider(
            this,
            HomeViewModelFactory(shipmentRepository, authRepository)
        )[HomeViewModel::class.java]

        setupToolbar()
        setupRecyclerView()
        setupSwipeRefresh()
        setupFab()
        observeViewModel()
    }

    private fun setupToolbar() {
        val tokenManager = TokenManager(requireContext())
        val initials = tokenManager.getUserInitials()
        binding.tvUserInitial.text = initials.ifBlank { "U" }

        binding.toolbar.inflateMenu(R.menu.menu_home)
        binding.toolbar.setOnMenuItemClickListener { menuItem ->
            when (menuItem.itemId) {
                R.id.action_logout -> {
                    viewModel.logout()
                    findNavController().navigate(R.id.action_home_to_login)
                    true
                }
                else -> false
            }
        }
    }

    private fun setupRecyclerView() {
        shipmentAdapter = ShipmentAdapter()
        binding.rvShipments.apply {
            layoutManager = LinearLayoutManager(requireContext())
            adapter = shipmentAdapter
            setHasFixedSize(true)
        }
    }

    private fun setupSwipeRefresh() {
        binding.swipeRefresh.setOnRefreshListener {
            viewModel.loadShipments()
        }
        binding.swipeRefresh.setColorSchemeResources(
            R.color.primary,
            R.color.urgency_yellow,
            R.color.urgency_green
        )
    }

    private fun setupFab() {
        binding.fabCreateShipment.setOnClickListener {
            Snackbar.make(binding.root, "Create Shipment coming soon", Snackbar.LENGTH_SHORT).show()
        }
    }

    private fun observeViewModel() {
        viewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
            binding.swipeRefresh.isRefreshing = isLoading
        }

        viewModel.shipments.observe(viewLifecycleOwner) { shipments ->
            shipmentAdapter.submitList(shipments)
            binding.layoutEmpty.visibility = if (shipments.isEmpty()) View.VISIBLE else View.GONE
            binding.rvShipments.visibility = if (shipments.isEmpty()) View.GONE else View.VISIBLE
        }

        viewModel.error.observe(viewLifecycleOwner) { errorMsg ->
            if (!errorMsg.isNullOrBlank()) {
                Snackbar.make(binding.root, errorMsg, Snackbar.LENGTH_LONG)
                    .setBackgroundTint(resources.getColor(R.color.urgency_red, null))
                    .show()
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

/** Factory for creating HomeViewModel with its repository dependencies. */
class HomeViewModelFactory(
    private val shipmentRepository: ShipmentRepository,
    private val authRepository: AuthRepository
) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : androidx.lifecycle.ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(HomeViewModel::class.java)) {
            return HomeViewModel(shipmentRepository, authRepository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class: ${modelClass.name}")
    }
}
