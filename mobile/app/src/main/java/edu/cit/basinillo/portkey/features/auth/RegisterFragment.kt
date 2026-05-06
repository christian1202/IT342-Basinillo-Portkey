/* ================================================================== */
/*  PORTKEY — Register Fragment (Mobile Vertical Slice)               */
/*  Auth feature — registration form screen.                          */
/*  Co-located with the auth feature module.                          */
/* ================================================================== */

package edu.cit.basinillo.portkey.features.auth

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import com.google.android.material.snackbar.Snackbar
import edu.cit.basinillo.portkey.R
import edu.cit.basinillo.portkey.databinding.FragmentRegisterBinding
import edu.cit.basinillo.portkey.shared.TokenManager
import edu.cit.basinillo.portkey.shared.RetrofitClient

class RegisterFragment : Fragment() {

    private var _binding: FragmentRegisterBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: RegisterViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentRegisterBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Wire dependencies using shared infrastructure
        val tokenManager = TokenManager(requireContext())
        val authRepository = AuthRepository(RetrofitClient.apiService, tokenManager)
        viewModel = ViewModelProvider(
            this,
            RegisterViewModelFactory(authRepository)
        )[RegisterViewModel::class.java]

        setupListeners()
        observeViewModel()
    }

    private fun setupListeners() {
        binding.btnRegister.setOnClickListener {
            val email = binding.etEmail.text?.toString()?.trim() ?: ""
            val password = binding.etPassword.text?.toString()?.trim() ?: ""
            val firstName = binding.etFirstname.text?.toString()?.trim() ?: ""
            val lastName = binding.etLastname.text?.toString()?.trim() ?: ""
            viewModel.register(email, password, firstName, lastName)
        }

        binding.tvLoginLink.setOnClickListener {
            findNavController().navigateUp()
        }
    }

    private fun observeViewModel() {
        viewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
            binding.btnRegister.isEnabled = !isLoading
            binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        }

        viewModel.registerResult.observe(viewLifecycleOwner) { result ->
            result.onSuccess {
                findNavController().navigate(R.id.action_register_to_home)
            }
            result.onFailure { error ->
                Snackbar.make(binding.root, error.message ?: "Registration failed", Snackbar.LENGTH_LONG)
                    .setBackgroundTint(requireContext().getColor(R.color.urgency_red))
                    .show()
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

/** Factory for creating RegisterViewModel with its AuthRepository dependency. */
class RegisterViewModelFactory(
    private val authRepository: AuthRepository
) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : androidx.lifecycle.ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(RegisterViewModel::class.java)) {
            return RegisterViewModel(authRepository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class: ${modelClass.name}")
    }
}
