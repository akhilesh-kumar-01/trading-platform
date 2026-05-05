package com.zosh.config;

import com.zosh.repository.UserRepository;
import com.zosh.service.WalletService;
import com.zosh.service.WatchlistService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;

@Configuration
public class AppConfig {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private WalletService walletService;

	@Autowired
	private WatchlistService watchlistService;
	
	 @Bean
	    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

	        http.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
	                .authorizeHttpRequests(Authorize -> Authorize
//	                		.requestMatchers("/api/admin/**").hasRole("ADMIN")
	                                .requestMatchers("/api/**").authenticated()
	                                
	                                .anyRequest().permitAll()
	                )
	                .oauth2Login(oauth->{
						oauth.loginPage("/login/google");
						oauth.authorizationEndpoint(authorization->
								authorization.baseUri("/login/oauth2/authorization"));
						oauth.successHandler(new AuthenticationSuccessHandler() {

							@Override
							public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
																Authentication authentication) throws IOException, ServletException {

								if(authentication.getPrincipal() instanceof DefaultOAuth2User) {
									DefaultOAuth2User userDetails = (DefaultOAuth2User) authentication.getPrincipal();
									String email = userDetails.getAttribute("email");
									String fullName = userDetails.getAttribute("name");
									String picture = userDetails.getAttribute("picture");

									com.zosh.model.User user = userRepository.findByEmail(email);
									if(user == null) {
										user = new com.zosh.model.User();
										user.setEmail(email);
										user.setFullName(fullName);
										user.setPicture(picture);
										user.setPassword(""); // No password for OAuth
										user = userRepository.save(user);
										
										// Initialize user account
										walletService.getUserWallet(user);
										watchlistService.createWatchList(user);
									}

									String jwt = JwtProvider.generateToken(authentication);
									String targetUrl = "http://localhost:5173/login-success?jwt=" + jwt;
									response.sendRedirect(targetUrl);
								}
							}
						});
					})
	                .addFilterBefore(new JwtTokenValidator(), BasicAuthenticationFilter.class)
	                .csrf(csrf -> csrf.disable())
	                .cors(cors -> cors.configurationSource(corsConfigurationSource()));
	               
			
			return http.build();
			
		}
		
	    // CORS Configuration
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:4200",
            "https://zosh-treading.vercel.app"
        ));
        cfg.setAllowedMethods(Collections.singletonList("*"));
        cfg.setAllowCredentials(true);
        cfg.setAllowedHeaders(Collections.singletonList("*"));
        cfg.setExposedHeaders(Arrays.asList("Authorization"));
        cfg.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }

	    @Bean
	    PasswordEncoder passwordEncoder() {
			return new BCryptPasswordEncoder();
		}


}
