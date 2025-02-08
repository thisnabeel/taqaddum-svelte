<script>
	import { goto } from '$app/navigation';
	import { user, userView } from '$lib/stores/user';

	export let logo = 'Taqaddum';

	let menuOpen = false;

	function visit(link) {
		goto(link);
		menuOpen = !menuOpen;
	}
</script>

<nav class="navbar">
	<div class="left">
		<div class="logo" on:click={() => visit('/')}>
			<img src="/logo-icon.png" alt="Logo" />
		</div>

		<!-- Hamburger Menu Toggle (Visible on Mobile) -->
		<button class="hamburger" on:click={() => (menuOpen = !menuOpen)}>
			<i class="fa fa-bars"></i>
		</button>
	</div>

	<!-- Nav Links (Hidden in Mobile by Default) -->
	<ul class="nav-links {menuOpen ? 'open' : ''}">
		{#if $user}
			{#if $userView === 'mentor'}
				<li>
					<a href="/users/offerings" on:click={() => (menuOpen = false)}
						><i class="fa fa-university"></i> My Offerings +</a
					>
				</li>
				<li>
					<a href="/users/calendar" on:click={() => (menuOpen = false)}
						><i class="fa fa-calendar"></i> My Availability =</a
					>
				</li>
				<li>
					<a href="/users/slots" on:click={() => (menuOpen = false)}
						><i class="fa fa-lightbulb-o"></i> Generated Slots</a
					>
				</li>
			{:else if $userView === 'mentee'}
				<li>
					<a href="/users/calendar" on:click={() => (menuOpen = false)}
						><i class="fa fa-calendar"></i> My Availability</a
					>
				</li>
				<li>
					<a href="/users/slots" on:click={() => (menuOpen = false)}
						><i class="fa fa-lightbulb-o"></i> Recommended Sessions</a
					>
				</li>
			{/if}

			<!-- Show user's name & sign out inside mobile dropdown -->

			<li class="mobile-user">
				<span on:click={() => visit('/users/edit')}>{$user.first_name} {$user.last_name}</span>
				<button class="signout" on:click={() => user.set(null)}>
					<i class="fa fa-sign-out"></i> Sign Out
				</button>
			</li>
		{:else}
			<li class="mobile-user">
				<button class="login" on:click={() => visit('/users/sign_in')}>Log In</button>
				<a class="signup clean" style="color: #fff" on:click={() => visit('/users/sign_up')}
					>Get Started</a
				>
			</li>
		{/if}
	</ul>

	<!-- Desktop Auth Buttons -->
	<div class="auth-buttons">
		{#if !$user}
			<button class="login" on:click={() => visit('/users/sign_in')}>Log In</button>
			<a class="signup clean" on:click={() => visit('/users/sign_up')}>Get Started</a>
		{:else}
			<!-- <button
				class="btn"
				on:click={() => userView.set($userView === 'mentor' ? 'mentee' : 'mentor')}
				>Mentee <i
					class="fa"
					class:fa-toggle-on={$userView === 'mentor'}
					class:fa-toggle-off={$userView === 'mentee'}
				></i> Mentor</button
			> -->

			<button class="btn" on:click={() => visit('/users/edit')}>
				<img src={$user.avatar_cropped_url} class="mentor-avatar" />
				{$user.first_name}
				{$user.last_name}</button
			>
			<button class="login" on:click={() => user.set(null)}>Sign Out</button>
		{/if}
	</div>
</nav>

<style>
	.mentor-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
		border: 4px solid white;
		box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.2);
	}
	.navbar {
		display: flex;
		justify-content: space-between;
		/* align-items: center; */
		align-items: baseline;
		padding: 15px 20px;
		background: white;
		border-bottom: 1px solid #ddd;
		position: relative;
	}

	.left {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.logo img {
		max-width: 30px;
		cursor: pointer;
	}

	.nav-links {
		display: flex;
		list-style: none;
		gap: 20px;
		transition: max-height 0.3s ease-in-out;
	}

	.nav-links a {
		text-decoration: none;
		color: black;
	}

	.auth-buttons {
		display: flex;
		gap: 10px;
	}

	.login,
	.signup {
		border: none;
		padding: 8px 12px;
		cursor: pointer;
	}

	.signup {
		background: black;
		color: white;
		border-radius: 5px;
	}

	.mobile-user,
	.hamburger {
		display: none;
	}

	/* Mobile View */
	@media (max-width: 768px) {
		.hamburger {
			display: block;
			background: none;
			border: none;
			font-size: 22px;
			cursor: pointer;
		}

		.nav-links {
			position: absolute;
			top: 60px;
			left: 0;
			width: 100%;
			background: white;
			flex-direction: column;
			gap: 10px;
			padding: 10px;
			display: none;
			border-top: 1px solid #ddd;
			z-index: 999;
		}

		.nav-links.open {
			display: flex;
		}

		.auth-buttons {
			display: none;
		}

		.mobile-user {
			display: flex;
			justify-content: space-between;
			align-items: center;
			background: #f8f8f8;
			padding: 10px;
			border-radius: 5px;
		}

		.mobile-user span {
			font-weight: bold;
		}

		.signout {
			border: none;
			background: none;
			cursor: pointer;
			color: red;
			display: flex;
			align-items: center;
			gap: 5px;
		}

		.signout i {
			font-size: 14px;
		}
	}
</style>
